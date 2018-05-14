const Spotify = require("./platforms/spotify");

const telegram = require("./platforms/telegram");
const discord = require("./platforms/discord");
const commands = require("./commands");
const Config = require("./config");
const defaultConfig = require("./config.json");

const config = new Config(defaultConfig);

const SpotifyApi = new Spotify({
  client_id: config.get().spotify.client_id,
  client_secret: config.get().spotify.client_secret,
  redirect_uri: config.get().spotify.redirect_uri
});

const PLATFORMS = { telegram, discord };
let ACTIVE_PLATFORM = {};

const initCommands = async () => {
  commands.add("start", () => {});

  commands.add("create", async data => {
    const playlistName = data.args.join(" ");

    let res = await SpotifyApi.createPlaylist(
      playlistName,
      config.get().spotify.user_name
    );

    data.error = res.error || null;
    data.res = res;
    if (!res.error) {
      data.message = `Successfully created playlist: [${playlistName}](${
        res.external_urls.spotify
      })`;
    }
    config.set({ spotify: { selected_playlist: res.id } });
  });

  commands.add("select", async data => {
    const playlistUrl = data.args.join("");
    const playlistRegex = /^https?:\/\/(?:open|play)\.spotify\.com\/user\/([\w\d]+)\/playlist\/([\w\d]+$)/i;

    const regexRes = playlistRegex.exec(playlistUrl);

    console.log(regexRes);

    if (!regexRes || !regexRes[2]) {
      data.error = new Error("Invalid input url");
      return;
    }

    data.message = `[Playlist](${playlistUrl}) has been selected`;

    config.set({ spotify: { selected_playlist: regexRes[2] } });
  });

  commands.add("add", async data => {
    const trackRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
    const url = data.args.join("");

    const regexRes = trackRegex.exec(url);

    if (!config.get().spotify.selected_playlist) {
      data.error = new Error("No selected playlist");
      return;
    }

    if (!regexRes || !regexRes[1]) {
      data.error = new Error("Invalid input url");
      return;
    }

    let trackId = regexRes[1];

    let { user_name, selected_playlist } = config.get().spotify;

    let res = await SpotifyApi.addSongToPlaylist(
      trackId,
      selected_playlist,
      user_name
    );

    data.error = res.error || null;
    data.res = res;

    let playlistUrl =
      "https://open.spotify.com/user/" +
      user_name +
      "/playlist/" +
      selected_playlist;

    if (!res.error) {
      data.message = `[Song](${url}) has been added to [playlist](${[
        playlistUrl
      ]})`;
    }
  });
};

const generateApiResponse = async (status, body) => {
  await config.save();

  const response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };

  if (ACTIVE_PLATFORM.sendBotResponse) {
    await ACTIVE_PLATFORM.sendBotResponse({ ...response, body }, config);
  }

  return response;
};

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await config.load();

  if (
    !event.queryStringParameters ||
    !event.queryStringParameters.platform ||
    !PLATFORMS[event.queryStringParameters.platform]
  ) {
    callback(
      null,
      await generateApiResponse(404, { message: "Invalid platform" })
    );
    return;
  }

  console.log(event);

  const platform = event.queryStringParameters.platform;
  ACTIVE_PLATFORM = PLATFORMS[platform];

  let spotify_access_token = config.get().spotify.tokens.access_token;
  let spotify_refresh_token = config.get().spotify.tokens.refresh_token;

  /* if (!spotify_access_token || !spotify_refresh_token) {
    const token_url = SpotifyApi.generateAccessUrl([
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private",
      "user-library-read",
      "user-library-modify"
    ]);

    callback(
      null,
      await generateApiResponse(400, {
        message: "You must generate an access token using the `token_url`",
        token_url
      })
    );
  } */

  let { access_token, refresh_token } = await SpotifyApi.refreshToken(
    spotify_refresh_token
  );

  config.set({ spotify: { access_token, refresh_token } });

  SpotifyApi.setAccessToken(access_token);

  initCommands();

  let { message, error, res } = await commands.parse(
    ACTIVE_PLATFORM.getMessage(event)
  );

  if (res) {
    console.log(res);
  }

  if (error) {
    console.log(error);
    callback(null, await generateApiResponse(400, { error: error.message }));
    return;
  }

  callback(null, await generateApiResponse(200, { message: message }));
  return;
};
