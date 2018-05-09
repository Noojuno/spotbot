const generateApiResponse = (status, body) => {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
};

exports.handler = async event => {
  if (!event.queryStringParameters || !event.queryStringParameters.platform) {
    return generateApiResponse(404, { message: "Invalid platform" });
  }

  // TODO implement
  console.log(event);
  return generateApiResponse(200, event);
};
