const { Command } = require("sheweny");

module.exports = class SlashArgsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "slash",
      type: "SLASH_COMMAND",
      description: "This is a description",
      category: "Misc",
      options: [
        {
          type: "USER",
          name: "membre",
          description: "permet de notifier un membre",
          required: true,
        },
      ],
    });
  }
  execute(interaction) {
    return;
    interaction.reply(interaction.options.getUser("membre").tag);
  }
};
