const { Command } = require("sheweny");

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      type: "SLASH_COMMAND",
      description: "🔖 Get information about the bot",
      examples: "/botinfo => Get bot information",
      category: "Misc",
    });
  }
  async execute(interaction) {
    return;
    if (!(await this.client.Defer(interaction))) return;

    const lang = GetLanguage(interaction.guild.id);

    const bot = interaction.client;
    const nonBotUsers = await interaction.client.users.cache.filter(
      (u) => !u.bot
    );

    return await interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: bot.user.username,
            iconURL: bot.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `${await FastTranslate(
              Botinfo.Embed.description,
              lang
            )}: [Pexilo#7866](https://github.com/Pexilo)`
          )
          .addFields(
            {
              name:
                "⏲️ " +
                `${await FastTranslate(Botinfo.Embed.field1, lang)}` +
                ":",
              value: `${"```"}${this.client.PrettyMs(bot.uptime)}${"```"}`,
              inline: true,
            },
            {
              name:
                "👤 " +
                `${await FastTranslate(Botinfo.Embed.field2, lang)}` +
                ":",
              value: `${"```"}${nonBotUsers.size}${"```"}`,
              inline: true,
            },
            {
              name: "\u200B",
              value: "\u200B",
              inline: true,
            },
            {
              name:
                "🧭 " +
                `${await FastTranslate(Botinfo.Embed.field3, lang)}` +
                ":",
              value: `${"```"}${bot.guilds.cache.size} ${"```"}`,
              inline: true,
            },
            {
              name:
                "💬 " +
                `${await FastTranslate(Botinfo.Embed.field4, lang)}` +
                ":",
              value: `${"```"}${bot.channels.cache.size} ${"```"}`,
              inline: true,
            },
            {
              name: "\u200B",
              value: "\u200B",
              inline: true,
            }
          ),
      ],
    });
  }
};
