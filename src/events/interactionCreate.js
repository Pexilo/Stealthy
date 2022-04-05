const { Event } = require("sheweny");

module.exports = class interactionCreateEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", {
      description: "new interaction",
    });
  }

  async execute(interaction) {
    let guildSettings = await this.client.getGuild(interaction.guild);
    if (!guildSettings) {
      await this.client.createGuild(interaction.guild);
      guildSettings = await this.client.getGuild(interaction.guild);
      return interaction.reply({
        content: "`Server initialized ✅`\n> Please re-run the command.",
        ephemeral: true,
      });
    }
  }
};
