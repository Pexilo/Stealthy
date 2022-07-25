const { Command } = require("sheweny");

module.exports = class UnlockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unlock",
      description: "🔓 Unlock the current channel.",
      examples:
        "/unlock `channel:#general` => 🔓 Allow users to send messages in #general.",
      category: "Admin",
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "📙 Channel to unlock",
          required: true,
          channelTypes: ["GUILD_TEXT"],
        },
        {
          type: "STRING",
          name: "reason",
          description: "❔ Reason for the unlock",
        },
      ],
    });
  }

  async execute(interaction) {
    const { options, guild } = interaction;
    if (!(await this.client.Defer(interaction))) return;

    const channel = options.getChannel("channel");
    if (channel.permissionsFor(guild.id).has("SEND_MESSAGES")) {
      return interaction.editReply("`🚫` This channel is already unlocked.");
    }
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SEND_MESSAGES: true,
      });
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to unlock this channel."
      );
    }

    interaction.editReply(
      `\`🔓\` Channel ${channel.toString()} has been unlocked.`
    );

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
            .setDescription(channel.toString() + " has been unlocked.")
            .addFields({
              name: "Reason",
              value: reason || "No reason provided",
            })
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/unlocked_1f513.png"
            )
            .setColor("#ffac33")

            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
