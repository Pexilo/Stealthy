const { Event } = require("sheweny");

module.exports = class guildCreateEvent extends Event {
  constructor(client) {
    super(client, "guildCreate", {
      description: "new guild",
    });
  }

  async execute(guild) {
    await this.client.createGuild(guild);
    await guild.channels.cache.get(guild.systemChannelId).send({
      content: `Hello there, I'm **${this.client.user.username}!** <:StealthyLogo:994266836961071114>\nI gladly accept the invitation for **${guild.name}**.\n\n> I'm here to **help you manage your server**, currently helping \`${this.client.guilds.cache.size}\` servers.\n> You can start configuring my **features** with the **button below** or by typing \`/help\`.`,
      components: [
        this.client.ButtonRow(
          ["setup-menu", "https://github.com/Pexilo/Stealthy"],
          ["🔧 Setup", "Github"],
          ["SECONDARY", "LINK"]
        ),
      ],
    });
  }
};
