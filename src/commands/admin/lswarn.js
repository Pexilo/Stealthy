const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class LsWarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warns-list",
      description: "🔨 List all warns of a user.",
      examples:
        "/warns-list `member:@Pexilo#0001` => 🔨 List all warns of `@Pexilo#0001`",
      category: "Admin",
      userPermissions: ["ModerateMembers"],
      clientPermissions: ["ModerateMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "👤 The user to list warns of",
          required: true,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find that user.`);

    const fetchGuild = await this.client.getGuild(guild);
    const filteredUser = fetchGuild.logs.users.filter(
      (u) => u.id === member.id
    );
    if (filteredUser.length === 0)
      return interaction.editReply(`\`🚫\` This user has no warns.`);

    let warnList = "";
    let i = filteredUser.length + 1;
    let s = 1;

    filteredUser
      .slice()
      .reverse()
      .forEach((warn) => {
        i--;
        s++;
        if (s > 10) return;
        warnList += `\n**${i}:** by <@${
          warn.moderator
        }> - ${this.client.Formatter(warn.date, "R")}\n`;
        warnList += `Reason: \`${warn.reason}\`\n`;
      });

    return interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: `${member.user.tag} warns 🔨`,
            iconURL: member.user.avatarURL({ dynamic: true }),
          })
          .setDescription(warnList)
          .setTimestamp()
          .setFooter({
            text: `${member.user.tag} - ${member.user.id}`,
          }),
      ],
    });
  }
};
