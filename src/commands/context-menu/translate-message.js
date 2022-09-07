const { Command } = require("sheweny");

module.exports = class TranslateMessageContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Translate",
      nameLocalizations: {
        fr: "Traduire",
        de: "Übersetzen",
        "es-ES": "Traducir",
      },
      type: "CONTEXT_MENU_MESSAGE",
      description: "🔖 Translate a message.",
      descriptionLocalizations: {
        fr: "🔖 Traduire un message.",
        de: "🔖 Eine Nachricht übersetzen.",
        "es-ES": "🔖 Traducir un mensaje.",
      },
      examples: "Use right click on a message -> `Applications` -> Translate.",
      usage: "https://i.imgur.com/zjLEvcb.png",
      category: "Context-Menu",
      clientPermissions: ["EmbedLinks", "ViewChannel", "ReadMessageHistory"],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const message = options.getMessage("message");
    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { translateMessage } = this.client.la[lang].commands.contextMenu;

    if (!message || message.content.length === 0)
      return interaction.editReply(errors.error35);

    // what language the user can translate to
    const translateTo = {
      en: "🇺🇸",
      fr: "🇫🇷",
      de: "🇩🇪",
      "es-ES": "🇪🇸",
      it: "🇮🇹",
      pt: "🇵🇹",
      ru: "🇷🇺",
      ja: "🇯🇵",
    };

    // sort languages with the guild language in first
    const sortedLanguages = {
      [lang]: translateTo[lang],
      ...Object.fromEntries(
        Object.entries(translateTo).filter(([key]) => key !== lang)
      ),
    };

    // create the buttons
    const languagesButtons = Object.entries(sortedLanguages).map(
      ([key, value]) => {
        return {
          customId: `translate_${key}_${message.id}`,
          style: key === lang ? "PRIMARY" : "SECONDARY",
          emoji: value,
        };
      }
    );

    await interaction.editReply({
      content: translateMessage.reply,
      components: [
        this.client.ButtonRow(languagesButtons.slice(0, 5)),
        this.client.ButtonRow(languagesButtons.slice(5, 10)),
      ],
    });
  }
};
