const { Event } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

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

    if (user.bot || user == null) return;
    const { guild } = messageReaction.message;

    //permissions check
    const me = await guild.members.fetchMe().catch(() => undefined);
    if (!me) return;
    if (
      !me.permissions.has(
        PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.UseExternalEmojis |
          PermissionFlagsBits.ManageRoles
      )
    )
      return;

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

    member.roles.add(role).catch(() => undefined);
  }
};
