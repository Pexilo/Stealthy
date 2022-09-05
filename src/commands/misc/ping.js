const { Command } = require("sheweny");

module.exports = class PingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      nameLocalizations: {},
      description: "🤖 Ping the bot and get the latency.",
      descriptionLocalizations: {
        fr: "🤖 Envoie un ping au bot et récupère la latence.",
        de: "🤖 Pingt den Bot und erhält die Latenz.",
        "es-ES": "🤖 Envía un ping al bot y obtén la latencia.",
      },
      examples: "/ping => 🏓Pong!",
      usage: "https://i.imgur.com/w2q1bpX.png",
      category: "Misc",
    });
  }
  async execute(interaction) {
    const start = Date.now();
    if (!(await this.client.Defer(interaction))) return;
    const { guild } = interaction;

    const end = Date.now() - 500;
    const time = end - start;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { ping } = this.client.la[lang].commands.misc;

    await interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setTitle(ping.embed1.title)
          .addFields(
            {
              name: ping.embed1.field1.name,
              value: `${"```"}${time}ms${"```"}`,
              inline: true,
            },
            {
              name: ping.embed1.field2.name,
              value: `${"```"}${interaction.client.ws.ping}ms${"```"}`,
              inline: true,
            }
          ),
      ],
    });
  }
};
