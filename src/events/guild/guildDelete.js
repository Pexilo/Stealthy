const { Event } = require("sheweny");

module.exports = class guildDeleteEvent extends Event {
  constructor(client) {
    super(client, "guildDelete", {
      description: "left a guild",
    });
  }

  async execute(guild) {
    await this.client.DeleteGuild(guild);
  }
};
