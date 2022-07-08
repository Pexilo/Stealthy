const { Command } = require("sheweny");

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: "nick",
      description: "🛠️ Change the nickname of a user.",
      examples:
        "/setnick `user:@Pexilo#0001` `nickname:Pexi` => 🔥Change the nickname of @Pexilo#0001 to Pexi.",
      category: "Admin",
      userPermissions: ["MANAGE_NICKNAMES"],
      clientPermissions: ["MANAGE_NICKNAMES"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "💡User to change the nickname of",
          required: true,
        },
        {
          type: "STRING",
          name: "nickname",
          description: "💡New nickname",
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: "💡Reason for changing the nickname",
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`🚫 I can't find this user.`);
    const nickname = options.getString("nickname");
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs_Cnl);
    if (!logsChannel)
      return interaction.editReply(
        `🚫 I can't find the logs channel.\n\n> Please use \`/setup channels\` to set it up.`
      );

    try {
      await member.setNickname(
        nickname,
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        "🚫 You don't have permission to change the nickname of this user."
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
          .setDescription(
            `${member.toString()} nickname has been changed. \`${
              member.user.username
            } -> ${nickname}\``
          )
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
      `🔥 Nickname of ${member.toString()} has been set to \`${nickname}\`.${
        reason ? `\n> Reason: \`${reason}\`` : ""
      }`
    );
  }
};
