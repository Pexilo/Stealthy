const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class UnMuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      nameLocalizations: { fr: "demute" },
      description: "🔊 Unmute a member.",
      descriptionLocalizations: {
        fr: "🔊 Demute un membre.",
        de: "🔊 Entmute einen Benutzer.",
        "es-ES": "🔊 Desmutear a un miembro.",
      },
      examples: "/unmute `member:@Pexi` => 🔉 Unmute `@Pexi`",
      usage: "https://i.imgur.com/Kq0yZWX.png",
      category: "Admin",
      userPermissions: ["ModerateMembers"],
      clientPermissions: ["ViewChannel", "ModerateMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: {
            fr: "utilisateur",
            de: "benutzer",
            "es-ES": "usuario",
          },
          description: "👤 Member to unmute",
          descriptionLocalizations: {
            fr: "👤 Membre à demuter",
            de: "👤 Benutzer zum entmuten",
            "es-ES": "👤 Miembro a desmutear",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the unmute",
          descriptionLocalizations: {
            fr: "❔ Raison du demute",
            de: "❔ Grund für das Entmuten",
            "es-ES": "❔ Razón del desmute",
          },
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { unmute } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);
    const reason = options.getString("reason");

    // Check if the member is already muted
    if (!member.isCommunicationDisabled()) {
      return interaction.editReply(eval(unmute.reply1));
    }

    try {
      member.timeout(null, eval(unmute.auditlog));
    } catch (e) {
      return interaction.editReply(eval(errors.error31));
    }
    interaction.editReply({
      content: eval(unmute.reply2),
    });

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;
    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    await this.client.LogsChannelPermsCheck(guild, interaction, errors);

    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(unmute.embed1.author),
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setDescription(eval(unmute.embed1.description))
            .setFields({
              name: unmute.embed1.field1.name,
              value: eval(unmute.embed1.field1.value),
            })
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("#c97628")

            .setFooter({
              text: `${member.user.tag} - ${member.user.id}`,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
