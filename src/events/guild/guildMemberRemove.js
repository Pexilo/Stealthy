const { Event } = require("sheweny");

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
    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const {} = this.client.la[lang];
    if (!fetchGuild) return;

    let logsChannel = null;
    try {
      logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    } catch (e) {}
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("joinLeave")) {
      const searchRoles = member.roles.cache
        .filter((r) => r.id !== guild.id)
        .map((r) => r.toString())
        .join(", ");

      const embedInfo = this.client
        .Embed()
        .setAuthor({
          name: `${member.user.username} has left the server.`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(member.toString())

        .setColor("#8B0000")
        .setTimestamp()
        .setFooter({
          text: `${member.user.tag} - ${member.user.id}`,
        });

      if (searchRoles) {
        embedInfo.addFields({
          name: "🧮 " + "Roles" + ":",
          value: searchRoles,
        });
      }

      if (member.joinedTimestamp) {
        embedInfo.addFields({
          name: "📥 " + "Joined the server" + ":",
          value: `${this.client.Formatter(
            member.joinedTimestamp
          )} - ${this.client.Formatter(member.joinedTimestamp, "R")}`,
        });
      }

      logsChannel.send({ embeds: [embedInfo] }).catch(() => undefined);
    }

    /*
     * Member count channel - Setup category - Refresh count when a member leaves
     */

    if (fetchGuild.memberCount.channel) {
      this.client.UpdateMemberCount(
        guild,
        fetchGuild.memberCount.channel,
        fetchGuild.memberCount.name
      );
    }
  }
};
