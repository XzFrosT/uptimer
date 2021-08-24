module.exports.run = async (client, interaction) => {
  if(!interaction.isCommand) return;
  
  if(client.slashCommands.has(interaction.commandName)) return;
  
  try {
    await client.slashCommands.get(interaction.commandName).execute(interaction)
  } catch(error) {
    console.log(error)
    interaction.reply({ content: `something went wrong`, ephemeral: true })
  }
}