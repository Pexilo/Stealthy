const { Command } = require("sheweny");

module.exports = class RWarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warn-remove",
      description: "🔨 Remove a warn from a user.",
      examples:
        "/warn-remove `member:@Pexilo#0001` `number:2` => 🔨 Remove warn #2 from `@Pexilo#0001`",
      category: "Admin",
      userPermissions: ["MODERATE_MEMBERS"],
      clientPermissions: ["MODERATE_MEMBERS"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "👤 User to remove a warn from",
          required: true,
        },
        {
          type: "NUMBER",
          name: "number",
          description: "🔢 The index of the warn to remove (see /list-warns)",
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
    const filteredUser = fetchGuild.logs.users.filter(
      (u) => u.id === member.id
    );
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

    const filteredCase = fetchGuild.logs.users
      .map((u) => u.case)
      .indexOf(index);
    fetchGuild.logs.users.splice(filteredCase, 1);
    await this.client.updateGuild(guild, {
      "logs.users": fetchGuild.logs.users,
    });

    return interaction.editReply(
      `❎ Warn **#${number}** of ${member.toString()} has been removed.`
    );
  }
};
