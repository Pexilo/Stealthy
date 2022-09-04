const { Button } = require("sheweny");
const { deeplLanguages } = require("../../languages/deeplLanguages");

module.exports = class translateButtons extends Button {
  constructor(client) {
    super(client, [/translate_.*/]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { channel, customId } = button;

    // Get the language, message from the button id
    const lang = customId.split("_")[1];
    const message = await channel.messages.fetch(customId.split("_")[2]);

    // Translate the message
    const translated = await this.client.Translate(message.content, lang);

    return button.editReply({
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
                  deeplLanguages[
                    translated.translations[0].detected_source_language.toLowerCase()
                  ]
                } ` +
                `${await this.client.FastTranslate("Original", lang)}` +
                ":",
              value: `${"```"}${message.content}${"```"}`,
            },
            {
              name:
                `${deeplLanguages[lang]} ` +
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
