const { Command } = require("sheweny");

module.exports = class AvatarUserContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Show-Avatar",
      type: "CONTEXT_MENU_USER",
      description: "🖼️ Get avatar of a specific user.",
      examples: "Use right click on a user -> `Applications` -> Show-Avatar",
      usage: "https://i.imgur.com/ebWVSJO.png",
      category: "Context-Menu",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const user = interaction.options.getUser("user");

    if (!user) return interaction.editReply(`❓User not found`);

    return interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setDescription(user.toString())
          .setImage(
            user.displayAvatarURL({ dynamic: true, format: "png", size: 512 })
          ),
      ],
    });
  }
};
