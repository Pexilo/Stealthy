const { Command } = require("sheweny");

module.exports = class LsWarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warns-list",
      description: "🔨 List all warns of a user.",
      examples:
        "/warns-list `member:@Pexilo#0001` => 🔨 List all warns of `@Pexilo#0001`",
      category: "Admin",
      userPermissions: ["MODERATE_MEMBERS"],
      clientPermissions: ["MODERATE_MEMBERS"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "💡 The user to list warns of.",
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

    const fetchGuild = await this.client.getGuild(guild);
    const filteredUser = fetchGuild.users.filter((u) => u.id === member.id);
    if (filteredUser.length === 0)
      return interaction.editReply(`🚫 This user has no warns.`);

    let warnList = `🔨 **Warns of ${member.toString()}**\n`;
    let i = filteredUser.length + 1;

    filteredUser
      .slice()
      .reverse()
      .forEach((warn) => {
        i--;
        warnList += `\n**${i}:** by <@${
          warn.moderator
        }> - ${this.client.Formatter(warn.date)}\n`;
        warnList += `Reason: \`${warn.reason}\`\n`;
      });

    // for (let warn of filteredUser) {
    //   i++;
    //   warnList += `\n**${i}:** by <@${
    //     warn.moderator
    //   }> - ${this.client.Formatter(warn.date)}\n`;
    //   warnList += `Reason: \`${warn.reason}\`\n`;
    // }

    return interaction.editReply(warnList);
  }
};
