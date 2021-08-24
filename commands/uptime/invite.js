const discord = require("discord.js");
const { invite_link, mcolor } = require("./../../config.json");

module.exports = {
  name: "invite",
  description: "Invite bot",
  category: "uptime",
  botPermission: [],
  authorPermission: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    let embed = new discord.MessageEmbed()
    .setColor(mcolor)
    .addField("**Invite Me**","[Click here](" + invite_link + ") to invite me to your server.")
    .setTimestamp();
    return message.channel.send({ embeds: [embed] });
  },
};
