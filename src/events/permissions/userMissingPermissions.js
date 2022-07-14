const { Event } = require("sheweny");

module.exports = class userMissingPermissionsEvent extends Event {
  constructor(client) {
    super(client, "userMissingPermissions", {
      description: "User missing permissions.",
      emitter: client.managers.commands,
    });
  }

  async execute(interaction, missing) {
    interaction.reply({
      content: `You need \`${missing}\` permissions to execute this command`,
      ephemeral: true,
    });
  }
};
