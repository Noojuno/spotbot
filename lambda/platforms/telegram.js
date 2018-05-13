var chat_id = null;

const getMessage = event => {
  const body = JSON.parse(event.body);
  chat_id = body.message.chat.id;
  return body.message.text;
};

const formatResponse = res => {
  return res;
};

module.exports = { getMessage, formatResponse };
