const { Event } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class messageDeleteTracker extends Event {
  constructor(client) {
    super(client, "messageDelete", {
      description: "Track messages deleted and log them",
    });
  }

  async execute(message) {
    /*
     * Deleted messages tracker - logs deleted messages - Admin category
     */

    const { guild, channel, member } = message;

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

    if (member == null || message.author.bot || message.embeds.length > 0)
      return;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { messageDelete } = this.client.la[lang].events.messages;

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("msgDelete")) {
      const content = message.content.replace(/`/g, "");

      let embed = this.client
        .Embed()
        .setAuthor({
          name: eval(messageDelete.embed1.author),
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(eval(messageDelete.embed1.description))
        .setColor("#8B0000")
        .setTimestamp()
        .setFooter({
          text: `${message.author.tag} - ${member.user.id}`,
        });

      if (content.length > 0) {
        embed.addFields({
          name: messageDelete.embed1.field1,
          value: `\`${message.content.replace(/`/g, "")}\``,
        });
      }

      if (message.attachments.size > 0) {
        embed.addFields({
          name: messageDelete.embed1.field2,
          value: message.attachments
            .map((attachment) => {
              return `[${attachment.name}](${attachment.url})`;
            })
            .join("\n"),
        });
      }

      return logsChannel
        .send({
          embeds: [embed],
        })
        .catch(() => undefined);
    }
  }
};
