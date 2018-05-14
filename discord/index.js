const fetch = require("isomorphic-fetch");

const Discord = require("discord.js");
const client = new Discord.Client();

const apiUrl =
  "https://sbhdndfmmg.execute-api.us-east-1.amazonaws.com/SpotBot/SpotBot?platform=discord";

const botToken = "NDQzNTE1NzAxMzg3NDYwNjA4.Ddrg7g.aGe-zVXoqZPKuHwgLLBavfjd_GY";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
  const body = {
    message: msg.content
  };

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };

  try {
    let res = await fetch(apiUrl, options).json();

    let resBody = JSON.parse(res.body);

    if (resBody.message) {
      msg.reply(resBody.message);
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(botToken);
