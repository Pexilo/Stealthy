const { Button } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class warnListButton extends Button {
  constructor(client) {
    super(client, ["warns-list"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, message } = button;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { warnList } = this.client.la[lang].interactions.buttons;

    //permissions check
    const requiredPerms = ["ViewChannel", "EmbedLinks"];
    const me = await guild.members.fetchMe();
    if (
      !me.permissions.has(
        PermissionFlagsBits.ViewChannel | PermissionFlagsBits.EmbedLinks
      )
    )
      return button.editReply({
        content: eval(errors.error52),
      });

    // find if the button is on the logged embed or the replied message
    let res;
    if (message.embeds[0]) res = message.embeds[0].data.description;
    else res = message.content;
    // extract id from the response string
    let userId = res.match(/\d+/)[0];

    // find if the user matches the id of a logged one
    const filteredUser = fetchGuild.logs.users.filter((u) => u.id === userId);
    if (filteredUser.length === 0) return button.editReply(errors.error32);

    const member = guild.members.cache.get(userId);

    let warns = "";
    let i = filteredUser.length + 1;
    let s = 1;

    /* Reversing the array and then looping through it for better front listing
          show max 10 warns for space restrictions */
    filteredUser
      .slice()
      .reverse()
      .forEach((warn) => {
        i--;
        s++;
        if (s > 10) return;
        warns += `\n**${i}:** by <@${warn.moderator}> - ${this.client.Formatter(
          warn.date,
          "R"
        )}\n`;
        warns += eval(warnList.reason);
      });

    return button.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: eval(warnList.embed1.author),
            iconURL: member.user.avatarURL({ dynamic: true }),
          })
          .setDescription(warns)
          .setTimestamp()
          .setFooter({
            text: `${member.user.tag} - ${member.user.id}`,
          }),
      ],
    });
  }
};
