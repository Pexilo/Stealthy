const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      nameLocalizations: {},
      description: "🔇 Mute a member",
      descriptionLocalizations: {
        fr: "🔇 Rendre muet un membre",
        de: "🔇 Stummschalten eines Mitglieds",
        "es-ES": "🔇 Silenciar a un miembro",
      },
      examples:
        "/mute `member:@Pexi` `format:minutes` `duration:5` => 🔇 Mute `@Pexi` for `5` `minutes`",
      usage: "https://i.imgur.com/u0TBXu4.png",
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
          description: "👤 User to mute",
          descriptionLocalizations: {
            fr: "👤 Utilisateur à rendre muet",
            de: "👤 Benutzer zum Stummschalten",
            "es-ES": "👤 Usuario a silenciar",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "format",

          description: "🕒 Format to use",
          descriptionLocalizations: {
            fr: "🕒 Format à utiliser",
            de: "🕒 Format zu verwenden",
            "es-ES": "🕒 Formato a usar",
          },
          required: true,
          choices: [
            {
              name: "🕒 Minutes",
              nameLocalizations: {
                fr: "🕒 Minutes",
                de: "🕒 Minuten",
                "es-ES": "🕒 Minutos",
              },
              value: "minutes",
            },
            {
              name: "🕒 Hours",
              nameLocalizations: {
                fr: "🕒 Heures",
                de: "🕒 Stunden",
                "es-ES": "🕒 Horas",
              },
              value: "hours",
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "duration",
          nameLocalizations: { fr: "durée", de: "dauer", "es-ES": "duración" },
          description: "⏱️ Time to mute",
          descriptionLocalizations: {
            fr: "⏱️ Temps à rendre muet",
            de: "⏱️ Zeit zum Stummschalten",
            "es-ES": "⏱️ Tiempo para silenciar",
          },
          required: true,
          minValue: 1,
          maxValue: 670,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the mute",
          descriptionLocalizations: {
            fr: "❔ Raison du mute",
            de: "❔ Grund für das Stummschalten",
            "es-ES": "❔ Razón del silencio",
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
    const { mute } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);
    if (member.permissions.has("ManageGuild"))
      return interaction.editReply(errors.error7);

    const format = options.getString("format");
    const duration =
      format === "minutes"
        ? options.getInteger("duration") * 60000
        : options.getInteger("duration") * 3600000;
    const reason = options.getString("reason");

    try {
      member.timeout(duration, eval(mute.auditlog));
    } catch (e) {
      return interaction.editReply(eval(errors.error8));
    }

    interaction.editReply({
      content: eval(mute.reply),
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
              name: eval(mute.embed1.author),
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setDescription(eval(mute.embed1.description))
            .setFields(
              {
                name: mute.embed1.field1,
                value: `\`${this.client.PrettyMs(duration, {
                  verbose: true,
                })}\``,
                inline: true,
              },
              {
                name: mute.embed1.field2.name,
                value: eval(mute.embed1.field2.value),
                inline: true,
              }
            )
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
