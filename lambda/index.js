const Spotify = require("./spotify");

const telegram = require("./platforms/telegram");
const commands = require("./commands");
const config = require("./config");

const SpotifyApi = new Spotify({
  client_id: config.spotify.client_id,
  client_secret: config.spotify.client_secret,
  redirect_uri: config.spotify.redirect_uri
});

const PLATFORMS = { telegram };
let ACTIVE_PLATFORM = null;

const initCommands = async () => {
  commands.add("create", async data => {
    const playlistName = data.args.join(" ");

    let res = await SpotifyApi.createPlaylist(
      playlistName,
      config.spotify.user_name
    );

    data.error = res.error || null;
    data.res = res;
    process.env.selected_playlist = res.id;
  });

  commands.add("select", async data => {
    const playlistId = data.args[0];

    process.env.selected_playlist = playlistId;
  });

  commands.add("add", async data => {
    const spotifyUrlRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
    const url = data.args.join("");

    const regexRes = spotifyUrlRegex.exec(url);

    if (!process.env.selected_playlist) {
      data.error = new Error("No selected playlist");
      return;
    }

    if (!regexRes[1]) {
      data.error = new Error("Invalid input url");
      return;
    }

    let trackId = regexRes[1];

    let res = await SpotifyApi.addSongToPlaylist(
      trackId,
      process.env.selected_playlist,
      config.spotify.user_name
    );

    data.error = res.error || null;
    data.res = res;
    process.env.selected_playlist = res.id;
  });
};

const generateApiResponse = (status, body) => {
  return ACTIVE_PLATFORM.formatResponse({
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
};

const getMessage = (platform, event) => {
  switch (platform) {
    case "telegram":
      return telegram.getMessage(event);
      break;

    default:
      break;
  }
};

exports.handler = async event => {
  if (
    !event.queryStringParameters ||
    !event.queryStringParameters.platform ||
    !PLATFORMS[event.queryStringParameters.platform]
  ) {
    return generateApiResponse(404, { message: "Invalid platform" });
  }

  const platform = event.queryStringParameters.platform;
  ACTIVE_PLATFORM = PLATFORMS[platform];

  let spotify_access_token =
    process.env.spotify_access_token || config.spotify.tokens.access_token;
  let spotify_refresh_token =
    process.env.spotify_refresh_token || config.spotify.tokens.refresh_token;

  if (!spotify_access_token || !spotify_refresh_token) {
    const token_url = SpotifyApi.generateAccessUrl([
      "playlist-modify-private",
      "playlist-modify-public",
      "playlist-read-private",
      "user-library-read",
      "user-library-modify"
    ]);

    return generateApiResponse(400, {
      message: "You must generate an access token using the `token_url`",
      token_url
    });
  }

  let { access_token, refresh_token } = await SpotifyApi.refreshToken(
    spotify_refresh_token
  );

  process.env.spotify_access_token = access_token;
  process.env.spotify_refresh_token = refresh_token;

  SpotifyApi.setAccessToken(access_token);

  initCommands();

  const body = JSON.parse(event.body);

  let { message, error, res } = await commands.parse(body.message.text); //getMessage(platform, event);

  if (res) {
    console.log(res);
  }

  if (error) {
    return generateApiResponse(400, { error });
  }

  return generateApiResponse(200, { event, message: message });
};
