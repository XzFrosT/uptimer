const UrlsConfig = require("../../database/models/UrlsConfig");
const discord = require("discord.js");
const fetch = require("node-fetch");
const validUrl = require("valid-url");
const { mcolor } = require("../../config.json");
const { xmark, star } = require("../../assets/emojis.json")

module.exports = {
  name: "remove",
  description: "Remove URLs from monitoring",
  aliases: ["dehost"],
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

    if (checkIfExsists) {
      try {
        await fetch(url);
      } catch (error) {
        if (error.name === "FetchError") {
          message.channel.send(`${xmark} something went wrong when fetching your url, please try again`);
        }
      }
      await UrlsConfig.findOneAndDelete({ projectURL: url })
      let embed = new discord.MessageEmbed()
        .setDescription(`${star} The URL has been removed`)
        .setColor(mcolor)
        .setFooter(`Removed by ${message.author.tag}`)
        .setTimestamp();
        await waiting.delete();
        await message.channel.send({ embeds: [embed] });
        return message.delete();
    } else {
      await waiting.delete();
      await message.delete();
      await message.channel.send(`${xmark} The URL isn't registered`);
    }
  },
};