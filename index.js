require("dotenv").config();
const { Client, Collection, Intents, Permissions, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const UrlsConfig = require("./database/models/UrlsConfig");
const fetchProjects = require("./fetchProjects");
const config = require("./config.json");
const fs = require('fs');

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

require("./database/connect");

client.slashCommands = new Collection();
client.commands = new Collection();
client.aliases = new Collection();

["command", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

const slashFile = fs.readdirSync("./slashCommands").filter(file => file.endsWith(".js"));

for(const file of slashFile){
  const slashcommand = require(`./slashCommands/${file}`);
  client.slashCommands.set(slashcommand.name, slashcommand);
}

client.login(process.env.BOT_TOKEN);

fetchProjects(UrlsConfig);
setInterval(async () => {
  let docs = await UrlsConfig.find();
  client.user.setActivity(`/help | ${docs.length} Projetc(s)`, {
    type: "WATCHING",
  });
  fetchProjects(UrlsConfig);
}, config.timeout);
