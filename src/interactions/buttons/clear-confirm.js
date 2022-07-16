const { Button } = require("sheweny");

module.exports = class ClearConfirmButton extends Button {
  constructor(client) {
    super(client, ["confirm-clear"]);
  }
  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, message, channel } = button;

    switch (button.customId) {
      case "confirm-clear":
        const number = message.content.match(/\d+/)[0];
        channel.bulkDelete(number).catch(() => {
          return button.editReply(
            `🚫 You can't purge messages that are older than 14 days.`
          );
        });

        const fetchGuild = await this.client.getGuild(guild);
        const logsChannel = this.client.channels.cache.get(
          fetchGuild.logs.channel
        );

        button.editReply({
          content: "⛑️ " + `\`${number}\`` + " messages have been cleared",
        });

        if (!logsChannel) return;
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
          .catch(() => {});
    }
  }
};
