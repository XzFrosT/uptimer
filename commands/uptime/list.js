const UrlsConfig = require('../../database/models/UrlsConfig');
const discord =  require('discord.js');
const { default_prefix, mcolor } = require('../../config.json');
const { xmark } = require("../../assets/emojis.json")

module.exports = {
    name: "list",
    description: "Shows all your URLs",
    category: "uptime",
    aliases: ["lists"],
    botPermission: [],
    authorPermission: [],
    ownerOnly: false,
    run: async (client, message, args) => {
      const filter = { authorID: message.author.id };
      let content = [];
      const all = await UrlsConfig.find(filter);
      var embed = new discord.MessageEmbed()
      .setColor(mcolor)
      .setTitle(`Here's all your URLs`)
      .setFooter(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
      var count = 0; 
      
      all.forEach(async (data) => {
        count++;
        content.push(`\`[${count}]\` ${data.projectURL}`);
      });
      if(content.length === 0) {
        embed.setDescription(`${xmark} **You don't have any URL Added.**\n- Add one by using: `+"``` p!add [Url] ```")
      } else {
        embed.setDescription(content.join("\n"));
      }
      var errors = false;
      
      await message.author.send({ embeds: [embed] }).catch((err) => {
        errors = true;
        if(err.message === "Cannot send messages to this user"){
          return message.channel.send(`${xmark} Cannot send message to you. please turn on your DMs`);
        }
      });
      if(!errors) {
        message.channel.send(`**${message.author.tag}** Sending list to your DMs`);
      }
    }
}