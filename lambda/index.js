const discord = require("./platforms/discord");

const generateApiResponse = (status, body) => {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
};

const getMessage = (platform, event) => {
  switch (platform) {
    case "discord":
      return discord.getMessage(event);
      break;

    default:
      break;
  }
};

exports.handler = async event => {
  if (!event.queryStringParameters || !event.queryStringParameters.platform) {
    return generateApiResponse(404, { message: "Invalid platform" });
  }

  const platform = event.queryStringParameters.platform;
  let message = getMessage(platform, event);

  // TODO implement
  console.log(event);
  return generateApiResponse(200, event);
};
