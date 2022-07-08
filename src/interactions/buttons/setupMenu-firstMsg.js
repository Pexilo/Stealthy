const { Button } = require("sheweny");
const { Permissions } = require("discord.js");

module.exports = class SetupMenuButton extends Button {
  constructor(client) {
    super(client, ["setup-menu"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, member } = button;

    if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return button.editReply(
        `🚫 You don't have permission to do that! Missing \`MANAGE_GUILD\``
      );

    button.editReply({
      ephemeral: true,
      content: `What do you want to setup ${button.user.toString()} ?`,
      components: [
        this.client.SelectMenuRow(
          "setup-select",
          "Choose something to change",
          [
            {
              label: "Channels Setup",
              description: "REQUIRED - Setup your channels",
              value: "channel_option",
              emoji: "📚",
            },
            {
              label: "Role Claim Setup",
              description: "OPTIONAL - Setup role claim",
              value: "roleclaim_option",
              emoji: "🗂️",
            },
            {
              label: "Join to Create Setup",
              description: "OPTIONAL - Setup your join to create",
              value: "jtc_option",
              emoji: "🔊",
            },
            {
              label: "Blacklist Setup",
              description: "OPTIONAL - Setup blacklist times",
              value: "blacklist_option",
              emoji: "🛡️",
            },
            {
              label: "Language Setup",
              description:
                "OPTIONAL - Setup your language (translate-msg command)",
              value: "lang_option",
              emoji: "🌐",
            },
          ]
        ),
      ],
    });
  }
};
