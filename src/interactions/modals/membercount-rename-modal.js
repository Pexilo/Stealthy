const { Modal } = require("sheweny");

module.exports = class memberCountRenameModal extends Modal {
  constructor(client) {
    super(client, ["channel-membercount"]);
  }

  async execute(modal) {
    const { guild } = modal;
    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const {} = this.client.la[lang];

    const name = modal.fields.getTextInputValue("membercount-name-input");
    if (!name) {
      return modal.reply({
        content: "`🚫` No changes made.",
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
        content: "`🚫` Unable to find the member count channel.",
        ephemeral: true,
      });
    }

    this.client.UpdateMemberCount(guild, fetchGuild.memberCount.channel, name);

    await modal.reply({
      content: "``✅`` Member count channel updated.",
      ephemeral: true,
    });
  }
};
