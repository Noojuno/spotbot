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
  queryStringParameters: {
    platform: "telegram"
  },
  body: JSON.stringify(body)
};

module.exports = request;
