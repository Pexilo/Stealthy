const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      nameLocalizations: {},
      description: "👢 Kick a member from the server.",
      descriptionLocalizations: {
        fr: "👢 Expulser un membre du serveur.",
        de: "👢 Kicke einen Benutzer vom Server.",
        "es-ES": "👢 Expulsar a un miembro del servidor.",
      },
      examples: "/kick `user:@Pexi` => 👢 Kick `@Pexi` from the server",
      usage: "https://i.imgur.com/b2t76SZ.png",
      category: "Admin",
      userPermissions: ["KickMembers"],
      clientPermissions: ["ViewChannel", "KickMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: {
            fr: "utilisateur",
            de: "benutzer",
            "es-ES": "usuario",
          },
          description: "👤 User to kick",
          descriptionLocalizations: {
            fr: "👤 Utilisateur à expulser",
            de: "👤 Benutzer zum kicken",
            "es-ES": "👤 Usuario a expulsar",
          },
          required: true,
        },

        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the kick",
          descriptionLocalizations: {
            fr: "❔ Raison de l'expulsion",
            de: "❔ Grund für den kick",
            "es-ES": "❔ Razón de la expulsión",
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
    const { kick } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);
    const reason = options.getString("reason");

    try {
      await member.kick(eval(kick.auditlog));
    } catch (e) {
      return interaction.editReply(errors.error3);
    }
    interaction.editReply(eval(kick.reply));

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;
    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    //permissions check
    if (
      !logsChannel
        .permissionsFor(guild.me)
        .has(PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks)
    )
      return interaction.editReply(errors.error53);
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(kick.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(kick.embed1.description))
            .addFields({
              name: kick.embed1.field1.name,
              value: eval(kick.embed1.field1.value),
            })
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor("#c97628")
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
