const { Command } = require("sheweny");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "🤖 Ping the bot and get the latency",
      examples: "/ping => 🏓Pong!",
      category: "Misc",
    });
  }
  async execute(interaction) {
    const start = Date.now();
    if (!(await this.client.Defer(interaction))) return;
    const end = Date.now() - 500;
    const time = end - start;

    return await interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setTitle("🏓 Pong!")
          .addFields(
            {
              name: "🤖 " + "Bot Latency" + ":",
              value: `${"```"}${time}ms${"```"}`,
              inline: true,
            },
            {
              name: "🌐 " + "API Latency" + ":",
              value: `${"```"}${interaction.client.ws.ping}ms${"```"}`,
              inline: true,
            }
          ),
      ],
    });
  }
};
