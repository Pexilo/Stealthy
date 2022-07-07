const { Command } = require("sheweny");

module.exports = class UnMuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "🔊 Unmute a specific member.",
      examples: "/unmute `member:@Pexilo#0001` => 🔉Unmute `@Pexilo#0001`",
      category: "Admin",
      userPermissions: ["MODERATE_MEMBERS"],
      clientPermissions: ["MODERATE_MEMBERS"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "💡 Member to unmute",
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: "💡 Reason for the unmute",
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`🚫 I can't find that user.`);
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs_Cnl);
    if (!logsChannel)
      return interaction.editReply(
        `🚫 I can't find the logs channel.\n\n> Please use \`/setup channels\` to set it up.`
      );

    // Check if the member is already muted
    if (!member.isCommunicationDisabled()) {
      return interaction.editReply(`🔊 ${member.toString()} is not muted.`);
    }

    try {
      member.timeout(
        0,
        `by ${interaction.user.tag} ${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(`🚫 I can't unmute ${member.toString()}.`);
    }

    logsChannel.send({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: `by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
          })
          .setDescription(`${member.toString()} has been unmuted.`)
          .setFields({
            name: `Reason` + ":",
            value: `${reason || "No reason provided"}`,
            inline: true,
          })
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({
            text: `${member.user.tag} - ${member.user.id}`,
          }),
      ],
    });
    return interaction.editReply({
      content: `🔊 ${member.toString()} is no longer muted.`,
    });
  }
};
