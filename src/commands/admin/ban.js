const { Command } = require("sheweny");

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      description: "🔪 Ban a member from the server.",
      examples: "/ban `user:@Pexilo#0001` => 🔥 Ban Pexilo from the server.",
      category: "Admin",
      userPermissions: ["BAN_MEMBERS"],
      clientPermissions: ["BAN_MEMBERS"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "💡User to ban",
          required: true,
        },

        {
          type: "STRING",
          name: "reason",
          description: "💡Reason for the ban",
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`🚫 I can't find that user.`);
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs_Cnl);
    if (!logsChannel)
      return interaction.editReply(
        `🚫 I can't find the logs channel.\n\n> Please use \`/setup channels\` to set it up.`
      );

    try {
      await member.ban({
        reason: `by ${interaction.member.user.tag}${
          reason ? ": " + reason : ""
        }`,
      });
    } catch (e) {
      return interaction.editReply(
        "🚫 You don't have permission to ban this user."
      );
    }

    logsChannel.send({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: `by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setDescription(member.toString() + " has been banned.")
          .addFields({
            name: "Reason",
            value: `${reason || "No reason provided"}`,
          })
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setColor("#8B0000")
          .setTimestamp()
          .setFooter({
            text: member.user.tag + " - " + member.user.id,
          }),
      ],
    });

    return interaction.editReply(
      `🔥 ${member.toString()} has been banned from the server.${
        reason ? `\n> Reason: \`${reason}\`` : ""
      }`
    );
  }
};
