const { Button } = require("sheweny");

module.exports = class logsSetupButton extends Button {
  constructor(client) {
    super(client, ["setup-logs"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;

    const { guild } = button;

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    if (!logsChannel) {
      return button.editReply(
        `\`🚫\` I can't find the logs channel.\n\n> Please use \`/setup channels\` to set it up.`
      );
    }
    const enabledLogs = fetchGuild.logs.enabled;

    return button.editReply({
      components: [
        this.client.SelectMenuRow(
          "logs-select",
          "What logs do you want to see?",
          [
            {
              label: "Moderation",
              description: "Kick, ban, mute, warn, blacklist commands",
              value: "moderation",
              emoji: "🛡️",
              default: enabledLogs.includes("moderation"),
            },
            {
              label: "Channels changes",
              description: "Slowmode, lock, clear commands.",
              value: "channels",
              emoji: "📙",
              default: enabledLogs.includes("channels"),
            },
            {
              label: "Join & Leave",
              description: "Whenever a member joins or leaves the server.",
              value: "joinLeave",
              emoji: "📝",
              default: enabledLogs.includes("joinLeave"),
            },
            {
              label: "Message deleted",
              description: "If a message is deleted by a user.",
              value: "msgDelete",
              emoji: "🗑",
              default: enabledLogs.includes("msgDelete"),
            },
            {
              label: "Message edited",
              description: "If a message is edited by a user.",
              value: "msgEdit",
              emoji: "✍️",
              default: enabledLogs.includes("msgEdit"),
            },
          ],
          { min: 0, max: 5 }
        ),
      ],
    });
  }
};
