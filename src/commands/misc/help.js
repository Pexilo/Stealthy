const { Command } = require("sheweny");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "🔍 Show commands list",
      examples: "/help `command:ping` => 🔍 Show details about command `ping`",
      category: "Misc",
      options: [
        {
          type: "STRING",
          name: "command",
          description: "💡Command name",
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const { options } = interaction;
    const commandArg = options.getString("command");

    if (commandArg) {
      let command = this.client.collections.commands
        .filter((cmd) => cmd.name.toLowerCase() === commandArg.toLowerCase())
        .map((cmd) => cmd);

      interaction.editReply({
        embeds: [
          this.client
            .Embed()
            .setAuthor({ name: `${command[0].category}` })
            .setDescription(
              `${command[0].description}\n\nExample: ${command[0].examples}`
            ),
        ],
      });
      return;
    }

    const bot = interaction.client;
    let categories = [];
    let commandCount = 0;

    this.client.collections.commands.forEach((element) => {
      element.adminsOnly === false &&
      element.category != "Setup" &&
      !categories.includes(element.category)
        ? categories.push(element.category)
        : null;
    });

    this.client.collections.commands
      .filter((cmd) => !cmd.adminsOnly)
      .map((cmd) => commandCount++);

    const embedInfo = this.client
      .Embed()
      .setAuthor({
        name: `Hi! I am ${bot.user.username}`,
        iconURL: bot.user.displayAvatarURL({ dynamic: true }),
      })

      .setFooter({
        text: `/help command: for information on a specific command.`,
      });

    for (const category of categories) {
      embedInfo.addFields({
        name: `${category}`,
        value: `${this.client.collections.commands
          .filter((cmd) => cmd.category === category)
          .map((cmd) => `\`${cmd.name}\``)
          .join(", ")}`,
      });
    }
    embedInfo.setDescription(
      "🐲To set up the bot features please press the button below!\n\n" +
        "Find the list of the " +
        commandCount +
        " comands:"
    );

    interaction.editReply({
      embeds: [embedInfo],
      components: [
        this.client.ButtonRow(["setup-menu"], ["🔧 Setup"], ["SECONDARY"]),
      ],
    });
  }
};
