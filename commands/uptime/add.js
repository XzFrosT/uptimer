const UrlsConfig = require("../../database/models/UrlsConfig");
const discord = require("discord.js");
const fetch = require("node-fetch");
const validUrl = require("valid-url");
const { mcolor } = require("../../config.json");
const { xmark, star } = require("../../assets/emojis.json")

module.exports = {
  name: "add",
  description: "Add URLs to monitoring",
  aliases: ["host","uptime"],
  category: "uptime",
  botPermission: [],
  authorPermission: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    var url = args[0];
    
    if (!url) return message.channel.send(`${xmark} Please give a project URL!`);
    if (!validUrl.isUri(url)) {
      return message.channel.send(`${xmark} Invalid URL!`);
    }

    var waiting = await message.channel.send("Please wait...");

    var checkIfExsists = await UrlsConfig.findOne({ projectURL: url });
    let projects = 0;

    if (checkIfExsists === null) {
      await UrlsConfig.create({
        authorID: message.author.id,
        projectURL: url,
        pinged: 0,
      }).then(async () => {
        try {
          await fetch(url);
        } catch (error) {
          if (error.name === "FetchError") {
            message.channel.send(`${xmark} something went wrong when fetching your url, please try again`);
          }
        }
        let embed = new discord.MessageEmbed()
        .setDescription(`${star} The URL is now registered`)
        .setColor(mcolor)
        .setFooter(`Added by ${message.author.tag}`)
        .setTimestamp();
        await waiting.delete();
        await message.channel.send({ embeds: [embed] });
        return message.delete();
      });
    } else {
      await waiting.delete();
      await message.delete();
      await message.channel.send(`${xmark} The URL is already registered`);
    }
  },
};