const getMessage = event => {
  const body = JSON.parse(event.body);
  return body.text;
};

module.exports = { getMessage };
