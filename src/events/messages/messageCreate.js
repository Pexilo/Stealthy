const { Event } = require("sheweny");

module.exports = class messageCreateTracker extends Event {
  constructor(client) {
    super(client, "messageCreate", {
      description: "Track invites and delete them",
    });
  }

  async execute(message) {
    /*
     * Message invite links tracker - logs deleted links messages - Admin category
     */

    const { guild, channel, member } = message;

    if (!member || message.author.bot) return;
    if (
      (message.content.includes("discord.gg/") ||
        message.content.includes("discord.com/invite/")) &&
      !member.permissions.has("ManageMessages")
    ) {
      const fetchGuild = await this.client.getGuild(guild);
      const delDcInvitesState =
        fetchGuild.moderationTools.enabled.includes("delDcInvites");
      if (!delDcInvitesState) return;

      message.delete();

      const logsChannel = this.client.channels.cache.get(
        fetchGuild.logs.channel
      );
      const enabledLogs = fetchGuild.logs.enabled;

      if (logsChannel && enabledLogs.includes("moderation")) {
        return logsChannel
          .send({
            embeds: [
              this.client
                .Embed()
                .setAuthor({
                  name: `${message.author.username} has sent an invite link.`,
                  iconURL: member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `Message sent by <@${member.id}> deleted in <#${channel.id}>`
                )
                .addFields(
                  {
                    name: "\u200B",
                    value: `${"```"}${message.content}${"```"}`,
                  },
                  {
                    name: "Reason" + ":",
                    value: "Invite link",
                  }
                )
                .setColor("#ffcc4d")
                .setThumbnail(
                  "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/warning_26a0-fe0f.png"
                )
                .setTimestamp()
                .setFooter({
                  text: `${message.author.tag} - ${member.user.id}`,
                }),
            ],
          })
          .catch(() => undefined);
      }
    }
  }
};
