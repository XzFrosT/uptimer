const fs = require('fs');

module.exports = {
  name: "deploy",
  description: "Show bot status",
  category: "uptime",
  botPermission: [],
  authorPermission: [],
  ownerOnly: true,
  run: async (client, message, args) => {
    const onlyGuild = true
    const guild = '869555008205643786';
    const slashFiles = fs.readdirSync("./slashCommands/").filter(file => file.endsWith('.js'));
    
    let slashCommand;
    let slashs = [];
    if(!args[0]) return message.channel.send({ content: "invalid command, use this:\nupdate, delete" });
    if(args[0] = "update") {
      for (const file of slashFiles) {
      const slash = require(`./slashCommands/${file}`);
      
      if (slash.options) {
        slashCommand = {
          name: slash.name,
          description: slash.description,
          options: slash.options
        }
      } else {
        slashCommand = {
          name: slash.name,
          description: slash.description
        }
      }
      slashs.push(slashCommand)
      
      await client.guilds.cache.get(guild)?.commands.set(slashs);
      message.channel.send(`registered ${slashCommand}`)
      }
    }
    if(args[0] === "delete" ) {
      for (const file of slashFiles) {
      const slash = require(`./slashCommands/${file}`);
      
      if (slash.options) {
        slashCommand = {
          name: slash.name,
          description: slash.description,
          options: slash.options
        }
      } else {
        slashCommand = {
          name: slash.name,
          description: slash.description
        }
      }
      slashs.push(slashCommand)
      
      await client.guilds.cache.get(guild)?.commands.set([]);
      message.channel.send(`registered ${slashCommand}`)
      }
    }
  }
}