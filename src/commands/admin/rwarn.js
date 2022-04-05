const { Command } = require("sheweny");

module.exports = class RWarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "remove-warn",
      description: "🔨 Remove a warn from a user.",
      examples:
        "/remove-warn `member:@Pexilo#0001` `number:2` => 🔨 Remove warn #2 from `@Pexilo#0001`",
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
        {
          type: "NUMBER",
          name: "number",
          description: "💡 The number of the warn to remove. (see /list-warns)",
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
    const number = options.getNumber("number");

    const fetchGuild = await this.client.getGuild(guild);
    const filteredUser = fetchGuild.users.filter((u) => u.id === member.id);
    if (filteredUser.length === 0)
      return interaction.editReply(`🚫 This user has no warns.`);

    let index;
    try {
      index = filteredUser[number - 1].case;
    } catch (e) {
      return interaction.editReply(
        `🚫 Warn **#${number}** of ${member.toString()} does not exist.`
      );
    }

    const filteredCase = fetchGuild.users.map((u) => u.case).indexOf(index);
    fetchGuild.users.splice(filteredCase, 1);
    await this.client.updateGuild(guild, { users: fetchGuild.users });

    return interaction.editReply(
      `❎ Warn **#${number}** of ${member.toString()} has been removed.`
    );
  }
};
