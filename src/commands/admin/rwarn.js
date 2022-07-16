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
        {
          type: "STRING",
          name: "reason",
          description: "❔ Reason for the warn removal",
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
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

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
    const oldReason = fetchGuild.logs.users[filteredCase].reason;
    fetchGuild.logs.users.splice(filteredCase, 1);
    await this.client.updateGuild(guild, {
      "logs.users": fetchGuild.logs.users,
    });

    interaction.editReply(
      `❎ Warn **#${number}** of ${member.toString()} has been removed.`
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
              "Warn of " +
                member.toString() +
                " has been removed.\n" +
                `➡️\`${oldReason}\``
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
      .catch(() => {});
  }
};
