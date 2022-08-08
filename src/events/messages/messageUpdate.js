const { Event } = require("sheweny");

module.exports = class messageUpdateTracker extends Event {
  constructor(client) {
    super(client, "messageUpdate", {
      description: "Logs users when they modify their messages",
    });
  }

  async execute(oldMessage, newMessage) {
    /*
     * Logs users modify their messages - Admin category
     */
    const { guild, channel, member } = newMessage;
    if (newMessage.author.bot || newMessage.content == oldMessage.content)
      return;

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("msgEdit")) {
      const jumpTo =
        "https://discordapp.com/channels/" +
        guild.id +
        "/" +
        channel.id +
        "/" +
        newMessage.id;

      const embedInfo = this.client
        .Embed()
        .setAuthor({
          name: `${newMessage.author.username} edited a message.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`[Edited message](${jumpTo}) in ${channel.toString()}`)
        .addFields(
          {
            name: "Old message" + ":",
            value: `${"```"}${oldMessage.content}${"```"}`,
          },
          {
            name: "Modified message" + ":",
            value: `${"```"}${newMessage.content}${"```"}`,
          }
        )
        .setColor("#FFA500")
        .setTimestamp()
        .setFooter({
          text: `${newMessage.author.tag} - ${member.user.id}`,
        });

      logsChannel.send({ embeds: [embedInfo] }).catch(() => undefined);
    }
  }
};
