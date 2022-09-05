const { Button } = require("sheweny");

module.exports = class ClearConfirmButton extends Button {
  constructor(client) {
    super(client, ["confirm-clear"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, message, channel } = button;

    let replied = false;
    const number = message.content.match(/\d+/)[0];
    channel.bulkDelete(number).catch(() => {
      replied = true;
      return button.editReply(errors.error41);
    });
    await this.client.Wait(2000);
    if (replied) return;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { clearConfirm } = this.client.la[lang].interactions.buttons;

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    button.editReply({
      content: eval(clearConfirm.reply),
    });

    if (!logsChannel || !enabledLogs.includes("channels")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(clearConfirm.embed1.author),
              iconURL: button.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(clearConfirm.embed1.description))
            .setTimestamp()
            .setColor("#ffbe3f")
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/broom_1f9f9.png"
            ),
        ],
      })
      .catch(() => undefined);
  }
};
