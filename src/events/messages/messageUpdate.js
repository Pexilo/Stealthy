const { Event } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

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

    //permissions check
    const me = await guild.members.fetchMe().catch(() => undefined);
    if (!me) return;
    if (
      !me.permissions.has(
        PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.SendMessages |
          PermissionFlagsBits.EmbedLinks
      )
    )
      return;

    if (newMessage.author.bot || newMessage.content == oldMessage.content)
      return;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { messageUpdate } = this.client.la[lang].events.messages;

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("msgEdit")) {
      if (newMessage.content.length === 0) return;
      const newContent = newMessage.content.replace(/`/g, "");

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
            name: messageUpdate.embed1.field1,
            value: `\`${
              oldMessage.content ? oldMessage.content.replace(/`/g, "") : ""
            }\``,
          },
          {
            name: messageUpdate.embed1.field2,
            value: `\`${newContent}\``,
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
