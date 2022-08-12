const { Button } = require("sheweny");

module.exports = class warnListButton extends Button {
  constructor(client) {
    super(client, ["warns-list"]);
  }

  async execute(button) {
    if (!(await this.client.Defer(button))) return;
    const { guild, message } = button;

    const fetchGuild = await this.client.getGuild(guild);

    // find if the button is on the logged embed or the replied message
    let res;
    if (message.embeds[0]) res = message.embeds[0].data.description;
    else res = message.content;
    // extract id from the response string
    let userId = res.match(/\d+/)[0];

    // find if the user matches the id of a logged one
    const filteredUser = fetchGuild.logs.users.filter((u) => u.id === userId);
    if (filteredUser.length === 0)
      return button.editReply(`\`🚫\` This user has no warns.`);

    const member = guild.members.cache.get(userId);

    let warnList = "";
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
        warnList += `\n**${i}:** by <@${
          warn.moderator
        }> - ${this.client.Formatter(warn.date, "R")}\n`;
        warnList += `Reason: \`${warn.reason}\`\n`;
      });

    return button.editReply({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: `${member.user.tag} warns 🔨`,
            iconURL: member.user.avatarURL({ dynamic: true }),
          })
          .setDescription(warnList)
          .setTimestamp()
          .setFooter({
            text: `${member.user.tag} - ${member.user.id}`,
          }),
      ],
    });
  }
};
