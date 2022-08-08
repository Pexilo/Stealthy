const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: "nick",
      description: "✍️ Change the nickname of a user.",
      examples:
        "/setnick `user:@Pexilo#0001` `nickname:Pexi` => ✍️ Change the nickname of @Pexilo#0001 to Pexi.",
      category: "Admin",
      userPermissions: ["ManageNicknames"],
      clientPermissions: ["ManageNicknames"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "👤 User to change the nickname of",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "nickname",
          description: "✏️ New nickname",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "❔ Reason for changing the nickname",
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find this user.`);
    const nickname = options.getString("nickname");
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await member.setNickname(
        nickname,
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to change the nickname of this user."
      );
    }
    interaction.editReply(
      `\`✍️\` Nickname of ${member.toString()} has been set to \`${nickname}\`.${
        reason ? `\n\n> Reason: \`${reason}\`` : ""
      }`
    );

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
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
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
