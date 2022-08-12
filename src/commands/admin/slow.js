const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = class SlowCommand extends Command {
  constructor(client) {
    super(client, {
      name: "slow",
      description: "🐌 Set a slowmode for a channel.",
      examples:
        "/slow `channel:#general` `format:minutes` `time:1` => 🕒 Slow time between messages in `#general` channel for `1` `minute`",
      usage: "https://i.imgur.com/wtz21Rv.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          description: "📙 Channel to set the slowmode for",
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
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
          type: ApplicationCommandOptionType.Integer,
          name: "time",
          description: "⏱️ Define the time",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "❔ Reason for the slowmode",
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const channel = options.getChannel("channel");
    if (!channel)
      return interaction.editReply(`\`🚫\` I can't find this channel.`);

    const format = options.getString("format");
    const time = options.getInteger("time");
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    const formattedTime = format === "minutes" ? time * 60 : time;

    try {
      await channel.setRateLimitPerUser(
        formattedTime,
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to set the slowmode for this channel."
      );
    }

    if (time === 0) {
      interaction.editReply(
        `\`🐇\` ${channel.toString()} slowmode has been reset.`
      );
    } else {
      interaction.editReply(
        `\`🐌\` ${channel.toString()} slowmode has been set to \`${time} ${format}\`\n\n> Use \`/unslow\` to disable it.`
      );
    }

    if (!logsChannel || !enabledLogs.includes("channels")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: `by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(
              `${channel.toString()} ${
                time !== 0
                  ? `slowmode has been set to \`${time} ${format}\`\n\n Use \`/unslow\` to disable it`
                  : "slowmode has been disabled"
              }.`
            )
            .addFields({
              name: "Reason",
              value: reason || "No reason provided",
            })
            .setThumbnail(
              `${
                time !== 0
                  ? "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/snail_1f40c.png"
                  : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/313/rabbit_1f407.png"
              }`
            )
            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
