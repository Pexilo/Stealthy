const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      nameLocalizations: {},
      description: "🧹 Clear a certain amount of messages from a channel.",
      descriptionLocalizations: {
        fr: "🧹 Supprimer un certain nombre de messages d'un salon.",
        de: "🧹 Löschen Sie eine bestimmte Anzahl von Nachrichten aus einem Kanal.",
        "es-ES": "🧹 Eliminar una cierta cantidad de mensajes de un canal.",
      },
      examples: "/clear `number:5` => 🧹 Delete `5` messages in a channel",
      usage: "https://i.imgur.com/drN25If.png",
      category: "Admin",
      userPermissions: ["Administrator"],
      clientPermissions: [
        "ViewChannel",
        "ManageMessages",
        "ReadMessageHistory",
      ],
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: "number",
          nameLocalizations: { fr: "nombre", de: "zahl", "es-ES": "número" },
          description: "🔢 Number of messages to delete",
          descriptionLocalizations: {
            fr: "🔢 Nombre de messages à supprimer",
            de: "🔢 Anzahl der zu löschenden Nachrichten",
            "es-ES": "🔢 Número de mensajes a eliminar",
          },
          required: true,
          min_value: 1,
          max_value: 100,
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { clear } = this.client.la[lang].commands.admin;

    const number = options.getInteger("number");

    return interaction.editReply({
      content: eval(clear.reply),
      components: [
        this.client.ButtonRow([
          {
            customId: "confirm-clear",
            style: "SUCCESS",
            emoji: "✅",
          },
        ]),
      ],
    });
  }
};
