const getMessage = event => {
  const body = JSON.parse(event.body);

  return body.message;
};

module.exports = { getMessage };
