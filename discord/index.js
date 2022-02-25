const fetch = require("isomorphic-fetch");

const Discord = require("discord.js");
const client = new Discord.Client();

const apiUrl =
  "https://sbhdndfmmg.execute-api.us-east-1.amazonaws.com/SpotBot/SpotBot?platform=discord";

const botToken = "TOKEN GOES HERE";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
  if (msg.author.id != client.user.id) {
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
      let res = await fetch(apiUrl, options);
      res = await res.json();
      console.log(res);

      if (res.message) {
        msg.channel.send(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  }
});

client.login(botToken);
