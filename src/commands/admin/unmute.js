const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class UnMuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "🔊 Unmute a specific member.",
      examples: "/unmute `member:@Pexilo#0001` => 🔉 Unmute `@Pexilo#0001`",
      category: "Admin",
      userPermissions: ["ModerateMembers"],
      clientPermissions: ["ModerateMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "👤 Member to unmute",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "❔ Reason for the unmute",
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find that user.`);
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    // Check if the member is already muted
    if (!member.isCommunicationDisabled()) {
      return interaction.editReply(`\`🔊\` ${member.toString()} is not muted.`);
    }

    try {
      member.timeout(
        null,
        `by ${interaction.user.tag} ${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        `\`🚫\` I can't unmute ${member.toString()}.`
      );
    }
    interaction.editReply({
      content: `\`🔊\` ${member.toString()} is no longer muted.`,
    });

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: `by ${interaction.user.tag}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setDescription(`${member.toString()} has been unmuted.`)
            .setFields({
              name: `Reason` + ":",
              value: `${reason || "No reason provided"}`,
              inline: true,
            })
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("#c97628")

            .setFooter({
              text: `${member.user.tag} - ${member.user.id}`,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
