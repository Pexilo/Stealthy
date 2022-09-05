const { SelectMenu } = require("sheweny");

module.exports = class logsEnabledSelect extends SelectMenu {
  constructor(client) {
    super(client, ["logs-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild, values } = selectMenu;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { logsEnabled } = this.client.la[lang].interactions.selectMenus;

    await this.client.UpdateGuild(guild, {
      "logs.enabled": values,
    });

    const spelledValues = values
      .map((value) => {
        switch (value) {
          case "msgDelete":
            return logsEnabled.spelledValues.msgDelete;
          case "msgEdit":
            return logsEnabled.spelledValues.msgEdit;
          case "joinLeave":
            return logsEnabled.spelledValues.joinLeave;
          case "moderation":
            return logsEnabled.spelledValues.moderation;
          case "channels":
            return logsEnabled.spelledValues.channels;
        }
      })
      .join(", ");

    return selectMenu.editReply({
      content: eval(logsEnabled.reply),
    });
  }
};
