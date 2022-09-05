const { Modal } = require("sheweny");

module.exports = class roleClaimEmbedModal extends Modal {
  constructor(client) {
    super(client, ["edit-roleclaim"]);
  }

  async execute(modal) {
    const { guild } = modal;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { roleclaimEmbed } = this.client.la[lang].interactions.modals;

    const msgId = fetchGuild.roleClaim.message;
    const channelId = fetchGuild.roleClaim.channel;

    let foundChannel, msg;

    try {
      foundChannel = guild.channels.cache.get(channelId);
      msg = await foundChannel.messages.fetch(msgId);
    } catch (e) {
      return modal.reply({
        content: errors.error11,
        ephemeral: true,
      });
    }

    let rolesEmbed = this.client
      .Embed(false)
      .setTitle(msg.embeds[0].title)
      .setDescription(msg.embeds[0].description)
      .setFields(msg.embeds[0].fields)
      .setFooter({ text: msg.embeds[0].footer.text })
      .setColor(msg.embeds[0].color);

    //get all fields
    const title = modal.fields.getTextInputValue("roleclaim-title-input");
    const description = modal.fields.getTextInputValue(
      "roleclaim-description-input"
    );
    const footer = modal.fields.getTextInputValue("roleclaim-footer-input");
    const color = modal.fields.getTextInputValue("roleclaim-color-input");

    if (title) rolesEmbed.setTitle(title);
    if (description) rolesEmbed.setDescription(description);
    if (footer) rolesEmbed.setFooter({ text: footer });
    if (color) {
      try {
        rolesEmbed.setColor(color);
      } catch (e) {
        return modal.reply({
          content: eval(errors.error50),
          ephemeral: true,
        });
      }
    }

    if (!title && !description && !footer && !color)
      return modal.reply({
        content: errors.error48,
        ephemeral: true,
      });

    await msg.edit({
      embeds: [rolesEmbed],
    });

    await modal.reply({
      content: roleclaimEmbed.reply,
      ephemeral: true,
    });
  }
};
