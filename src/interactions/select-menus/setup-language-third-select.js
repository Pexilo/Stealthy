const { SelectMenu } = require("sheweny");
const { supportedLanguages } = require("../../languages/supportedLanguages");

module.exports = class setupLanguageThirdSelect extends SelectMenu {
  constructor(client) {
    super(client, ["language-select"]);
  }
  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild } = selectMenu;

    for (const [key, value] of Object.entries(supportedLanguages)) {
      if (selectMenu.values[0] === `${key}_option`) {
        this.client.UpdateGuild(guild, { language: key });
        const { setupLanguageThird } =
          this.client.la[key].interactions.selectMenus;

        return selectMenu.editReply(eval(setupLanguageThird.reply));
      }
    }
  }
};
