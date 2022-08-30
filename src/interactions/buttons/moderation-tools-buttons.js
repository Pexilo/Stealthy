const { Button } = require("sheweny");

module.exports = class moderationToolsButtons extends Button {
  constructor(client) {
    super(client, ["blacklist-tool", "delDcInvites-tool"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;

    const { guild } = button;
    const fetchGuild = await this.client.getGuild(guild);
    const moderationTools = fetchGuild.moderationTools.enabled;

    switch (button.customId) {
      case "blacklist-tool":
        moderationTools.push("blacklist");

        button.editReply({
          content:
            "`🛡️` Blacklist feature is now enabled ✅\n\n> You can re-run your command",
        });
        break;

      case "delDcInvites-tool":
        moderationTools.push("delDcInvites");

        button.editReply({
          content:
            "`🔗` Discord links suppressor is now enabled ✅\n\n> You can re-run your command",
        });
        break;
    }

    await this.client.updateGuild(guild, {
      "moderationTools.enabled": moderationTools,
    });
  }
};
