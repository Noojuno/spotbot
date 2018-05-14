const AWS = require("aws-sdk");
const deepmerge = require("deepmerge");

class Config {
  constructor(initialConfig) {
    this.config = initialConfig;

    AWS.config.update({
      region: this.config.aws.region
    });
  }

  set(obj) {
    this.config = deepmerge.all([this.config, obj]);
  }

  get() {
    return this.config;
  }

  async save() {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let configItem = {
      TableName: this.config.aws.table_name,
      Item: this.config
    };

    return await docClient.put(configItem).promise();
  }

  async load() {
    let docClient = new AWS.DynamoDB.DocumentClient();

    let configItem = {
      TableName: this.config.aws.table_name,
      Key: { version: 1 }
    };

    let con = await docClient.get(configItem).promise();
    return Promise.resolve(con.Item);
  }
}

module.exports = Config;
