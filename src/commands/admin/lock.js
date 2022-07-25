const { Command } = require("sheweny");

module.exports = class LockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lock",
      description: "🔒 Lock the current channel.",
      examples:
        "/lock `channel:#general` => 🔒 Forbid users from sending messages in #general.",
      category: "Admin",
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "📙 Channel to lock",
          required: true,
          channelTypes: ["GUILD_TEXT"],
        },
        {
          type: "STRING",
          name: "reason",
          description: "❔ Reason for the lock",
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
    const reason = options.getString("reason");

    if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES")) {
      return interaction.editReply("`🚫` This channel is already locked.");
    }

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SEND_MESSAGES: false,
      });
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to lock this channel."
      );
    }

    interaction.editReply(
      `\`🔒\` Channel ${channel.toString()} has been locked.\n\n> Use \`/unlock\` to unlock it.`
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
            .setDescription(channel.toString() + " has been locked.")
            .addFields({
              name: "Reason",
              value: `${reason || "No reason provided"}`,
            })
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/locked_1f512.png"
            )
            .setColor("#ffac33")
            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
