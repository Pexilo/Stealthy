const { Event } = require("sheweny");

module.exports = class messageReactionAddTracker extends Event {
  constructor(client) {
    super(client, "messageReactionAdd", {
      description: "Track reactions added to messages",
    });
  }
  async execute(messageReaction, user) {
    /*
     * Roleclaim added reaction tracker - add role to member if reaction is added
     */

    if (user.bot) return;
    const { guild } = messageReaction.message;

    const fetchGuild = await this.client.getGuild(guild);

    const msgID = fetchGuild.roleclaim_Msg;
    if (messageReaction.message.id !== msgID) return;

    const emoji = messageReaction._emoji.name;
    const customEmoji = await this.client.FindCustomEmoji(this.client, emoji);
    const emojiName = customEmoji
      ? customEmoji
      : this.client.GetEmojiNameFromUni(emoji);

    const roleID = fetchGuild.roleclaim_Fields.filter(
      (r) => r.emojiName == emojiName
    )[0].roleId;

    const role = guild.roles.cache.find((role) => role.id === roleID);
    const member = guild.members.cache.find((member) => member.id === user.id);

    member.roles.add(role).catch(() => {});
  }
};
