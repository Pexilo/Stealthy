const { Command } = require("sheweny");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      nameLocalizations: {},
      description: "🤖 Ping the bot and get the latency.",
      descriptionLocalizations: {
        fr: "🤖 Envoie un ping au bot et récupère la latence.",
      },
      examples: "/ping => 🏓Pong!",
      usage: "https://i.imgur.com/w2q1bpX.png",
      category: "Misc",
    });
  }
  async execute(interaction) {
    const start = Date.now();
    if (!(await this.client.Defer(interaction))) return;
    const end = Date.now() - 500;
    const time = end - start;

    await interaction.editReply({
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
