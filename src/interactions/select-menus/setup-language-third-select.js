const { SelectMenu } = require("sheweny");
const { supportedLanguages } = require("../../languages/supportedLanguages");

module.exports = class LanguageMenu3MsgSelect extends SelectMenu {
  constructor(client) {
    super(client, ["language-select"]);
  }
  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild } = selectMenu;

    for (const [key, value] of Object.entries(supportedLanguages)) {
      if (selectMenu.values[0] === `${key}_option`) {
        this.client.updateGuild(guild, { language: key });

        return selectMenu.editReply(
          `${await this.client.FastTranslate(
            "Done, your language is now set to",
            key.toUpperCase()
          )} ${value}`
        );
      }
    }
    return selectMenu.editReply("`🚫` Something went wrong, please try again.");
  }
};
