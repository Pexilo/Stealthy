const { Button } = require("sheweny");
const { deeplLanguages } = require("../../languages/deeplLanguages");

module.exports = class translateButtons extends Button {
  constructor(client) {
    super(client, [/translate_.*/]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, channel, customId } = button;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { translate } = this.client.la[lang].interactions.buttons;

    // Get the language, message from the button id
    const targetlang = customId.split("_")[1];
    const message = await channel.messages.fetch(customId.split("_")[2]);

    // Translate the message
    const translated = await this.client.Translate(
      message.content.replace(/`/g, ""),
      targetlang
    );

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
                translate.embed1.field1 +
                ":",
              value: `${"```"}${message.content.replace(/`/g, "")}${"```"}`,
            },
            {
              name:
                `${deeplLanguages[targetlang]} ` +
                translate.embed1.field2 +
                ":",
              value: `${"```"}${translated.translations[0].text}${"```"}`,
            }
          )
          .setFooter({
            text: translate.embed1.footer,
          }),
      ],
    });
  }
};
