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

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { messageUpdate } = this.client.la[lang].events.messages;

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
          name: eval(messageUpdate.embed1.author),
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(eval(messageUpdate.embed1.description))
        .addFields(
          {
            name: messageUpdate.embed1.field1.name,
            value: eval(messageUpdate.embed1.field1.value),
          },
          {
            name: messageUpdate.embed1.field2.name,
            value: eval(messageUpdate.embed1.field2.value),
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
