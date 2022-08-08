const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class InviteVocalCommand extends Command {
  constructor(client) {
    super(client, {
      name: "invite-vc",
      type: "SLASH_COMMAND",
      description: "💌 Invite someone to your vocal channel",
      examples:
        "/invite-vc `member:@Pexilo#0001` => 📧 DM an invitation to connect in your voice channel",
      category: "Misc",
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "member",
          description: "💡 The user to invite",
          required: true,
        },
      ],
    });
  }
  async execute(interaction) {
    /*
     * Types of errors that can occur:
     * - The user is not in a voice channel
     * - The recipient have direct messages disabled
     * - The recipient have blocked the bot
     */

    if (!(await this.client.Defer(interaction))) return;
    const { options, member, guild } = interaction;
    const voiceChannel = member.voice.channel;

    // Check if the user is in a voice channel (voiceChannel is null if the user isn't)
    if (!voiceChannel)
      return interaction.editReply("`🚫` You are not in a voice channel");

    const targetMember = options.getMember("member");

    // Try to send the DM
    targetMember
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: "Invitation received",
              iconURL: member.user.avatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member} has invited you to <#${voiceChannel.id}>\n
              *💡Click the channel name to join*`
            )
            .setFooter({
              text: guild.name,
              iconURL: guild.iconURL({ dynamic: true }),
            }),
        ],
      })
      // If the DM can't be sent, return an error with advice to fix the issue
      .catch(() => {
        return interaction.editReply(
          `\`🚫\` Can not send message to ${targetMember.toString()}
          > 1. The user don't accept direct messages,
          > 2. The user is not in the same server as the bot,
          > 3. The user as blocked the bot.`
        );
      });

    interaction.editReply(`💌 Invite sent to ${targetMember.toString()}`);
  }
};
