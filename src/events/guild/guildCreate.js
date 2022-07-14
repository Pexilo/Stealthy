const { Event } = require("sheweny");

module.exports = class guildCreateEvent extends Event {
  constructor(client) {
    super(client, "guildCreate", {
      description: "new guild",
    });
  }

  async execute(guild) {
    await this.client.createGuild(guild);

    this.client.Wait(2000);
    this.client.channels.cache.get(guild.systemChannelId).send({
      content: `Hello there, I'm **${this.client.user.username}!** <:StealthyLogo:994266836961071114>\nI gladly accept the invitation for **${guild.name}**.\n\n> I'm here to **help you manage your server**, currently helping \`${this.client.guilds.cache.size}\` servers.\n\n> You can start configuring my **features** with the **button below** or by typing \`/help\`.`,
      components: [
        this.client.ButtonRow([
          {
            customId: "setup-menu",
            label: "Setup",
            style: "SECONDARY",
            emoji: "🔧",
          },
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
