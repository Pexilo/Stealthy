const { Event } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class guildMemberAddTracker extends Event {
  constructor(client) {
    super(client, "guildMemberAdd", {
      description: "Logs new users and blacklist accounts created under 24h",
      once: false,
    });
  }

  async execute(member) {
    /*
     * Logs new users and blacklist accounts created under 24h - Admin category
     */
    const { guild } = member;

    //permissions check
    const me = await guild.members.fetchMe();
    if (
      !me.permissions.has(
        PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.SendMessages |
          PermissionFlagsBits.EmbedLinks |
          PermissionFlagsBits.ManageRoles |
          PermissionFlagsBits.Connect |
          PermissionFlagsBits.ManageChannels
      )
    )
      return;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { guildMemberAdd } = this.client.la[lang].events.guild;

    let autoRoleSystem = true;
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;
    const blacklistState =
      fetchGuild.moderationTools.enabled.includes("blacklist");

    if (logsChannel && enabledLogs.includes("joinLeave")) {
      let warn = false;
      const blacklistMinAge = fetchGuild.blackList.minAge;
      const blacklistTime = fetchGuild.blackList.time;

      if (Date.now() - member.user.createdTimestamp < blacklistMinAge)
        warn = true;

      const EmbedInfo = this.client
        .Embed()
        .setAuthor({
          name: eval(guildMemberAdd.embed1.author),
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })

        .setDescription(member.toString())
        .addFields({
          name: guildMemberAdd.embed1.field1,
          value: `${this.client.Formatter(
            member.user.createdTimestamp
          )} - ${this.client.Formatter(member.user.createdTimestamp, "R")}`,
        })
        .setColor("#3ba55d")
        .setTimestamp()
        .setFooter({
          text: `${member.user.tag} - ${member.user.id}`,
        });

      if (warn && blacklistState) {
        member.timeout(blacklistTime);
        EmbedInfo.setTitle(guildMemberAdd.embed1.title)
          .setDescription(rval(guildMemberAdd.embed1.description))
          .setFields({
            name: guildMemberAdd.embed1.field2.name,
            value: eval(guildMemberAdd.embed1.field2.value),
          })
          .setThumbnail(
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/warning_26a0-fe0f.png"
          )
          .setColor("#ffcc4d");
      }
      logsChannel.send({ embeds: [EmbedInfo] }).catch(() => undefined);
    }

    /*
     * Give roles to new users - Setup category - Auto role system
     */

    const autoRoles = fetchGuild.autoRole.roles;
    if (autoRoles.length === 0) autoRoleSystem = false;

    if (autoRoleSystem) {
      autoRoles
        .slice()
        .reverse()
        .forEach((role) => {
          guild.roles.cache.find((r) => r.id === role);
          member.roles.add(role).catch(() => undefined);
        });
    }

    /*
     * Member count channel - Setup category - Refresh count when a member joins
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
