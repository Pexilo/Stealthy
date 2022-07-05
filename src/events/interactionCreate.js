const { Event } = require("sheweny");

module.exports = class interactionCreateEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", {
      description: "new interaction",
    });
  }

  async execute(interaction) {
    const { guild, member } = interaction;

    let guildSettings = await this.client.getGuild(interaction.guild);
    if (!guildSettings) {
      await this.client.createGuild(interaction.guild);
      guildSettings = await this.client.getGuild(interaction.guild);
      return interaction.reply({
        content: "`Server initialized ✅`\n> Please re-run the command.",
        ephemeral: true,
      });
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "channel-JTC") {
        //get input from modal
        const channels =
          interaction.fields.getTextInputValue("channel-JTC-input");

        //split channel names
        const result = channels.replace(/[\n\r]/g, "").split(",");

        let list = "";
        result.forEach((element) => {
          list += "➜ " + element + "\n";
        });

        await this.client.updateGuild(guild, {
          JTC_CnlNames: result,
        });

        await interaction.reply({
          content: `✅ New JTC channel names:\n${list}`,
          ephemeral: true,
        });
      }
    }
  }
};
