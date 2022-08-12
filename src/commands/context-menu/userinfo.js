const { Command } = require("sheweny");

module.exports = class UserInfoContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "User-Info",
      type: "CONTEXT_MENU_USER",
      description: "📄 Get information about a specific user.",
      examples: "Use right click on a user -> `Applications` -> User-Info",
      usage: "https://i.imgur.com/Y653nFR.png",
      category: "Context-Menu",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

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
          name: "📅 " + "Account created" + ":",
          value: `${this.client.Formatter(member.user.createdAt, "R")}`,
          inline: true,
        },
        {
          name: "📥 " + "Joined the server" + ":",
          value: `${this.client.Formatter(member.joinedAt, "R")}`,
          inline: true,
        }
      );

    if (member.roles.cache.size > 1) {
      userInfo.addFields({
        name: "🧮 " + "Roles" + ":",
        value: member.roles.cache
          .filter((r) => r.id !== member.guild.id)
          .map((r) => r.toString())
          .join(", "),
      });
    }

    if (member.presence.activities.length > 0) {
      const activityType = [
        "🎮 Playing",
        "🎥 Streaming",
        "🎧 Listening",
        "📺 Watching",
        "📝 Custom Status",
      ];

      member.presence.activities.forEach((activity) => {
        userInfo.addFields({
          name: activityType[activity.type],
          value: `${activity.name} ${
            activity.details ? `\n\`${activity.details}\`` : ""
          } ${activity.state ? `\n\`${activity.state}\`` : ""}`,
          inline: true,
        });
      });
    }

    return interaction.editReply({
      embeds: [userInfo],
    });
  }
};
