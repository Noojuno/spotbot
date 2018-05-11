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
    text: '@SpotBot /create Test playlist name "This is more args"'
  }
};

const request = {
  queryStringParameters: {
    platform: "telegram"
  },
  body: JSON.stringify(body)
};

module.exports = request;
