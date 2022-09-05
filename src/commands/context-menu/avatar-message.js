const { Command } = require("sheweny");

module.exports = class AvatarMessageContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Get-Avatar",
      nameLocalizations: { fr: "Obtenir-Avatar" },
      type: "CONTEXT_MENU_MESSAGE",
      description: "🖼️ Get avatar of a user.",
      descriptionLocalizations: {
        fr: "🖼️ Obtenir l'avatar d'un utilisateur.",
      },
      examples: "Use right click on a message -> `Applications` -> Get-Avatar",
      usage: "https://i.imgur.com/oejd8GS.png",
      category: "Context-Menu",
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];

    const message = await interaction.channel.messages.fetch(
      interaction.targetId
    );

    if (!message) return interaction.editReply(errors.error34);

    return interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setDescription(message.author.toString())
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
