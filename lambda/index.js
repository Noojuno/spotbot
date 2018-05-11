const SpotifyWebApi = require("spotify-web-api-node");

const telegram = require("./platforms/telegram");
const commands = require("./commands");
const config = require("./config");

const Spotify = new SpotifyWebApi({
  clientId: config.spotify.client_id,
  clientSecret: config.spotify.client_secret
});

const initCommands = async () => {
  commands.add("create", async data => {
    const playlistName = data.args.join(" ");

    await Spotify.createPlaylist(config.spotify.user_name, playlistName, {
      public: true
    }).then(
      function(data) {
        console.log("Created playlist!");
      },
      function(err) {
        console.log("Something went wrong!", err);
      }
    );
  });
};

const generateApiResponse = (status, body) => {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
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
  if (!event.queryStringParameters || !event.queryStringParameters.platform) {
    return generateApiResponse(404, { message: "Invalid platform" });
  }

  initCommands();

  const spotifyAuthData = await Spotify.authorizationCodeGrant(
    config.spotify.access_token
  );

  Spotify.setAccessToken(spotifyAuthData.body["access_token"]);
  Spotify.setRefreshToken(spotifyAuthData.body["refresh_token"]);

  const platform = event.queryStringParameters.platform;
  const body = JSON.parse(event.body);

  let { message, test } = await commands.parse(body.message.text); //getMessage(platform, event);

  // TODO implement
  console.log("test", test);
  return generateApiResponse(200, { event, message: message });
};
