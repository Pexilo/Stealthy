const { Command } = require("sheweny");

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      description: "🔖 Get information about the bot",
      examples: "/botinfo => Get bot information",
      category: "Misc",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

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
            `Maintainer: [Pexilo#7866](https://github.com/Pexilo)`
          )
          .addFields(
            {
              name: "⏲️ " + "Uptime" + ":",
              value: `${"```"}${this.client.PrettyMs(bot.uptime)}${"```"}`,
              inline: true,
            },
            {
              name: "👤 " + "Users" + ":",
              value: `${"```"}${nonBotUsers.size}${"```"}`,
              inline: true,
            },
            {
              name: "\u200B",
              value: "\u200B",
              inline: true,
            },
            {
              name: "🧭 " + "Servers" + ":",
              value: `${"```"}${bot.guilds.cache.size} ${"```"}`,
              inline: true,
            },
            {
              name: "💬 " + "Text channels" + ":",
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
