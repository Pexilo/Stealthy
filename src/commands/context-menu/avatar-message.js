const { Command } = require("sheweny");

module.exports = class AvatarMessageContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Get-Avatar",
      type: "CONTEXT_MENU_MESSAGE",
      description: "🖼️ Get avatar of a specific user",
      examples: "Use right click on a message -> `Applications` -> Get-Avatar",
      category: "Context-Menu",
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const message = await interaction.channel.messages.fetch(
      interaction.targetId
    );

    if (!message) return interaction.editReply(`❓Message not found`);

    return interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({ name: message.author.tag })
          .setImage(
            message.author.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 512,
            })
          ),
      ],
    });
  }
};
