const body = {
  update_id: 10000,
  message: {
    date: 1441645532,
    chat: {
      last_name: "Test Lastname",
      id: 1111111,
      first_name: "Test",
      username: "Test"
    },
    message_id: 1365,
    from: {
      last_name: "Test Lastname",
      id: 1111111,
      first_name: "Test",
      username: "Test"
    },
    text: '@SpotBot /add https://open.spotify.com/track/0Up4nx3BStTtlANnQD3Flb"'
  }
};

const request = {
  resource: "/SpotBot",
  path: "/SpotBot",
  httpMethod: "POST",
  headers: {
    "Accept-Encoding": "gzip, deflate",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-Country": "GB",
    "Content-Type": "application/json",
    Host: "sbhdndfmmg.execute-api.us-east-1.amazonaws.com",
    Via: "1.1 538035531d9b56b000d8ae44cd71930c.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "VvEy66wvzE5tcNzbpYQJYqX4whSrxZGiGP5rzOAzTiNQSzHe_RSRFQ==",
    "X-Amzn-Trace-Id": "Root=1-5af8a71e-afad65a4274ce720b0910558",
    "X-Forwarded-For": "149.154.167.213, 216.137.58.88",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  queryStringParameters: { platform: "telegram" },
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: "901u26",
    resourcePath: "/SpotBot",
    httpMethod: "POST",
    extendedRequestId: "G18MzEXOIAMFV1w=",
    requestTime: "13/May/2018:20:59:10 +0000",
    path: "/SpotBot/SpotBot",
    accountId: "488101947230",
    protocol: "HTTP/1.1",
    stage: "SpotBot",
    requestTimeEpoch: 1526245150727,
    requestId: "7bff2ac0-56f0-11e8-9e3b-8197c1be6b03",
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: "149.154.167.213",
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: null,
      user: null
    },
    apiId: "sbhdndfmmg"
  },
  body:
    '{"update_id":73616512,\n"message":{"message_id":45,"from":{"id":577422845,"is_bot":false,"first_name":"Jono","last_name":"Kemball","username":"Noojuno","language_code":"en-US"},"chat":{"id":577422845,"first_name":"Jono","last_name":"Kemball","username":"Noojuno","type":"private"},"date":1526205124,"text":"/add https://open.spotify.com/track/0e7ipj03S05BNilyu5bRzt","entities":[{"offset":0,"length":4,"type":"bot_command"}]}}',
  isBase64Encoded: false
  //body: JSON.stringify(body)
};

module.exports = request;
