const { Event } = require("sheweny");
const { ChannelType, ActivityType } = require("discord.js");
const { BOT_STATE } = process.env;

module.exports = class Ready extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Bot ready",
      once: true,
    });
  }

  execute(client) {
    // const textChannels = client.channels.cache.filter(
    //   (channel) => channel.type === ChannelType.GuildText
    // );
    // const usersCount = client.guilds.cache.reduce(
    //   (a, g) => a + g.memberCount,
    //   0
    // );

    let index = 0;
    const activities = [
      { type: ActivityType.Listening, name: "/help" },
      { type: ActivityType.Listening, name: "/setup" },
    ];

    setInterval(() => {
      this.client.UpdateActivity(activities[index]);
      index++;
      if (index > activities.length - 1) index = 0;
    }, 15000);
  }
};
