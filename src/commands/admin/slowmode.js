const { Command } = require("sheweny");

module.exports = class SlowModeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "slowmode",
      description: "🕒 Set a slowmode for a channel.",
      examples:
        "/slowmode `channel:General` `format:minutes` `time:1` => 🕒 Set the slowmode for the General channel to 1 minute.",
      category: "Admin",
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "📙 Channel to set the slowmode for",
          required: true,
          channelTypes: ["GUILD_TEXT"],
        },
        {
          type: "STRING",
          name: "format",
          description: "🕒 Wich format do you want to use ?",
          required: true,
          choices: [
            {
              name: "🕒 Seconds",
              value: "seconds",
            },
            {
              name: "🕒 Minutes",
              value: "minutes",
            },
          ],
        },
        {
          type: "NUMBER",
          name: "time",
          description: "⏱️ Define the time",
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: "❔ Reason for the slowmode",
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options } = interaction;

    const channel = options.getChannel("channel");
    if (!channel) return interaction.editReply(`🚫 I can't find this channel.`);
    const format = options.getString("format");
    const time = options.getNumber("time");
    const reason = options.getString("reason");

    const formattedTime = format === "minutes" ? time * 60 : time;

    try {
      await channel.setRateLimitPerUser(
        formattedTime,
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      console.log(e.message);
      return interaction.editReply(
        "🚫 You don't have permission to set the slowmode for this channel."
      );
    }

    if (time == 0) {
      return interaction.editReply(
        `🕒 ${channel.toString()} slowmode has been reset.`
      );
    }

    return interaction.editReply(
      `🕒 ${channel.toString()} slowmode has been set to \`${time} ${format}\`.`
    );
  }
};
