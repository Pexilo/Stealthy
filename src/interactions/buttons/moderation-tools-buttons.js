const { Button } = require("sheweny");

module.exports = class moderationToolsButtons extends Button {
  constructor(client) {
    super(client, [
      "blacklist-tool",
      "delDcInvites-tool",
      "verify-captcha-tool-enable",
      "verify-captcha-tool-disable",
    ]);
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

      case "verify-captcha-tool-enable":
        if (!modTools.includes("verifyCaptcha")) modTools.push("verifyCaptcha");

        button.editReply(moderationTools.verifyCaptcha.reply1);
        break;

      case "verify-captcha-tool-disable":
        if (modTools.includes("verifyCaptcha")) {
          modTools.splice(modTools.indexOf("verifyCaptcha"), 1);
        }

        button.editReply(moderationTools.verifyCaptcha.reply2);
        break;
    }

    await this.client.UpdateGuild(guild, {
      "moderationTools.enabled": modTools,
    });
  }
};
