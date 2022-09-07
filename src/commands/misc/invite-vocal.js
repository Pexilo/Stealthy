const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class InviteVocalCommand extends Command {
  constructor(client) {
    super(client, {
      name: "invite-vc",
      nameLocalizations: {},
      description: "📨 Invite someone to your vocal channel.",
      descriptionLocalizations: {
        fr: "📨 Inviter un membre dans votre salon vocal.",
        de: "📨 Lade jemanden in deinen Sprachkanal ein.",
        "es-ES": "📨 Invita a alguien a tu canal de voz.",
      },
      examples:
        "/invite-vc `member:@Pexilo` => 📨 Invite (DM) `@Pexilo` to your voice channel",
      usage: "https://i.imgur.com/5NjZuQp.png",
      category: "Misc",
      clientPermissions: ["ViewChannel", "SendMessages", "EmbedLinks"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "member",
          nameLocalizations: {
            fr: "membre",
            de: "mitglied",
            "es-ES": "miembro",
          },
          description: "💡 Member to invite",
          descriptionLocalizations: {
            fr: "💡 Le membre à inviter",
            de: "💡 Mitglied, das eingeladen werden soll",
            "es-ES": "💡 Miembro a invitar",
          },
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

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { inviteVocal } = this.client.la[lang].commands.misc;

    const voiceChannel = member.voice.channel;

    // Check if the user is in a voice channel (voiceChannel is null if the user isn't)
    if (!voiceChannel) return interaction.editReply(errors.error37);

    const targetMember = options.getMember("member");

    // Try to send the DM
    targetMember
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: inviteVocal.embed1.author,
              iconURL: member.user.avatarURL({ dynamic: true }),
            })
            .setDescription(eval(inviteVocal.embed1.description))
            .setFooter({
              text: guild.name,
              iconURL: guild.iconURL({ dynamic: true }),
            }),
        ],
      })
      // If the DM can't be sent, return an error with advice to fix the issue
      .catch(() => {
        return interaction.editReply(eval(errors.error38));
      });

    interaction.editReply(eval(inviteVocal.reply));
  }
};
