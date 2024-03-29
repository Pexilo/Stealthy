const { Event } = require("sheweny");

module.exports = class userMissingPermissionsEvent extends Event {
  constructor(client) {
    super(client, "userMissingPermissions", {
      description: "User missing permissions.",
      emitter: client.managers.commands,
    });
  }

  async execute(interaction, missing) {
    const { guild } = interaction;
    const { lang } = await this.client.FetchAndGetLang(guild);
    const { userMissingPermissions } = this.client.la[lang].events.permissions;

    interaction.reply({
      content: eval(userMissingPermissions.reply),
      ephemeral: true,
    });
  }
};
