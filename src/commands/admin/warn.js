const { Command } = require("sheweny");

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warn",
      description: "🔨 Warn a user.",
      examples:
        "/warn `member:@Pexilo#0001` `reason:some reason` => 🔨 Warn `@Pexilo#0001` for `some reason`",
      category: "Admin",
      userPermissions: ["MODERATE_MEMBERS"],
      clientPermissions: ["MODERATE_MEMBERS"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "💡 User to warn",
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: "💡 Reason for the warn",
          required: true,
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
        `🚫 I can't find the logs channel.\n> Please use \`/setup channels\` to set it up.`
      );

    const userArray = fetchGuild.users;
    const cases = fetchGuild.users.map((u) => u.case);
    const highestCase = Math.max(...cases);

    let d = new Date();
    const user = {
      case: cases.length === 0 ? 0 : highestCase + 1,
      id: member.id,
      name: member.displayName,
      moderator: interaction.user.id,
      reason: reason,
      date: d.getTime(),
    };

    userArray.push(user);
    await this.client.updateGuild(guild, { users: userArray });

    logsChannel.send({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: `by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
          })
          .setDescription(
            `${member.toString()} has been warn.\n\nUse, \`/list-warns user:@${
              member.user.tag
            }\` to see all warns.`
          )
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
      content: `🔨 ${member.toString()} has been warn.`,
    });
  }
};
