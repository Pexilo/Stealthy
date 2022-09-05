const { Modal } = require("sheweny");

module.exports = class memberCountRenameModal extends Modal {
  constructor(client) {
    super(client, ["channel-membercount"]);
  }

  async execute(modal) {
    const { guild } = modal;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { membercountRename } = this.client.la[lang].interactions.modals;

    const name = modal.fields.getTextInputValue("membercount-name-input");
    if (!name) {
      return modal.reply({
        content: errors.error48,
        ephemeral: true,
      });
    }

    await this.client.UpdateGuild(guild, {
      "memberCount.name": name,
    });

    const memberCountChannel = guild.channels.cache.get(
      fetchGuild.memberCount.channel
    );

    if (!memberCountChannel) {
      return modal.reply({
        content: errors.error49,
        ephemeral: true,
      });
    }

    this.client.UpdateMemberCount(guild, fetchGuild.memberCount.channel, name);

    await modal.reply({
      content: membercountRename.reply,
      ephemeral: true,
    });
  }
};
