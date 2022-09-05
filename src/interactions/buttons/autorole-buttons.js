const { Button } = require("sheweny");

module.exports = class AutoRoleSetupButtons extends Button {
  constructor(client) {
    super(client, ["list-autorole", "reset-autorole"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, member } = button;
    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { autorole } = this.client.la[lang].interactions.buttons;

    switch (button.customId) {
      case "reset-autorole":
        if (!member.permissions.has("ManageGuild"))
          return button.editReply(errors.error40);

        if (fetchGuild.autoRole.roles.length === 0)
          return button.editReply(errors.error23);

        await this.client.UpdateGuild(guild, {
          "autoRole.roles": [],
        });

        return button.editReply(autorole.reset.reply);

      case "list-autorole":
        const autoroleArray = fetchGuild.autoRole.roles;

        if (autoroleArray.length === 0) return button.editReply(errors.error23);

        return button.editReply({
          content: eval(autorole.list.reply),
          components: [
            this.client.ButtonRow([
              {
                customId: "reset-autorole",
                label: autorole.button1,
                style: "SECONDARY",
                emoji: "🗑",
              },
            ]),
          ],
        });
    }
  }
};
