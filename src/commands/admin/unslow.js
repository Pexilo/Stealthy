const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = class UnSlowCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unslow",
      nameLocalizations: {},
      description: "🐇 Remove the slowmode of a channel.",
      descriptionLocalizations: {
        fr: "🐇 Retirer le slowmode d'un salon.",
      },
      examples:
        "/unslow `channel:#general` => 🕒 Remove the slowmode of `#general` channel",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon" },
          description: "📙 Channel to remove the slowmode from",
          descriptionLocalizations: {
            fr: "📙 Salon sur lequel retirer le slowmode",
          },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the slowmode",
          descriptionLocalizations: {
            fr: "❔ Raison du slowmode",
          },
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild, member } = interaction;

    const channel = options.getChannel("channel");
    if (!channel)
      return interaction.editReply(`\`🚫\` I can't find this channel.`);

    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await channel.setRateLimitPerUser(
        0,
        `by ${member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to set the slowmode for this channel."
      );
    }

    interaction.editReply(
      `\`🐇\` ${channel.toString()} slowmode has been reset.`
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
            .setDescription(`${channel.toString()} slowmode has been disabled.`)
            .addFields({
              name: "Reason",
              value: reason || "No reason provided",
            })
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/313/rabbit_1f407.png"
            )
            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
