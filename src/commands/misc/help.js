const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      nameLocalizations: {},
      description: "🔍 Show commands list.",
      descriptionLocalizations: { fr: "🔍 Afficher la liste des commandes." },
      examples: "/help `command:ping` => 🔍 Show details about command `ping`",
      category: "Misc",
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "command",
          nameLocalizations: { fr: "commande" },
          description: "🐲 Command name",
          descriptionLocalizations: { fr: "🐲 Nom de la commande" },
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options, member } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { help } = this.client.la[lang].commands.misc;

    const commandArg = options.getString("command");

    if (commandArg) {
      let command = this.client.collections.commands
        .filter((cmd) => cmd[0].name.toLowerCase() === commandArg.toLowerCase())
        .map((cmd) => cmd[0]);

      if (command.length < 1) {
        return interaction.editReply(eval(errors.error36));
      }

      return interaction.editReply({
        embeds: [
          this.client
            .Embed()
            .setAuthor({ name: `${command[0].category}` })
            .setDescription(eval(help.embed1.description))
            .setImage(command[0].usage),
        ],
      });
    }

    const bot = interaction.client;
    let categories = [];
    let commandCount = 0;

    this.client.collections.commands.forEach((element) => {
      if (
        element[0].adminsOnly === false &&
        element[0].category !== "Setup" &&
        !categories.includes(element[0].category)
      ) {
        categories.push(element[0].category);
      }
    });

    this.client.collections.commands
      .filter((cmd) => !cmd[0].adminsOnly)
      .map((_cmd) => commandCount++);

    const embedInfo = this.client
      .Embed()
      .setAuthor({
        name: eval(help.embed2.author),
        iconURL: bot.user.displayAvatarURL({ dynamic: true }),
      })

      .setFooter({
        text: help.embed2.footer,
      });

    for (const category of categories) {
      embedInfo.addFields({
        name: `${category}`,
        value: `${this.client.collections.commands
          .filter((cmd) => cmd[0].category === category)
          .map(
            (cmd) => `\`${this.client.Capitalize(cmd[0].name.toLowerCase())}\``
          )
          .join(", ")}`,
      });
    }
    embedInfo.setDescription(eval(help.embed2.description));

    if (member.permissions.has("ManageGuild")) {
      return interaction.editReply({
        embeds: [embedInfo],
        components: [
          this.client.ButtonRow([
            {
              customId: "setup-menu",
              label: help.embed2.button1,
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
