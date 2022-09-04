const { Command } = require("sheweny");

module.exports = class UserInfoContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "User-Info",
      nameLocalizations: { fr: "Info-Utilisateur" },
      type: "CONTEXT_MENU_USER",
      description: "📄 Get information about a user.",
      descriptionLocalizations: {
        fr: "📄 Obtenir des informations sur un utilisateur.",
      },
      examples: "Use right click on a user -> `Applications` -> User-Info",
      usage: "https://i.imgur.com/Y653nFR.png",
      category: "Context-Menu",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { userinfo } = this.client.la[lang].commands.contextMenu;

    const { options } = interaction;
    const member = options.getMember("user");

    let userInfo = this.client
      .Embed()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: userinfo.embed1.field1,
          value: `${this.client.Formatter(member.user.createdAt, "R")}`,
          inline: true,
        },
        {
          name: userinfo.embed1.field2,
          value: `${this.client.Formatter(member.joinedAt, "R")}`,
          inline: true,
        }
      );

    if (member.roles.cache.size > 1) {
      let roles = member.roles.cache
        .reverse()
        .filter((r) => r.id !== member.guild.id)
        .map((r) => r);

      if (roles.length > 3) {
        roles.splice(3);
        roles.push("...");
      }

      userInfo.addFields({
        name: userinfo.embed1.field3,
        value: roles.map((r) => r.toString()).join(", "),
      });
    }

    if (member.presence.activities.length > 0) {
      const activityType = userinfo.embed1.activities;

      member.presence.activities.forEach((activity) => {
        userInfo.addFields({
          name: activityType[activity.type],
          value: `${activity.name} ${
            activity.details
              ? `\n\`${this.client.Truncate(activity.details, 22)}\``
              : ""
          } ${
            activity.state
              ? `\n\`${this.client.Truncate(activity.state, 22)}\``
              : ""
          }`,
          inline: true,
        });
      });
    }

    return interaction.editReply({
      embeds: [userInfo],
    });
  }
};
