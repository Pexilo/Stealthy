const { SelectMenu } = require("sheweny");

module.exports = class logsEnabledSelect extends SelectMenu {
  constructor(client) {
    super(client, ["logs-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild, values } = selectMenu;

    await this.client.UpdateGuild(guild, {
      "logs.enabled": values,
    });

    const spelledValues = values
      .map((value) => {
        switch (value) {
          case "msgDelete":
            return "\n`🗑️` *Message deletes*";
          case "msgEdit":
            return "\n`✍` *Message edits*";
          case "joinLeave":
            return "\n`🚪` *Join & Leave*";
          case "moderation":
            return "\n`🛡️` *Moderation*";
          case "channels":
            return "\n`📙` *Channels*";
        }
      })
      .join(", ");

    return selectMenu.editReply({
      content: `**Logs enabled:**${spelledValues}\n\n> To log \`Kick\`, \`Ban\`, \`Mute\` commands, it is **necessary** to use the **commands given by Stealthy** (\`/kick\`, \`/ban\` & \`/mute\`)`,
    });
  }
};
