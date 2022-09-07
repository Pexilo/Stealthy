const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warn",
      nameLocalizations: {},
      description: "🔨 Warn a user.",
      descriptionLocalizations: {
        fr: "🔨 Avertir un utilisateur.",
        de: "🔨 Warne einen Benutzer.",
        "es-ES": "🔨 Avisar a un usuario.",
      },
      examples:
        "/warn add `member:@Pexi` `reason:a reason` => 🔨 Warn `@Pexi` for `a reason`",
      usage: "https://i.imgur.com/CjV2LF0.png",
      category: "Admin",
      userPermissions: ["ModerateMembers"],
      clientPermissions: ["ViewChannel"],
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "add",
          nameLocalizations: {
            fr: "ajouter",
            de: "hinzufügen",
            "es-ES": "añadir",
          },
          description: "🔨 Warn a user",
          descriptionLocalizations: {
            fr: "🔨 Avertir un utilisateur",
            de: "🔨 Warne einen Benutzer",
            "es-ES": "🔨 Avisar a un usuario",
          },
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: "user",
              nameLocalizations: {
                fr: "utilisateur",
                de: "benutzer",
                "es-ES": "usuario",
              },
              description: "👤 User to warn",
              descriptionLocalizations: {
                fr: "👤 Utilisateur à avertir",
                de: "👤 Benutzer zu warnen",
                "es-ES": "👤 Usuario a avisar",
              },
              required: true,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "reason",
              nameLocalizations: {
                fr: "raison",
                de: "grund",
                "es-ES": "razón",
              },
              description: "❔ Reason for the warn",
              descriptionLocalizations: {
                fr: "❔ Raison de l'avertissement",
                de: "❔ Grund für die Warnung",
                "es-ES": "❔ Razón de la advertencia",
              },
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "remove",
          nameLocalizations: {
            fr: "retirer",
            de: "entfernen",
            "es-ES": "retirar",
          },
          description: "🔨 Remove a warn from a user",
          descriptionLocalizations: {
            fr: "🔨 Retirer un avertissement d'un utilisateur",
            de: "🔨 Entferne eine Warnung von einem Benutzer",
            "es-ES": "🔨 Eliminar una advertencia de un usuario",
          },
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: "user",
              nameLocalizations: {
                fr: "utilisateur",
                de: "benutzer",
                "es-ES": "usuario",
              },
              description: "👤 User for whom to remove the warning",
              descriptionLocalizations: {
                fr: "👤 l'utilisateur pour lequel retirer l'avertissement",
                de: "👤 Benutzer, für den die Warnung entfernt werden soll",
                "es-ES": "👤 Usuario para el que se eliminará la advertencia",
              },
              required: true,
            },
            {
              type: ApplicationCommandOptionType.Integer,
              name: "number",
              nameLocalizations: {
                fr: "numéro",
                de: "nummer",
                "es-ES": "número",
              },
              description:
                "🔢 The index of the warn to remove (see /warn list)",
              descriptionLocalizations: {
                fr: "🔢 L'index de l'avertissement à retirer (voir /warn liste)",
                de: "🔢 Der Index der Warnung, die entfernt werden soll (siehe /warn liste)",
                "es-ES":
                  "🔢 El índice de la advertencia a eliminar (ver /warn lista)",
              },
              required: true,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "reason",
              nameLocalizations: {
                fr: "raison",
                de: "grund",
                "es-ES": "razón",
              },
              description: "❔ Reason for the warn removal",
              descriptionLocalizations: {
                fr: "❔ Raison du retrait de l'avertissement",
                de: "❔ Grund für die Warnung",
                "es-ES": "❔ Razón de la advertencia",
              },
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "list",
          nameLocalizations: { fr: "liste", de: "liste", "es-ES": "lista" },
          description: "🔨 List warns of a user",
          descriptionLocalizations: {
            fr: "🔨 Liste des avertissements d'un utilisateur",
            de: "🔨 Warnungen eines Benutzers auflisten",
            "es-ES": "🔨 Lista de advertencias de un usuario",
          },
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: "user",
              nameLocalizations: {
                fr: "utilisateur",
                de: "benutzer",
                "es-ES": "usuario",
              },
              description: "👤 User for whom to display the warnings",
              descriptionLocalizations: {
                fr: "👤 L'utilisateur pour lequel afficher les avertissements",
                de: "👤 Benutzer, für den die Warnungen angezeigt werden sollen",
                "es-ES": "👤 Usuario para el que se mostrarán las advertencias",
              },
              required: true,
            },
          ],
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { warn } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    let filteredUser, reason;
    switch (options._subcommand) {
      case "add":
        reason = options.getString("reason");
        const userArray = fetchGuild.logs.users;

        // get the highest case number from the array of warns to increment it
        const cases = userArray.map((u) => u.case);
        const highestCase = Math.max(...cases);

        // build the new warn object
        let d = new Date();
        const user = {
          case: cases.length === 0 ? 0 : highestCase + 1,
          id: member.id,
          name: member.displayName,
          moderator: interaction.user.id,
          reason: reason,
          date: d.getTime(),
        };

        userArray.push(user);
        await this.client.UpdateGuild(guild, { "logs.users": userArray });

        interaction.editReply({
          content: eval(warn.add.reply),
          components: [
            this.client.ButtonRow([
              {
                customId: "warns-list",
                label: warn.list.button1,
                style: "SECONDARY",
                emoji: "🔨",
              },
            ]),
          ],
        });

        if (!logsChannel || !enabledLogs.includes("moderation")) return;
        logsChannel
          .send({
            embeds: [
              this.client
                .Embed()
                .setAuthor({
                  name: eval(warn.add.embed1.author),
                  iconURL: interaction.user.avatarURL({ dynamic: true }),
                })
                .setDescription(eval(warn.add.embed1.description))
                .setFields({
                  name: warn.add.embed1.field1.name,
                  value: eval(warn.add.embed1.field1.value),
                  inline: true,
                })
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({
                  text: `${member.user.tag} - ${member.user.id}`,
                }),
            ],
            components: [
              this.client.ButtonRow([
                {
                  customId: "warns-list",
                  label: warn.list.button1,
                  style: "SECONDARY",
                  emoji: "🔨",
                },
              ]),
            ],
          })
          .catch(() => undefined);
        break;

      case "remove":
        const number = options.getInteger("number");
        reason = options.getString("reason");

        // find if the user matches the id of a logged one
        filteredUser = fetchGuild.logs.users.filter((u) => u.id === member.id);
        if (filteredUser.length === 0)
          return interaction.editReply(errors.error32);

        let index;
        try {
          // find the warn (-1 because warns are front listed from 1)
          index = filteredUser[number - 1].case;
        } catch (e) {
          return interaction.editReply(eval(errors.error33));
        }

        // get the index of the warn to remove
        const filteredCase = fetchGuild.logs.users
          .map((u) => u.case)
          .indexOf(index);

        // store old warn for the logging system
        const oldReason = fetchGuild.logs.users[filteredCase].reason;

        // remove the warn from the db
        fetchGuild.logs.users.splice(filteredCase, 1);
        await this.client.UpdateGuild(guild, {
          "logs.users": fetchGuild.logs.users,
        });

        interaction.editReply({
          content: eval(warn.remove.reply),
          components: [
            this.client.ButtonRow([
              {
                customId: "warns-list",
                label: warn.list.button1,
                style: "SECONDARY",
                emoji: "🔨",
              },
            ]),
          ],
        });

        if (!logsChannel || !enabledLogs.includes("moderation")) return;
        //permissions check
        if (
          !logsChannel
            .permissionsFor(guild.me)
            .has(
              PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks
            )
        )
          return interaction.editReply(errors.error53);

        logsChannel
          .send({
            embeds: [
              this.client
                .Embed()
                .setAuthor({
                  name: eval(warn.remove.embed1.author),
                  iconURL: interaction.user.displayAvatarURL({
                    dynamic: true,
                  }),
                })
                .setDescription(eval(warn.remove.embed1.description))
                .addFields(
                  {
                    name: eval(warn.remove.embed1.field1.name),
                    value: eval(warn.remove.embed1.field1.value),
                    inline: true,
                  },
                  {
                    name: warn.remove.embed1.field2.name,
                    value: eval(warn.remove.embed1.field2.value),
                    inline: true,
                  }
                )
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({
                  text: member.user.tag + " - " + member.user.id,
                }),
            ],
            components: [
              this.client.ButtonRow([
                {
                  customId: "warns-list",
                  label: warn.list.button1,
                  style: "SECONDARY",
                  emoji: "🔨",
                },
              ]),
            ],
          })
          .catch(() => undefined);
        break;

      case "list":
        // find if the user matches the id of a logged one
        filteredUser = fetchGuild.logs.users.filter((u) => u.id === member.id);
        if (filteredUser.length === 0)
          return interaction.editReply(errors.error32);

        let warnList = "";
        let i = filteredUser.length + 1;
        let s = 1;

        /* Reversing the array and then looping through it for better front listing
          show max 10 warns for space restrictions */
        filteredUser
          .slice()
          .reverse()
          .forEach((w) => {
            i--;
            s++;
            if (s > 10) return;
            warnList += `\n**${i}:** by <@${
              w.moderator
            }> - ${this.client.Formatter(w.date, "R")}\n`;
            warnList += eval(warn.list.reason);
          });

        return interaction.editReply({
          embeds: [
            this.client
              .Embed()
              .setAuthor({
                name: eval(warn.list.embed1.author),
                iconURL: member.user.avatarURL({ dynamic: true }),
              })
              .setDescription(warnList)
              .setTimestamp()
              .setFooter({
                text: `${member.user.tag} - ${member.user.id}`,
              }),
          ],
        });
    }
  }
};
