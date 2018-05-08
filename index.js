const SpotifyWebApi = require("spotify-web-api-node");

exports.handler = async event => {
  console.log(event);
  return "Hello from Lambda!";
};
