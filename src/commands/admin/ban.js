const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      nameLocalizations: {},
      description: "🔪 Ban a member from the server.",
      descriptionLocalizations: {
        fr: "🔪 Bannir un membre du serveur.",
        de: "🔪 Banne einen Benutzer vom Server.",
        "es-ES": "🔪 Banear a un miembro del servidor.",
      },
      examples:
        "/ban `user:@Pexi` `days:3` => 🔪 Ban `@Pexi` from the server and delete the last `3 days` of messages",
      usage: "https://i.imgur.com/o0Dm3A6.png",
      category: "Admin",
      userPermissions: ["BanMembers"],
      clientPermissions: ["BanMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: {
            fr: "utilisateur",
            de: "benutzer",
            "es-ES": "usuario",
          },
          description: "👤 User to ban",
          descriptionLocalizations: {
            fr: "👤 Utilisateur à bannir",
            de: "👤 Benutzer zu verbannen",
            "es-ES": "👤 Usuario a banear",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "days",
          nameLocalizations: { fr: "jours", de: "tage", "es-ES": "días" },
          description: "❌ User messages to delete (in days)",
          descriptionLocalizations: {
            fr: "❌ Messages de l'utilisateur à supprimer (en jours)",
            de: "❌ Benutzer-Nachrichten, die gelöscht werden sollen (in Tagen)",
            "es-ES": "❌ Mensajes de usuario a eliminar (en días)",
          },
          required: true,
          min_value: 0,
          max_value: 7,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the ban",
          descriptionLocalizations: {
            fr: "❔ Raison du bannissement",
            de: "❔ Grund für den Ban",
            "es-ES": "❔ Razón del ban",
          },
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { ban } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);
    const deleteDays = options.getInteger("days");
    const reason = options.getString("reason");

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await member.ban({
        deleteMessageDays: deleteDays,
        reason: eval(ban.auditLog),
      });
    } catch (e) {
      return interaction.editReply(eval(errors.error2));
    }

    interaction.editReply(eval(ban.reply));

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(ban.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(ban.embed1.description))
            .addFields(
              {
                name: ban.embed1.field1.name,
                value: eval(ban.embed1.field1.value),
                inline: true,
              },
              {
                name: ban.embed1.field2.name,
                value: eval(ban.embed1.field2.value),
                inline: true,
              }
            )
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor("#b72a2a")
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
