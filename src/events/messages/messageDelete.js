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
    if (message.content == null || member == null) return;

    if (
      message.author.bot ||
      channel.type === "dm" ||
      message.embeds.length > 0
    )
      return;

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("msgDelete")) {
      return logsChannel
        .send({
          embeds: [
            this.client
              .Embed()
              .setAuthor({
                name: `${message.author.username} message removed.`,
                iconURL: member.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `Message from <@${member.id}> in <#${channel.id}>\n
              ${"```"}${message.content}${"```"}`
              )
              .setColor("#8B0000")
              .setTimestamp()
              .setFooter({
                text: `${message.author.tag} - ${member.user.id}`,
              }),
          ],
        })
        .catch(() => {});
    }
  }
};
