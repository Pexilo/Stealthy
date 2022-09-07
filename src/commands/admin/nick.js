const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: "nick",
      nameLocalizations: {},
      description: "✍️ Change the nickname of a user.",
      descriptionLocalizations: {
        fr: "✍️ Change le pseudo d'un utilisateur.",
        de: "✍️ Ändere den Spitznamen eines Benutzers.",
        "es-ES": "✍️ Cambia el apodo de un usuario.",
      },
      examples:
        "/nick `user:@Pexi` `nickname:Pexilo` => ✍️ Change the nickname of `@Pexi` to `Pexilo`",
      usage: "https://i.imgur.com/lZSnzz8.png",
      category: "Admin",
      userPermissions: ["ManageNicknames"],
      clientPermissions: ["ViewChannel", "ManageNicknames"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: {
            fr: "utilisateur",
            de: "benutzer",
            "es-ES": "usuario",
          },
          description: "👤 User to change the nickname of",
          descriptionLocalizations: {
            fr: "👤 Utilisateur dont vous voulez changer le pseudo",
            de: "👤 Benutzer, dessen Spitzname geändert werden soll",
            "es-ES": "👤 Usuario cuyo apodo desea cambiar",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "nickname",
          nameLocalizations: {
            fr: "pseudo",
            de: "spitzname",
            "es-ES": "apodo",
          },
          description: "✏️ New nickname",
          descriptionLocalizations: {
            fr: "✏️ Nouveau pseudo",
            de: "✏️ Neuer Spitzname",
            "es-ES": "✏️ Nuevo apodo",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for changing the nickname",
          descriptionLocalizations: {
            fr: "❔ Raison du changement de pseudo",
            de: "❔ Grund für die Änderung des Spitznamens",
            "es-ES": "❔ Razón para cambiar el apodo",
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
    const { nick } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);
    const nickname = options.getString("nickname");
    const reason = options.getString("reason");

    try {
      await member.setNickname(nickname, eval(nick.auditlog));
    } catch (e) {
      return interaction.editReply(errors.error9);
    }

    interaction.editReply(eval(nick.reply));

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
              name: eval(nick.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(nick.embed1.description))
            .addFields(
              {
                name: nick.embed1.field1,
                value: `\`${nickname}\``,
                inline: true,
              },
              {
                name: nick.embed1.field2.name,
                value: eval(nick.embed1.field2.value),
                inline: true,
              }
            )
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
