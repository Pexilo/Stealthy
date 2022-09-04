const { Event } = require("sheweny");

module.exports = class guildCreateEvent extends Event {
  constructor(client) {
    super(client, "guildCreate", {
      description: "new guild",
    });
  }

  async execute(guild) {
    await this.client.CreateGuild(guild);

    if (!guild.systemChannelId) return;
    await this.client.Wait(3000); // send after 3 seconds so the system welcome msg comes first

    // get the system channel
    const homeChl = this.client.channels.cache.get(guild.systemChannelId);
    if (!homeChl) return;

    // check if the bot has the permission to send messages in the system channel
    let canSendMsg;
    guild.members.fetchMe().then((me) => {
      canSendMsg = me.permissionsIn(homeChl).has("SendMessages");
    });
    if (!canSendMsg) return;

    homeChl.send({
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
  }
};
