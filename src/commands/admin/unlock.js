const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = class UnlockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unlock",
      nameLocalizations: { fr: "delock" },
      description: "🔓 Unlock a channel.",
      descriptionLocalizations: { fr: "🔓 Déverrouiller un salon." },
      examples:
        "/unlock `channel:#general` => 🔓 Allow users to send messages in `#general`",
      usage: "https://i.imgur.com/FLdEF1d.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon" },
          description: "📙 Channel to unlock",
          descriptionLocalizations: { fr: "📙 Salon à déverrouiller" },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the unlock",
          descriptionLocalizations: { fr: "❔ Raison du déverrouillage" },
        },
      ],
    });
  }

  async execute(interaction) {
    const { options, guild } = interaction;
    if (!(await this.client.Defer(interaction))) return;

    const channel = options.getChannel("channel");
    if (channel.permissionsFor(guild.id).has("SendMessages")) {
      return interaction.editReply("`🚫` This channel is already unlocked.");
    }
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: true,
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
