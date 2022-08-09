const { Event } = require("sheweny");
const { ChannelType } = require("discord.js");
const { BOT_STATE } = process.env;

module.exports = class Ready extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Bot ready",
      once: true,
    });
  }

  execute(client) {
    const textChannels = client.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildText
    );
    const usersCount = client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    );

    console.log(
      `${client.user.username}    ✅ - ${this.client.Capitalize(BOT_STATE)}
♦ Servers:  ${client.guilds.cache.size}
♦ Users:    ${usersCount}
♦ Channels: ${textChannels.size}`
    );
  }
};
