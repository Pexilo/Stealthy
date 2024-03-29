const { Button } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class ClearConfirmButton extends Button {
  constructor(client) {
    super(client, ["confirm-clear"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, message, channel } = button;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { clearConfirm } = this.client.la[lang].interactions.buttons;

    // get the amount of messages to delete from the message content
    const number = message.content.match(/\d+/)[0];

    // realNb will be the real number of messages to delete
    let realNb,
      err41 = false; // if the messages are older than 14 days
    await channel
      .bulkDelete(number)
      .then((nb) => (realNb = nb.size))
      .catch((e) => {
        err41 = true;
        return button.editReply(errors.error41);
      });
    if (err41) return;

    // wait for deletes to be done
    await this.client.Wait(2000);

    button.editReply({
      content: eval(clearConfirm.reply),
    });

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;
    if (!logsChannel || !enabledLogs.includes("channels")) return;
    await this.client.LogsChannelPermsCheck(guild, button, errors);

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
