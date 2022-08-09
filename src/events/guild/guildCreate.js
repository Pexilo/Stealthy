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
    try {
      this.client.channels.cache.get(guild.systemChannelId).send({
        content: `Hello there 👋, I'm **${this.client.user.username}**! \`🐲\`\n😄 I gladly accept the invitation for **${guild.name}**.\nCurrently helping \`${this.client.guilds.cache.size}\` servers!\n\n> I provide features to **improve the behavior of your server**:\n> admin commands, role claim, join to create... and much more \`🦾\`\n> *I even have the ability to run a Youtube Together activity in your voice channel!*\n\n\`💡\` It is **strongly suggested to configure me** using the **button below** and the \`/setup\` commands.`,
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
    } catch (_e) {}
  }
};
