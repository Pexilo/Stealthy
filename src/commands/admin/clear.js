const { Command } = require("sheweny");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "⛑️ Clear a certain amount of messages from a channel.",
      examples: "/clear `number:5` => ⛑️ Delete `5` messages in a channel",
      category: "Admin",
      userPermissions: ["ADMINISTRATOR"],
      clientPermissions: ["MANAGE_MESSAGES"],
      options: [
        {
          type: "INTEGER",
          name: "number",
          description: "🔢 Number of messages to delete",
          required: true,
          min: 1,
          max: 100,
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
            label: "",
            style: "SUCCESS",
            emoji: "✅",
          },
        ]),
      ],
    });
  }
};
