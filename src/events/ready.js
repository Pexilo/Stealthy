const { Event } = require("sheweny");
const { bot_state } = process.env;

module.exports = class Ready extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Bot ready",
      once: true,
    });
  }

  execute(client) {
    const textChannels = client.channels.cache.filter(
      (channel) => channel.type == "GUILD_TEXT"
    );
    const usersCount = client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    );

    console.log(
      `${client.user.username}    ✅ - ${this.client.Capitalize(bot_state)}
♦ Servers:  ${client.guilds.cache.size}
♦ Users:    ${usersCount}
♦ Channels: ${textChannels.size}`
    );
  }
};
