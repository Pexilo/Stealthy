const { Command } = require("sheweny");
const { Permissions } = require("discord.js");

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
          description: "🐲 Command name",
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const { options, member } = interaction;
    const commandArg = options.getString("command");

    if (commandArg) {
      let command = this.client.collections.commands
        .filter((cmd) => cmd.name.toLowerCase() === commandArg.toLowerCase())
        .map((cmd) => cmd);

      if (command.length < 1) {
        return interaction.editReply(
          `\`🚫\` Command \`${commandArg}\` not found.`
        );
      }

      return interaction.editReply({
        embeds: [
          this.client
            .Embed()
            .setAuthor({ name: `${command[0].category}` })
            .setDescription(
              `${command[0].description}\n\nExample: ${command[0].examples}`
            ),
        ],
      });
    }

    const bot = interaction.client;
    let categories = [];
    let commandCount = 0;

    this.client.collections.commands.forEach((element) => {
      if (
        element.adminsOnly === false &&
        element.category != "Setup" &&
        !categories.includes(element.category)
      ) {
        categories.push(element.category);
      }
    });

    this.client.collections.commands
      .filter((cmd) => !cmd.adminsOnly)
      .map((_cmd) => commandCount++);

    const embedInfo = this.client
      .Embed()
      .setAuthor({
        name: `Hey! I'm ${bot.user.username}`,
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
      "To setup Stealthy features please press the button below! 🐲 \n\n" +
        "List of the " +
        commandCount +
        " commands:"
    );

    if (member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      return interaction.editReply({
        embeds: [embedInfo],
        components: [
          this.client.ButtonRow([
            {
              customId: "setup-menu",
              label: "Setup",
              style: "SECONDARY",
              emoji: "🔧",
            },
          ]),
        ],
      });
    }

    return interaction.editReply({
      embeds: [embedInfo],
    });
  }
};
