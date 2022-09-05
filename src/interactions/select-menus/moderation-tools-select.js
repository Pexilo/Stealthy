const { SelectMenu } = require("sheweny");

module.exports = class moderationToolsSelect extends SelectMenu {
  constructor(client) {
    super(client, ["moderation-tools-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild, values } = selectMenu;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { moderationTools } = this.client.la[lang].interactions.selectMenus;

    await this.client.UpdateGuild(guild, {
      "moderationTools.enabled": values,
    });

    const spelledValues = values
      .map((value) => {
        switch (value) {
          case "blacklist":
            return moderationTools.spelledValues.blacklist;
          case "delDcInvites":
            return moderationTools.spelledValues.delDcInv;
        }
      })
      .join(", ");

    return selectMenu.editReply({
      content: eval(moderationTools.reply),
    });
  }
};
