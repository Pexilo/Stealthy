const { Event } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

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

    //permissions check
    const me = await guild.members.fetchMe();
    if (
      !me.permissions.has(
        PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.SendMessages |
          PermissionFlagsBits.EmbedLinks
      )
    )
      return;

    if (!member || message.author.bot) return;
    if (
      (message.content.includes("discord.gg/") ||
        message.content.includes("discord.com/invite/")) &&
      !member.permissions.has("ManageMessages")
    ) {
      const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
      const { messageCreate } = this.client.la[lang].events.messages;

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
                  name: eval(messageCreate.embed1.author),
                  iconURL: member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(eval(messageCreate.embed1.description))
                .addFields({
                  name: messageCreate.embed1.field1.name,
                  value: messageCreate.embed1.field1.value,
                })
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
