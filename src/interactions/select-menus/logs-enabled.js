const { SelectMenu } = require("sheweny");

module.exports = class logsEnabledSelect extends SelectMenu {
  constructor(client) {
    super(client, ["logs-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild, values } = selectMenu;

    await this.client.updateGuild(guild, {
      "logs.enabled": values,
    });

    const spelledValues = values
      .map((value) => {
        switch (value) {
          case "msgDelete":
            return "message deletes";
          case "msgEdit":
            return "message edits";
          case "joinLeave":
            return "join & leave";
          case "moderation":
            return "moderation";
          case "channels":
            return "channels";
        }
      })
      .join(", ");

    return selectMenu.editReply({
      content: `Logs enabled for \`${spelledValues}\`\n\n> To **log kick, ban, mute** commands, it is **necessary** to use the **commands given by Stealthy** (\`/kick\`, \`/ban\` & \`/mute\`)`,
    });
  }
};
