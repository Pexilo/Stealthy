const { Modal } = require("sheweny");

module.exports = class JTCNamesModal extends Modal {
  constructor(client) {
    super(client, ["channels-names-JTC"]);
  }

  async execute(modal) {
    const { guild } = modal;

    //get input from modal
    const channels = modal.fields.getTextInputValue("channel-JTC-input");

    //split channel names remove spaces, line breaks, empty strings
    const result = channels
      .replace(/[\n\r]/g, "")
      .split(",")
      .filter((n) => n.length !== 0)
      .map((n) => n.trim());

    let list = "";
    result.forEach((element) => {
      list += "➜ " + element + "\n";
    });

    await this.client.updateGuild(guild, {
      "joinToCreate.names": result,
    });

    await modal.reply({
      content: `\`✅\` New JTC channel names:\n${list}`,
      ephemeral: true,
    });
  }
};