const { Modal } = require("sheweny");

module.exports = class verifyModal extends Modal {
  constructor(client) {
    super(client, [/verify-.*/]);
  }

  async execute(modal) {
    const { guild, user, customId, fields } = modal;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { verify } = this.client.la[lang].interactions.modals;

    const userSequence = fields.getTextInputValue("verify-input");

    const role = guild.roles.cache.get(fetchGuild.verify.role);
    if (!role)
      return modal.editReply({
        content: errors.error54,
      });
    const member = guild.members.cache.get(user.id);

    // check if the entered sequence is correct
    if (!userSequence === customId.split("-")[1]) {
      modal.reply({
        content: verify.badCode,
        ephemeral: true,
      });
    }

    // check the member verification
    if (member.roles.cache.has(role.id)) {
      return modal.reply({
        content: verify.alreadyVerified,
        ephemeral: true,
      });
    }

    // add the role
    member.roles.add(role);
    modal.reply({
      content: verify.reply,
      ephemeral: true,
    });
  }
};
