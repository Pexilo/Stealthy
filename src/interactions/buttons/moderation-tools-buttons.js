const { Button } = require("sheweny");

module.exports = class moderationToolsButtons extends Button {
  constructor(client) {
    super(client, ["blacklist-tool", "delDcInvites-tool"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild } = button;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { moderationTools } = this.client.la[lang].interactions.buttons;

    const modTools = fetchGuild.moderationTools.enabled;

    switch (button.customId) {
      case "blacklist-tool":
        modTools.push("blacklist");

        button.editReply(moderationTools.blacklist.reply);
        break;

      case "delDcInvites-tool":
        modTools.push("delDcInvites");

        button.editReply(moderationTools.delDcInv.reply);
        break;
    }

    await this.client.UpdateGuild(guild, {
      "moderationTools.enabled": modTools,
    });
  }
};
