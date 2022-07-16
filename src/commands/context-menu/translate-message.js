const { Command } = require("sheweny");
const { languageFlags } = require("../../languageList");

module.exports = class TranslateMessageContextMenuCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Translate",
      type: "CONTEXT_MENU_MESSAGE",
      description: "🔖 Translate a message",
      examples: "Use right click -> `Applications` -> Translate",
      category: "Context-Menu",
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const message = options.getMessage("message");
    const fetchGuild = await this.client.getGuild(guild);
    const lang = fetchGuild.language;

    if (!message || message.content.length === 0)
      return interaction.editReply({
        content: await this.client.FastTranslate(
          "🚫 Unable to translate this message",
          lang
        ),
      });

    const translated = await this.client.Translate(message.content, lang);
    return await interaction.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .addFields(
            {
              name:
                `${
                  languageFlags[
                    translated.translations[0].detected_source_language.toLowerCase()
                  ]
                } ` +
                `${await this.client.FastTranslate("Original", lang)}` +
                ":",
              value: `${"```"}${message.content}${"```"}`,
            },
            {
              name:
                `${languageFlags[lang]} ` +
                `${await this.client.FastTranslate("Translation", lang)}` +
                ":",
              value: `${"```"}${translated.translations[0].text}${"```"}`,
            }
          )
          .setFooter({
            text: `Powered by DeepL.com`,
          }),
      ],
    });
  }
};
