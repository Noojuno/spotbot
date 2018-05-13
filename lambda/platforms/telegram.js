var chat_id = null;

const getMessage = event => {
  const body = JSON.parse(event.body);
  chat_id = body.message.chat.id;
  return body.message.text;
};

const sendBotResponse = async (res, config) => {
  const { bot_id, bot_secret } = config.telegram;
  const url = `https://api.telegram.org/bot${bot_id}:${bot_secret}/sendMessage`;
  let message = "";
  let body = res.body;

  if (body.error) {
    message = body.error;
  } else if (body.message) {
    message = body.message;
  }

  const fetchBody = {
    text: message,
    chat_id
  };

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(fetchBody)
  };

  try {
    let fetchRes = await fetch(url, options);
    return fetchRes.json();
  } catch (e) {
    return Promise.reject(e);
  }
};

module.exports = { getMessage, sendBotResponse };
