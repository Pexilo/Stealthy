const { Command } = require("sheweny");

module.exports = class AvatarUserContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Show-Avatar",
      nameLocalizations: {
        fr: "Afficher-Avatar",
        de: "Avatar-Anzeigen",
        "es-ES": "Mostrar-Avatar",
      },
      type: "CONTEXT_MENU_USER",
      description: "🖼️ Get avatar of a user.",
      descriptionLocalizations: {
        fr: "🖼️ Obtenir l'avatar d'un utilisateur.",
        de: "🖼️ Avatar eines Benutzers abrufen.",
        "es-ES": "🖼️ Obtener el avatar de un usuario.",
      },
      examples: "Use right click on a user -> `Applications` -> Show-Avatar",
      usage: "https://i.imgur.com/ebWVSJO.png",
      category: "Context-Menu",
      clientPermissions: ["EmbedLinks"],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];

    const user = interaction.options.getUser("user");

    if (!user) return interaction.editReply(errors.error1);

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
