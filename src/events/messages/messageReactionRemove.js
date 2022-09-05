const { Event } = require("sheweny");

module.exports = class messageReactionRemoveTracker extends Event {
  constructor(client) {
    super(client, "messageReactionRemove", {
      description: "Track reactions removed to messages",
    });
  }
  async execute(messageReaction, user) {
    /*
     * Roleclaim removed reaction tracker - remove role from member if reaction is removed
     */
    if (user.bot) return;
    const { guild } = messageReaction.message;

    const fetchGuild = await this.client.GetGuild(guild);

    const msgId = fetchGuild.roleClaim.message;
    if (messageReaction.message.id !== msgId) return;

    const emoji = messageReaction._emoji.name;
    const customEmoji = await this.client.FindCustomEmoji(emoji);
    const emojiName = customEmoji
      ? customEmoji
      : this.client.GetEmojiNameFromUni(emoji);

    const roleId = fetchGuild.roleClaim.fields.filter(
      (r) => r.emojiName == emojiName
    )[0].roleId;

    const role = guild.roles.cache.find((r) => r.id === roleId);
    const member = guild.members.cache.find((m) => m.id === user.id);

    member.roles.remove(role).catch(() => undefined);
  }
};
