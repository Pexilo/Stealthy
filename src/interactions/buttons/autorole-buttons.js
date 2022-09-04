const { Button } = require("sheweny");

module.exports = class AutoRoleSetupButtons extends Button {
  constructor(client) {
    super(client, ["list-autorole", "reset-autorole"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, member } = button;
    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const {} = this.client.la[lang];

    switch (button.customId) {
      case "reset-autorole":
        if (!member.permissions.has("ManageGuild"))
          return button.editReply(
            `\`🚫\` You don't have permission to do that!`
          );

        if (fetchGuild.autoRole.roles.length === 0)
          return button.editReply(`\`🚫\` The autorole system is not set.`);

        await this.client.UpdateGuild(guild, {
          "autoRole.roles": [],
        });

        return button.editReply(`\`❎\` The autorole system as been reset`);

      case "list-autorole":
        const autoroleArray = fetchGuild.autoRole.roles;

        if (autoroleArray.length === 0)
          return button.editReply(
            `\`🚫\` No autorole set.\n\n> Set one with \`/setup autorole add\``
          );

        return button.editReply({
          content: `\`✅\` Roles that will be given to newcomers: ${autoroleArray
            .map((r) => `<@&${r}>`)
            .join(", ")}`,
          components: [
            this.client.ButtonRow([
              {
                customId: "reset-autorole",
                label: "Reset",
                style: "SECONDARY",
                emoji: "🗑",
              },
            ]),
          ],
        });
    }
  }
};
