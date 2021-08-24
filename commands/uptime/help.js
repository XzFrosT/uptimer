const discord = require("discord.js");
const { default_prefix, mcolor } = require("../../config.json");
const { star } = require("../../assets/emojis.json");

module.exports = {
  name: "help",
  description: "Commands list",
  category: "uptime",
  botPermission: [],
  authorPermission: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    let embed = new discord.MessageEmbed()
    .setTitle("Commands List")
    .setColor(mcolor)
    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
    .addField('\u200b',"**[Invite](https://) |"+" [Documentation](https://) |"+" [Dashboard](https://)**")
    .setTimestamp();
    
    var commands = client.commands.filter((c) => c.ownerOnly === false).map((cmd) => `${star} `+"```"+`${default_prefix}${cmd.name}`+`${" ".repeat(7 - Number(cmd.name.length))}`+"```"+`: ${cmd.description}`);
    embed.setDescription(commands.sort().join("\n"));

    message.channel.send({ embeds: [embed] });
  },
};
