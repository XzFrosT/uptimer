const UrlsConfig = require('../../database/models/UrlsConfig');
const discord =  require('discord.js');
const {default_prefix, mcolor } = require('../../config.json');
const { online, xmark } = require("../../assets/emojis.json");

module.exports = {
  name: "stats",
  description: "Shows all your URLs stats",
  category: "uptime",
  aliases: [],
  botPermission: [],
  authorPermission: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    const filter = { authorID: message.author.id };
    const all = await UrlsConfig.find(filter);
    var embed = new discord.MessageEmbed()
    .setColor(mcolor)
    .setTitle("Your Project Stats")
    .setFooter(`${message.author.username}`,message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()

    var count = 0;
    all.forEach(async (data) => {
      count++;
      if(count === 26) return;
      embed.addField(`\`[${count}]\` ${data.projectURL}`,`${online} Last Pinged: ${data.updatedAt ? formatDate(data.updatedAt) : 'Not Measured'}\n${online} Total Pings: ${data.pinged}`);
    });        
    
    if(count === 0) {
      embed.setDescription(`**You don't have any projects added.**\nAdd one by using: `+"``` p!add [Url] ```")
    }
    
    var errors = false;
    await message.author.send({ embeds: [embed] }).catch((err) => {
      errors = true;
      if(err.message === "Cannot send messages to this user")
        return message.channel.send(`${xmark} Cannot send message to you. please turn on your DMs`);
    });
    if(!errors) {
      message.channel.send(`**${message.author.tag}** Check your DMs`);
    }
  }
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = d.getHours(),
        mins = d.getMinutes(),
        sec = d.getSeconds();


    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var format = `${day}/${month}/${year} | ${hours}:${mins}:${sec}`;

    return format;
}