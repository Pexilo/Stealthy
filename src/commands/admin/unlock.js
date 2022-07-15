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
      ],
    });
  }

  async execute(interaction) {
    const { options, guild } = interaction;
    if (!(await this.client.Defer(interaction))) return;

    const channel = options.getChannel("channel");
    if (channel.permissionsFor(guild.id).has("SEND_MESSAGES")) {
      return interaction.editReply("🚫 This channel is already unlocked.");
    }

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SEND_MESSAGES: true,
      });
    } catch (e) {
      return interaction.editReply(
        "🚫 You don't have permission to unlock this channel."
      );
    }

    interaction.editReply(
      `🔓 Channel ${channel.toString()} has been unlocked.`
    );
  }
};
