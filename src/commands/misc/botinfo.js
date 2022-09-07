const { Command } = require("sheweny");
const botVersion = require("../../../package.json").version;

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      nameLocalizations: {},
      description: "🔖 Get information about the bot.",
      descriptionLocalizations: {
        fr: "🔖 Obtenir des informations sur le bot.",
        de: "🔖 Informationen zum Bot abrufen.",
        "es-ES": "🔖 Obtener información sobre el bot.",
      },
      examples: "/botinfo => Show bot version, uptime and server count",
      usage: "https://i.imgur.com/F89i1e5.png",
      category: "Misc",
      clientPermissions: ["EmbedLinks"],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, client } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { botinfo } = this.client.la[lang].commands.misc;

    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

    await interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(eval(botinfo.embed1.description))
          .addFields(
            {
              name: botinfo.embed1.field1,
              value: `${"```"}${botVersion}${"```"}`,
              inline: true,
            },
            {
              name: botinfo.embed1.field2,
              value: `${"```"}${Math.round(memoryUsage * 100) / 100}mb${"```"}`,
              inline: true,
            },
            {
              name: "\u200B",
              value: "\u200B",
            },
            {
              name: botinfo.embed1.field3,
              value: `${"```"}${this.client.PrettyMs(client.uptime)}${"```"}`,
              inline: true,
            },
            {
              name: botinfo.embed1.field4,
              value: `${"```"}${client.guilds.cache.size} ${"```"}`,
              inline: true,
            }
          ),
      ],
      components: [
        this.client.ButtonRow([
          {
            url: "https://github.com/Pexilo/Stealthy",
            label: "GitHub",
            style: "LINK",
            emoji: "<:Github:995795578510385322>",
          },
        ]),
      ],
    });
  }
};
