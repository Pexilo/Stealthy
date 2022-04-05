const { Button } = require("sheweny");

module.exports = class ButtonsListenerCommand extends Button {
  constructor(client) {
    super(client, ["primary", "secondary", "success", "danger"]);
  }
  execute(button) {
    switch (button.customId) {
      case "primary":
        button.reply("You have clicked on primary button !");
        break;
      case "secondary":
        button.reply("You have clicked on secondary button !");
        break;
      case "success":
        button.reply("You have clicked on success button !");
        break;
      case "danger":
        button.reply("You have clicked on danger button !");
        break;
    }
  }
};
