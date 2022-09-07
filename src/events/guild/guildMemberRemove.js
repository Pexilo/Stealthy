const { Event } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class guildMemberRemoveTracker extends Event {
  constructor(client) {
    super(client, "guildMemberRemove", {
      description: "Logs users who leave the server",
    });
  }

  async execute(member) {
    const { guild } = member;

    //permissions check
    const me = await guild.members.fetchMe();
    if (
      !me.permissions.has(
        PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.SendMessages |
          PermissionFlagsBits.EmbedLinks |
          PermissionFlagsBits.ManageChannels |
          PermissionFlagsBits.Connect
      )
    )
      return;

    /*
     * Logs users who leave the server - Admin category
     */
    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    if (!fetchGuild) return;
    const { guildMemberRemove } = this.client.la[lang].events.guild;

    let logsChannel = null;
    try {
      logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    } catch (e) {}
    const enabledLogs = fetchGuild.logs.enabled;

    if (logsChannel && enabledLogs.includes("joinLeave")) {
      let roles = member.roles.cache
        .reverse()
        .filter((r) => r.id !== member.guild.id)
        .map((r) => r);

      if (roles.length > 3) {
        roles.splice(3);
        roles.push("...");
      }

      const embedInfo = this.client
        .Embed()
        .setAuthor({
          name: eval(guildMemberRemove.embed1.author),
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(member.toString())

        .setColor("#8B0000")
        .setTimestamp()
        .setFooter({
          text: `${member.user.tag} - ${member.user.id}`,
        });

      if (member.joinedTimestamp) {
        embedInfo.addFields({
          name: guildMemberRemove.embed1.field2,
          value: `${this.client.Formatter(
            member.joinedTimestamp
          )} - ${this.client.Formatter(member.joinedTimestamp, "R")}`,
        });
      }

      if (roles.length > 0) {
        embedInfo.addFields({
          name: guildMemberRemove.embed1.field1,
          value: roles.map((r) => r.toString()).join(", "),
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
