const { Event } = require("sheweny");

module.exports = class clientMissingPermissionsEvent extends Event {
  constructor(client) {
    super(client, "clientMissingPermissions", {
      description: "Client missing permissions.",
      emitter: client.managers.commands,
    });
  }

  async execute(interaction, missing) {
    interaction.reply({
      content: `I need \`${missing}\` permissions to execute this command`,
      ephemeral: true,
    });
  }
};
