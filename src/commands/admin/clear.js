const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "⛑️ Clear a certain amount of messages from a channel.",
      examples: "/clear `number:5` => ⛑️ Delete `5` messages in a channel",
      category: "Admin",
      userPermissions: ["Administrator"],
      clientPermissions: ["ManageMessages"],
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: "number",
          description: "🔢 Number of messages to delete",
          required: true,
          min_value: 1,
          max_value: 100,
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const { options } = interaction;

    const number = options.getInteger("number");

    return interaction.editReply({
      content: `\`❓\` Are you sure you want to clear **${number}** messages in ${interaction.channel.toString()}`,
      components: [
        this.client.ButtonRow([
          {
            customId: "confirm-clear",
            style: "SUCCESS",
            emoji: "✅",
          },
        ]),
      ],
    });
  }
};
