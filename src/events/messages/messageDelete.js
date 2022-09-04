const { Event } = require("sheweny");

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

    if (member == null || message.author.bot || message.embeds.length > 0)
      return;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const {} = this.client.la[lang];
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("msgDelete")) {
      let embed = this.client
        .Embed()
        .setAuthor({
          name: `${message.author.username} message removed.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `Message from <@${member.id}> in <#${channel.id}>\n
              ${
                message.content.length !== 0
                  ? `\`\`\`${message.content}\`\`\``
                  : ""
              }`
        )
        .setColor("#8B0000")
        .setTimestamp()
        .setFooter({
          text: `${message.author.tag} - ${member.user.id}`,
        });

      if (message.attachments.size > 0) {
        embed.addFields({
          name: "Attachments",
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
