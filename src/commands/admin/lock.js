const { Command } = require("sheweny");

module.exports = class LockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lock",
      description: "🔒 Lock the current channel.",
      examples:
        "/lock `channel:#general` => 🔥Forbid users from sending messages in #general.",
      category: "Admin",
      userPermissions: ["MANAGE_CHANNELS"],
      clientPermissions: ["MANAGE_CHANNELS"],
      options: [
        {
          type: "CHANNEL",
          name: "channel",
          description: "💡Channel to lock",
          required: true,
          channelTypes: ["GUILD_TEXT"],
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const channel = options.getChannel("channel");
    if (!channel) return interaction.editReply(`🚫 I can't find this channel.`);

    if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES")) {
      return interaction.editReply("🚫 This channel is already locked.");
    }

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SEND_MESSAGES: false,
      });
    } catch (e) {
      return interaction.editReply(
        "🚫 You don't have permission to lock this channel."
      );
    }

    return interaction.editReply(
      `🔒 Channel ${channel.toString()} has been locked.\n\n> Use \`/unlock ${
        channel.name
      }\` to unlock it.`
    );
  }
};
