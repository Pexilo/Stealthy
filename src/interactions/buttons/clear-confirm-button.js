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
      return button.editReply(
        `\`🚫\` You can't purge messages that are older than 14 days.`
      );
    });
    await this.client.Wait(2000);
    if (replied) return;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const {} = this.client.la[lang];
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    button.editReply({
      content: "⛑️ " + `\`${number}\`` + " messages have been cleared",
    });

    if (!logsChannel || !enabledLogs.includes("channels")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: `by ${button.user.tag}`,
              iconURL: button.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(
              `\`${number}\`` +
                " messages have been cleared in " +
                channel.toString()
            )
            .setTimestamp()
            .setColor("#ea596e")
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/rescue-workers-helmet_26d1-fe0f.png"
            ),
        ],
      })
      .catch(() => undefined);
  }
};
