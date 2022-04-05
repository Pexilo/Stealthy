const { Button } = require("sheweny");

module.exports = class AutoRoleButton extends Button {
  constructor(client) {
    super(client, ["list-autorole", "reset-autorole"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild } = button;
    const fetchGuild = await this.client.getGuild(guild);

    switch (button.customId) {
      case "reset-autorole":
        if (!button.member.permissions.has("MANAGE_GUILD"))
          return button.editReply(`🚫 You don't have permission to do that!`);

        if (!fetchGuild.autorole_Roles.length > 0)
          return button.editReply(`🚫 The autorole system is not set.`);

        await this.client.updateGuild(guild, {
          autorole_Roles: [],
        });

        return button.editReply(`❎ The autorole system as been reset`);

      case "list-autorole":
        const autoroleArray = fetchGuild.autorole_Roles;

        if (!autoroleArray.length > 0)
          return button.editReply(
            `🚫 No autorole set.\n> Set one with \`/setup autorole add\``
          );

        return button.editReply({
          content: `✅ Roles that will be given to new users: ${autoroleArray
            .map((r) => `<@&${r}>`)
            .join(", ")}`,
          components: [
            this.client.ButtonRow(["reset-autorole"], ["Reset"], ["SECONDARY"]),
          ],
        });
    }
  }
};
