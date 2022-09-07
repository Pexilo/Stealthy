const { Event } = require("sheweny");

module.exports = class interactionCreateEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", {
      description: "new interaction",
    });
  }

  async execute(interaction) {
    const { guild } = interaction;

    const { fetchGuild } = await this.client.FetchAndGetLang(guild);

    if (!fetchGuild) {
      await this.client.CreateGuild(guild);
      return this.client.channels.cache.get(guild.systemChannelId).send({
        content:
          "`⚠️` Database has been reset, all data of this server has been lost.\nSorry for the inconvenience.\n\n`Server initialized ✅`",
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
  }
};
