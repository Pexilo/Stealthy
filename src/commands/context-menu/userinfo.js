const { Command } = require("sheweny");

module.exports = class UserInfoContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "User-Info",
      type: "CONTEXT_MENU_USER",
      description: "📄 Get information about a specific user.",
      examples: "Use right click on a user -> `Applications` -> User-Info",
      category: "Context-Menu",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const { guild, options } = interaction;
    const lang = GetLanguage(guild.id);
    const member = options.getMember("user");

    return interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
          })
          .addFields(
            {
              name:
                "📅 " +
                `${await FastTranslate(UserInfo.Embed.field1, lang)}` +
                ":",
              value: this.client.Formatter(member.user.createdAt),
              inline: true,
            },
            {
              name:
                "📥 " +
                `${await FastTranslate(UserInfo.Embed.field2, lang)}` +
                ":",
              value: this.client.Formatter(member.joinedAt),
              inline: true,
            },
            {
              name:
                "🧮 " +
                `${await FastTranslate(UserInfo.Embed.field3, lang)}` +
                ":",
              value: member.roles.cache
                .filter((r) => r.id !== member.guild.id)
                .map((r) => r.toString())
                .join(", "),
            }
          ),
      ],
    });
  }
};
