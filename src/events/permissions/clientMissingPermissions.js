const { Event } = require("sheweny");

module.exports = class clientMissingPermissionsEvent extends Event {
  constructor(client) {
    super(client, "clientMissingPermissions", {
      description: "Client missing permissions.",
      emitter: client.managers.commands,
    });
  }

  async execute(interaction, missing) {
    const { lang } = await this.client.FetchAndGetLang(guild);
    const { clientMissingPermissions } = this.client.la[lang].events.misc;

    interaction.reply({
      content: eval(clientMissingPermissions.reply),
      ephemeral: true,
    });
  }
};
