const { Event } = require("sheweny");
const { Permissions } = require("discord.js");

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

    if (!member) return;
    const fetchGuild = await this.client.getGuild(guild);

    if (
      (message.content.includes("discord.gg/") ||
        message.content.includes("discord.com/invite/")) &&
      (!message.author.bot ||
        !channel.type === "dm" ||
        !member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
    ) {
      const logsChannel = this.client.channels.cache.get(
        fetchGuild.logs.channel
      );
      if (logsChannel) {
        message.delete();

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
          .catch(() => {});
      }
    }
  }
};
