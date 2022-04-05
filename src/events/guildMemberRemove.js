const { Event } = require("sheweny");
const { Formatters } = require("discord.js");

module.exports = class guildMemberRemoveTracker extends Event {
  constructor(client) {
    super(client, "guildMemberRemove", {
      description: "Logs users who leave the server",
    });
  }

  async execute(member) {
    const { guild } = member;
    /*
     * Logs users who leave the server - Admin category
     */
    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs_Cnl);

    if (logsChannel) {
      const accountAge = member.joinedTimestamp;
      const searchRoles = member.roles.cache
        .filter((r) => r.id !== guild.id)
        .map((r) => r.toString())
        .join(", ");

      //TODO: AUDIT LOGS

      // const fetchKickLog = await guild.fetchAuditLogs({
      //   limit: 100,
      //   user: member.user,
      //   type: "MEMBER_KICK",
      // });

      // const kickLog = fetchKickLog.entries;
      // return console.log(kickLog);
      // kickLog.forEach((element) => {
      //   if (element.target.id === member.id) {
      //     console.log(element);
      //   }
      // });
      // //MARCHE PAS AVEC PRUNEUH
      // const { target, reason } = kickLog;

      // if (target.id === member.id) console.log("kicked", reason);

      // return;

      const embedInfo = this.client
        .Embed()
        .setAuthor({
          name: `${member.user.username} has left the server.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(member.toString())
        .addFields({
          name: "📅 " + "Active since" + ":",
          value: this.client.Formatter(
            accountAge,
            Formatters.TimestampStyles.RelativeTime
          ),
        })
        .setColor("#8B0000")
        .setTimestamp()
        .setFooter({
          text: `${member.user.tag} - ${member.user.id}`,
        });

      if (searchRoles)
        embedInfo.addFields({
          name: "🧮 " + "Roles" + ":",
          value: searchRoles,
        });

      logsChannel.send({ embeds: [embedInfo] });
    }

    /*
     * Member count channel - Setup category - Refresh count when a member leaves
     */

    if (fetchGuild.membercount_Cnl) {
      this.client.UpdateMemberCount(guild, fetchGuild.membercount_Cnl);
    }
  }
};
