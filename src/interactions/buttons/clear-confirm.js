const { Button } = require("sheweny");

module.exports = class ClearConfirmButton extends Button {
  constructor(client) {
    super(client, ["confirm-clear"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;

    switch (button.customId) {
      case "confirm-clear":
        const number = button.message.content.match(/\d+/)[0];
        button.message.channel.bulkDelete(number).catch(() => {
          return button.editReply(
            `🚫 You can't purge messages that are older than 14 days.`
          );
        });

        return button.editReply({
          ephemeral: true,
          content: "⛑️ " + "All messages have been cleared" + `: \`${number}\``,
        });
    }
  }
};
