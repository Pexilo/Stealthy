const { Event } = require("sheweny");

module.exports = class interactionCreateEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", {
      description: "new interaction",
    });
  }

  async execute(interaction) {
    const { guild } = interaction;

    let fetchGuild = await this.client.GetGuild(guild);

    if (!fetchGuild) {
      await this.client.CreateGuild(guild);
      return this.client.channels.cache.get(guild.systemChannelId).send({
        content:
          "⚠️ Database has been reset, all data of this server has been lost.\nSorry for the inconvenience.\n\n`Server initialized ✅`",
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

    // lazy fix because permissions are terrible to setup, WIP
    guild.members.fetchMe().then((me) => {
      if (!me.permissions.has("Administrator")) {
        return interaction.reply({
          content:
            "`🚫` I need the `Administator` permission to operate properly.",
          ephemeral: true,
        });
      }
    });
  }
};
