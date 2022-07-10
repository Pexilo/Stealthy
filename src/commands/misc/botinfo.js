const { Command } = require("sheweny");
const botVersion = require("../../../package.json").version;

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      description: "🔖 Get information about the bot",
      examples: "/botinfo => Get bot uptime and server count",
      category: "Misc",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const bot = interaction.client;

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
              name: "🤖 " + "Version" + ":",
              value: `${"```"}${botVersion}${"```"}`,
              inline: true,
            },
            {
              name: "⏲️ " + "Uptime" + ":",
              value: `${"```"}${this.client.PrettyMs(bot.uptime)}${"```"}`,
              inline: true,
            },
            {
              name: "🧭 " + "Servers" + ":",
              value: `${"```"}${bot.guilds.cache.size} ${"```"}`,
              inline: true,
            }
          ),
      ],
      components: [
        this.client.ButtonRow(
          ["https://github.com/Pexilo/Stealthy"],
          ["GitHub"],
          ["LINK"],
          ["<:Github:995795578510385322>"]
        ),
      ],
    });
  }
};
