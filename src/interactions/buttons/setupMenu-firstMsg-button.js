const { Button } = require("sheweny");

module.exports = class SetupMenuButton extends Button {
  constructor(client) {
    super(client, ["setup-menu"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { member } = button;

    if (!member.permissions.has("ManageGuild"))
      return button.editReply(
        `\`🚫\` You don't have permission to do that! Missing \`ManageGuild\``
      );

    button.editReply({
      ephemeral: true,
      content: `What do you want to setup ${member.toString()} ?`,
      components: [
        this.client.SelectMenuRow(
          "setup-select",
          "What feature do you want to configure?",
          [
            {
              label: "Channels Setup",
              description: "REQUIRED - Configure the channels used by the bot.",
              value: "channel_option",
              emoji: "📚",
            },
            {
              label: "Join to Create Setup",
              description:
                "OPTIONAL - Lighten your voice channels with just one",
              value: "jtc_option",
              emoji: "🔊",
            },
            {
              label: "Role Claim Setup",
              description: "OPTIONAL - Let users claim roles from a message",
              value: "roleclaim_option",
              emoji: "🗂️",
            },
            {
              label: "Auto Role Setup",
              description: "OPTIONAL - Give roles to newcomers",
              value: "autorole_option",
              emoji: "🎩",
            },
            {
              label: "Blacklist Setup",
              description:
                "OPTIONAL - Protect your server against bots, scams, etc.",
              value: "blacklist_option",
              emoji: "🛡️",
            },
            {
              label: "Language Setup",
              description: "OPTIONAL - (WIP - Not implemented yet)",
              value: "lang_option",
              emoji: "🌐",
            },
          ]
        ),
      ],
    });
  }
};
