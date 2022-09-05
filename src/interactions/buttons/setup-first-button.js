const { Button } = require("sheweny");

module.exports = class SetupMenuButton extends Button {
  constructor(client) {
    super(client, ["setup-menu"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, member } = button;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { setupFirst } = this.client.la[lang].interactions.buttons;

    if (!member.permissions.has("ManageGuild"))
      return button.editReply(errors.error40);

    button.editReply({
      ephemeral: true,
      content: eval(setupFirst.reply),
      components: [
        this.client.SelectMenuRow("setup-select", setupFirst.modal1.title, [
          {
            label: setupFirst.modal1.option1.label,
            description: setupFirst.modal1.option1.description,
            value: "channel_option",
            emoji: "📚",
          },
          {
            label: setupFirst.modal1.option2.label,
            description: setupFirst.modal1.option2.description,
            value: "jtc_option",
            emoji: "🔊",
          },
          {
            label: setupFirst.modal1.option3.label,
            description: setupFirst.modal1.option3.description,
            value: "roleclaim_option",
            emoji: "🗂️",
          },
          {
            label: setupFirst.modal1.option4.label,
            description: setupFirst.modal1.option4.description,
            value: "autorole_option",
            emoji: "🎩",
          },
          {
            label: setupFirst.modal1.option5.label,
            description: setupFirst.modal1.option5.description,
            value: "blacklist_option",
            emoji: "🛡️",
          },
          {
            label: setupFirst.modal1.option6.label,
            description: setupFirst.modal1.option6.description,
            value: "moderation_option",
            emoji: "🗡️",
          },
          {
            label: setupFirst.modal1.option7.label,
            description: setupFirst.modal1.option7.description,
            value: "lang_option",
            emoji: "🌐",
          },
        ]),
      ],
    });
  }
};
