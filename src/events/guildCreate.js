const { Event } = require("sheweny");

module.exports = class guildCreateEvent extends Event {
  constructor(client) {
    super(client, "guildCreate", {
      description: "new guild",
    });
  }

  async execute(guild) {
    await this.client.createGuild(guild);
  }
};
