const { Button } = require("sheweny");

module.exports = class logsSetupButton extends Button {
  constructor(client) {
    super(client, ["setup-logs"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;

    const { guild } = button;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { logsTypes } = this.client.la[lang].interactions.buttons;

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    if (!logsChannel) {
      return button.editReply(errors.error45);
    }
    const enabledLogs = fetchGuild.logs.enabled;

    return button.editReply({
      components: [
        this.client.SelectMenuRow(
          "logs-select",
          logsTypes.select1.title,
          [
            {
              label: logsTypes.select1.option1.label,
              description: logsTypes.select1.option1.description,
              value: "moderation",
              emoji: "🛡️",
              default: enabledLogs.includes("moderation"),
            },
            {
              label: logsTypes.select1.option2.label,
              description: logsTypes.select1.option2.description,
              value: "channels",
              emoji: "📙",
              default: enabledLogs.includes("channels"),
            },
            {
              label: logsTypes.select1.option3.label,
              description: logsTypes.select1.option3.description,
              value: "joinLeave",
              emoji: "📝",
              default: enabledLogs.includes("joinLeave"),
            },
            {
              label: logsTypes.select1.option4.label,
              description: logsTypes.select1.option4.description,
              value: "msgDelete",
              emoji: "🗑",
              default: enabledLogs.includes("msgDelete"),
            },
            {
              label: logsTypes.select1.option5.label,
              description: logsTypes.select1.option5.description,
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
