const getMessage = event => {
  const body = JSON.parse(event.body);
  return body.text;
};

const formatResponse = res => {
  return { ...res };
};

module.exports = { getMessage };
