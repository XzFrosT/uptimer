const UrlsConfig = require('./../../database/models/UrlsConfig');
const { MessageEmbed } = require('discord.js');
const { mcolor } = require("./../../config.json");
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const moment = require('moment');

module.exports = {
  name: "info",
  description: "Show bot status",
  category: "uptime",
  botPermission: [],
  authorPermission: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    UrlsConfig.countDocuments({}, async function( err, total){
      var all = await UrlsConfig.find();
      var ping = 0;
      await all.forEach(u => {
        ping = u.pinged + ping;
      });
      const d = moment.duration(message.client.uptime);
      const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
      const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hours`;
      const clientStats = stripIndent`
      Servers   :: ${message.client.guilds.cache.size}
      Users     :: ${message.client.users.cache.size}
      Channels  :: ${message.client.channels.cache.size}
      WS Ping   :: ${Math.round(message.client.ws.ping)}ms
      Uptime    :: ${days} and ${hours}
      `;
      const { totalMemMb, usedMemMb } = await mem.info();
      const serverStats = stripIndent`
      OS        :: ${await os.oos()}
      CPU       :: ${cpu.model()}
      Cores     :: ${cpu.count()}
      CPU Usage :: ${await cpu.usage()} %
      RAM       :: ${totalMemMb} MB
      RAM Usage :: ${usedMemMb} MB 
      `;
      
      const embed = new MessageEmbed()
      .setTitle(`${client.user.tag} Status`)
      .setColor(mcolor)
      .addField("Bot Status",`\`\`\`asciidoc\n${clientStats}\`\`\``)
      .addField("Host Server",`\`\`\`asciidoc\n${serverStats}\`\`\``)
      .addField("Total monitored projects: ", `\`\`\`asciidoc\n${total}\`\`\``)
      .addField("Total pings i've send to all project: ", `\`\`\`asciidoc\n${ping}\`\`\``)
      return message.channel.send({ embeds: [embed] });
    });
  }
}