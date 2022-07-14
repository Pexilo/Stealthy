const { Event } = require("sheweny");

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
    let autoRoleSystem = true;

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);

    if (logsChannel) {
      let warn = false;
      const blacklistMinAge = fetchGuild.blackList.minAge;
      const blacklistTime = fetchGuild.blackList.time;

      if (Date.now() - member.user.createdTimestamp < blacklistMinAge)
        warn = true;

      const EmbedInfo = this.client
        .Embed()
        .setAuthor({
          name: `${member.user.username} has joined the server!`,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
        })

        .setColor("#3ba55d")
        .setDescription(member.toString())
        .addFields({
          name: "📅 " + "Account created" + ":",
          value: `${this.client.Formatter(
            member.user.createdTimestamp
          )} - ${this.client.Formatter(
            member.user.createdTimestamp,
            "relative"
          )}`,
        })
        .setTimestamp()
        .setFooter({
          text: `${member.user.tag} - ${member.user.id}`,
        });

      if (warn) {
        member.timeout(blacklistTime);
        EmbedInfo.setTitle("Account temporarilly blacklisted")
          .setDescription(
            member.toString() + "\nUse `/unmute` to remove the restriction"
          )
          .setFields({
            name: "Reason" + ":",
            value:
              "Account younger than" +
              ":" +
              `\`${this.client.PrettyMs(blacklistMinAge, {
                verbose: true,
              })}\``,
          })
          .setThumbnail(
            "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/warning_26a0-fe0f.png"
          )
          .setColor("#ffcc4d");
      }
      await logsChannel.send({ embeds: [EmbedInfo] });
    }

    /*
     * Give roles to new users - Setup category - Auto role system
     */

    const autoRoles = fetchGuild.autoRole.roles;
    if (!autoRoles.length > 0) autoRoleSystem = false;

    if (autoRoleSystem) {
      autoRoles
        .slice()
        .reverse()
        .forEach((role) => {
          guild.roles.cache.find((r) => r.id === role);
          member.roles.add(role).catch((e) => {});
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
