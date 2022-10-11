const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class SetupBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setup",
      nameLocalizations: {},
      description: "📝 Setup bot commands",
      descriptionLocalizations: {
        fr: "📝 Configurer les commandes du bot",
        de: "📝 Bot-Befehle einrichten",
        "es-ES": "📝 Configurar comandos de bot",
      },
      examples: "I think I don't have to detail much here 💭",
      category: "Setup",
      userPermissions: ["ManageGuild"],
      clientPermissions: ["ViewChannel", "ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "menu",
          nameLocalizations: {
            fr: "menu",
            de: "menü",
            "es-ES": "menú",
          },
          description: "🔧 View the setup menu of Stealthy",
          descriptionLocalizations: {
            fr: "🔧 Voir le menu de configuration de Stealthy",
            de: "🔧 Das Einrichtungs-Menü von Stealthy anzeigen",
            "es-ES": "🔧 Ver el menú de configuración de Stealthy",
          },
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "channels",
          nameLocalizations: { fr: "salons", de: "kanäle", "es-ES": "canales" },
          description: "📙 Setup your channels",
          descriptionLocalizations: {
            fr: "📙 Configurer vos salons",
            de: "📙 Richten Sie Ihre Kanäle ein",
            "es-ES": "📙 Configura tus canales",
          },
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "usage",
              nameLocalizations: {
                fr: "utilisation",
                de: "verwendung",
                "es-ES": "uso",
              },
              description: "📝 Type of channel to setup",
              descriptionLocalizations: {
                fr: "📝 Type de salon à configurer",
                de: "📝 Art des Kanals zum Einrichten",
                "es-ES": "📝 Tipo de canal para configurar",
              },
              required: true,
              choices: [
                {
                  name: "🚀 Logs channel - track specific user interactions",
                  nameLocalizations: {
                    fr: "🚀 Salon de logs - Suivre les interactions des utilisateurs",
                    de: "🚀 Logs-Kanal - Verfolgen Sie bestimmte Benutzerinteraktionen",
                    "es-ES":
                      "🚀 Canal de registros - Rastrear interacciones específicas de usuario",
                  },
                  value: "logs",
                },
                {
                  name: "🔊 Join to Create channel - set a voice channel creator to free up space",
                  nameLocalizations: {
                    fr: "🔊 Salon 'Join to Create' - Définir un salon vocal créateur pour libérer de l'espace",
                    de: "🔊 Join to Create-Kanal - Setzen Sie einen Sprachkanal, um Platz zu schaffen",
                    "es-ES":
                      "🔊 Canal de 'Join to Create' - Establece un canal de voz para crear espacio",
                  },
                  value: "jtc",
                },
                {
                  name: "🎈 Role Claim channel - allow users to choose a role with a reaction",
                  nameLocalizations: {
                    fr: "🎈 Salon 'Role Claim' - Permettre aux utilisateurs de choisir un rôle avec une réaction",
                    de: "🎈 Role Claim-Kanal - Benutzern erlauben, eine Rolle mit einer Reaktion auszuwählen",
                    "es-ES":
                      "🎈 Canal de 'Role Claim' - Permitir a los usuarios elegir un rol con una reacción",
                  },
                  value: "roleclaim",
                },
                {
                  name: "🧾 Member Count channel - allow users to see the member count of the server",
                  nameLocalizations: {
                    fr: "🧾 Salon 'Member Count' - Permettre aux utilisateurs de voir le nombre de membres du serveur",
                    de: "🧾 Member Count-Kanal - Benutzern erlauben, die Mitgliederzahl des Servers anzuzeigen",
                    "es-ES":
                      "🧾 Canal de 'Member Count' - Permitir a los usuarios ver la cantidad de miembros del servidor",
                  },
                  value: "membercount",
                },
                {
                  name: "🔎 Verify channel - allow users to verify themselves with a captcha",
                  nameLocalizations: {
                    fr: "🔎 Salon 'Verify' - Permettre aux utilisateurs de se vérifier eux-mêmes avec un captcha",
                    de: "🔎 Verify-Kanal - Benutzern erlauben, sich selbst mit einem Captcha zu verifizieren",
                    "es-ES":
                      "🔎 Canal de 'Verify' - Permitir a los usuarios verificarse a sí mismos con un captcha",
                  },
                  value: "verify",
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.Channel,
              name: "channel",
              nameLocalizations: { fr: "salon", de: "kanal", "es-ES": "canal" },
              description: "🚀 Choose a channel",
              descriptionLocalizations: {
                fr: "🚀 Choisissez un salon",
                de: "🚀 Wählen Sie einen Kanal",
                "es-ES": "🚀 Elige un canal",
              },
              required: true,
              channelTypes: [ChannelType.GuildText, ChannelType.GuildCategory],
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "blacklist",
          nameLocalizations: {},
          description: "👮 Manage newcomers restrictions",
          descriptionLocalizations: {
            fr: "👮 Gérer les restrictions des nouveaux arrivants",
            de: "👮 Verwalten Sie die Einschränkungen für Neulinge",
            "es-ES": "👮 Administre las restricciones de los nuevos",
          },
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: "choice",
              nameLocalizations: {
                fr: "choix",
                de: "wahl",
                "es-ES": "elección",
              },
              description: "📝 Type of timer to setup",
              descriptionLocalizations: {
                fr: "📝 Type de minuteur à configurer",
                de: "📝 Art des Timers zum Einrichten",
                "es-ES": "📝 Tipo de temporizador para configurar",
              },
              required: true,
              choices: [
                {
                  name: "⌚ Blacklist time - change how long the bot will block the newcomer for",
                  nameLocalizations: {
                    fr: "⌚ Temps de liste noire - changer la durée pendant laquelle le bot bloquera le nouveau membre",
                    de: "⌚ Blacklist-Zeit - Ändern Sie die Dauer, für die der Bot den Neuling blockiert",
                    "es-ES":
                      "⌚ Tiempo de blacklist - cambia cuánto tiempo bloqueará el bot al nuevo miembro",
                  },
                  value: "blacklist_time",
                },
                {
                  name: "🎣 Minimum account age - change the minimum age a newcomer must be to join the server",
                  nameLocalizations: {
                    fr: "🎣 Âge minimum du compte - changer l'âge minimum qu'un nouveau membre doit avoir",
                    de: "🎣 Mindestalter des Kontos - Ändern Sie das Mindestalter, das ein Neuling haben muss",
                    "es-ES":
                      "🎣 Edad mínima de la cuenta - cambia la edad mínima que debe tener un nuevo miembro",
                  },
                  value: "blacklist_minimum_age",
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "format",
              nameLocalizations: {
                fr: "format",
                de: "format",
                "es-ES": "formato",
              },
              description: "🕒 Wich format do you want to use ?",
              descriptionLocalizations: {
                fr: "🕒 Quel format souhaitez-vous utiliser ?",
                de: "🕒 Welches Format möchten Sie verwenden?",
                "es-ES": "🕒 ¿Qué formato desea usar?",
              },
              required: true,
              choices: [
                {
                  name: "🕒 Hours",
                  nameLocalizations: {
                    fr: "🕒 Heures",
                    de: "🕒 Stunden",
                    "es-ES": "🕒 Horas",
                  },
                  value: "hours",
                },
                {
                  name: "🕒 Minutes",
                  nameLocalizations: {
                    fr: "🕒 Minutes",
                    de: "🕒 Minuten",
                    "es-ES": "🕒 Minutos",
                  },
                  value: "minutes",
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.Integer,
              name: "time",
              nameLocalizations: { fr: "temps", de: "zeit", "es-ES": "tiempo" },
              description: "⏱️ Define the time",
              descriptionLocalizations: {
                fr: "⏱️ Définir le temps",
                de: "⏱️ Definieren Sie die Zeit",
                "es-ES": "⏱️ Definir el tiempo",
              },
              required: true,
              minValue: 1,
              maxValue: 670,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.SubcommandGroup,
          name: "roleclaim",
          nameLocalizations: {},
          description: "🎈 Setup Role Claim system",
          descriptionLocalizations: {
            fr: "🎈 Configurer le système de 'Role Claim'",
            de: "🎈 Konfigurieren Sie das Role Claim-System",
            "es-ES": "🎈 Configurar el sistema de 'Role Claim'",
          },
          options: [
            {
              type: ApplicationCommandOptionType.Subcommand,
              name: "add",
              nameLocalizations: {
                fr: "ajouter",
                de: "hinzufügen",
                "es-ES": "añadir",
              },
              description: "🎈 Add a role to the Role Claim system",
              descriptionLocalizations: {
                fr: "🎈 Ajouter un rôle au système de 'Role Claim'",
                de: "🎈 Fügen Sie dem Role Claim-System eine Rolle hinzu",
                "es-ES": "🎈 Agrega un rol al sistema de 'Role Claim'",
              },
              options: [
                {
                  type: ApplicationCommandOptionType.Role,
                  name: "role",
                  nameLocalizations: {
                    fr: "rôle",
                    de: "rolle",
                    "es-ES": "rol",
                  },
                  description: "🧮 Choose the role you want to add",
                  descriptionLocalizations: {
                    fr: "🧮 Choisissez le rôle que vous souhaitez ajouter",
                    de: "🧮 Wählen Sie die Rolle aus, die Sie hinzufügen möchten",
                    "es-ES": "🧮 Elija el rol que desea agregar",
                  },
                  required: true,
                },
                {
                  type: ApplicationCommandOptionType.String,
                  name: "emoji",
                  nameLocalizations: {},
                  description:
                    "😄 Choose the emoji you want to use for this role",
                  descriptionLocalizations: {
                    fr: "😄 Choisissez l'emoji que vous souhaitez utiliser pour ce rôle",
                    de: "😄 Wählen Sie das Emoji aus, das Sie für diese Rolle verwenden möchten",
                    "es-ES": "😄 Elija el emoji que desea usar para este rol",
                  },
                  required: true,
                },
                {
                  type: ApplicationCommandOptionType.String,
                  name: "description",
                  nameLocalizations: {
                    fr: "description",
                    de: "beschreibung",
                    "es-ES": "descripción",
                  },
                  description:
                    "✍️ Choose the description of this role (optional)",
                  descriptionLocalizations: {
                    fr: "✍️ Choisissez la description de ce rôle (facultatif)",
                    de: "✍️ Wählen Sie die Beschreibung dieser Rolle aus (optional)",
                    "es-ES": "✍️ Elija la descripción de este rol (opcional)",
                  },
                  required: false,
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.Subcommand,
              name: "remove",
              nameLocalizations: {
                fr: "supprimer",
                de: "entfernen",
                "es-ES": "retirar",
              },
              description: "🎈 Delete a role from the Role Claim system",
              descriptionLocalizations: {
                fr: "🎈 Supprimer un rôle du système de 'Role Claim'",
                de: "🎈 Löschen Sie eine Rolle aus dem Role Claim-System",
                "es-ES": "🎈 Eliminar un rol del sistema de 'Role Claim'",
              },
              options: [
                {
                  type: ApplicationCommandOptionType.Role,
                  name: "role",
                  nameLocalizations: {
                    fr: "rôle",
                    de: "rolle",
                    "es-ES": "rol",
                  },
                  description: "🧮 Choose the role you want to delete",
                  descriptionLocalizations: {
                    fr: "🧮 Choisissez le rôle que vous souhaitez supprimer",
                    de: "🧮 Wählen Sie die Rolle aus, die Sie löschen möchten",
                    "es-ES": "🧮 Elija el rol que desea eliminar",
                  },
                  required: false,
                },
                {
                  type: ApplicationCommandOptionType.String,
                  name: "emoji",
                  nameLocalizations: {
                    fr: "emoji",
                    de: "emoji",
                    "es-ES": "emoji",
                  },
                  description: "😄 Choose the emoji you want to delete",
                  descriptionLocalizations: {
                    fr: "😄 Choisissez l'emoji que vous souhaitez supprimer",
                    de: "😄 Wählen Sie das Emoji aus, das Sie löschen möchten",
                    "es-ES": "😄 Elija el emoji que desea eliminar",
                  },
                  required: false,
                },
              ],
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.SubcommandGroup,
          name: "autorole",
          nameLocalizations: {},
          description:
            "🎩 Assign automatically roles to a newcomer when they join the server",
          descriptionLocalizations: {
            fr: "🎩 Attribuer automatiquement des rôles à un nouveau membre lorsqu'il rejoint le serveur",
            de: "🎩 Weisen Sie neuen Mitgliedern beim Betreten des Servers automatisch Rollen zu",
            "es-ES":
              "🎩 Asigna automáticamente roles a un recién llegado cuando se une al servidor",
          },
          options: [
            {
              type: ApplicationCommandOptionType.Subcommand,
              name: "add",
              nameLocalizations: {
                fr: "ajouter",
                de: "hinzufügen",
                "es-ES": "añadir",
              },
              description:
                "🎩 Assign a new role to a newcomer when they join the server",
              descriptionLocalizations: {
                fr: "🎩 Attribuer un nouveau rôle à un nouveau membre lorsqu'il rejoint le serveur",
                de: "🎩 Weisen Sie einem neuen Mitglied beim Betreten des Servers eine neue Rolle zu",
                "es-ES":
                  "🎩 Asigna un nuevo rol a un recién llegado cuando se une al servidor",
              },
              options: [
                {
                  type: ApplicationCommandOptionType.Role,
                  name: "role",
                  nameLocalizations: {
                    fr: "rôle",
                    de: "rolle",
                    "es-ES": "rol",
                  },
                  description: "🧮 The role to assign to the newcomer",
                  descriptionLocalizations: {
                    fr: "🧮 Le rôle à attribuer au nouveau membre",
                    de: "🧮 Die Rolle, die dem Neuling zugewiesen werden soll",
                    "es-ES": "🧮 El rol que se asignará al recién llegado",
                  },
                  required: true,
                },
              ],
            },
            {
              type: ApplicationCommandOptionType.Subcommand,
              name: "remove",
              nameLocalizations: {
                fr: "supprimer",
                de: "entfernen",
                "es-ES": "retirar",
              },
              description: "🎩 Remove a role from the list of autoroles",
              descriptionLocalizations: {
                fr: "🎩 Supprimer un rôle de la liste des autorôles",
                de: "🎩 Entfernen Sie eine Rolle aus der Liste der Autorollen",
                "es-ES": "🎩 Eliminar un rol de la lista de autoroles",
              },
              options: [
                {
                  type: ApplicationCommandOptionType.Role,
                  name: "role",
                  nameLocalizations: {
                    fr: "rôle",
                    de: "rolle",
                    "es-ES": "rol",
                  },
                  description: "🧮 The role to remove from the list",
                  descriptionLocalizations: {
                    fr: "🧮 Le rôle à supprimer de la liste",
                    de: "🧮 Die Rolle, die von der Liste entfernt werden soll",
                    "es-ES": "🧮 El rol que se eliminará de la lista",
                  },
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async execute(interaction) {
    const { guild, options } = interaction;
    const me = await guild.members.fetchMe();
    let requiredPerms = [];

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { setupIds } = this.client.la[lang].commands.admin;

    if (options._subcommand === "menu") {
      if (!(await this.client.Defer(interaction))) return;

      return interaction.editReply({
        content: setupIds.menu.reply,
        components: [
          this.client.ButtonRow([
            {
              customId: "setup-menu",
              label: "Setup",
              style: "SECONDARY",
              emoji: "🔧",
            },
          ]),
        ],
      });
    }

    switch (options._group) {
      case "roleclaim":
        /*
         * This part is simply to avoid code duplication, deconstructing options and store it for later use
         * Types of errors handled and replied:
         * 1. all options:
         *   - Message of role claim system not found in db -> ask to create it
         *   - Unable to find the role claim message
         *
         * 2. add & remove:
         *   - Custom emoji provided is not in the bot's servers (can't access it) -> tell it's not available to use
         *   - Unicode emoji not supported (I don't know if it can happen but in case)-> tell it's not available to use
         *
         * 3. add:
         *   - Role position of Stealthy is lower than the choosed one -> ask to move it up
         */

        //permissions check
        requiredPerms = [
          "ManageRoles",
          "AddReactions",
          "EmbedLinks",
          "UseExternalEmojis",
        ];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ManageRoles |
              PermissionFlagsBits.AddReactions |
              PermissionFlagsBits.EmbedLinks |
              PermissionFlagsBits.UseExternalEmojis
          )
        )
          return interaction.editReply({
            content: eval(errors.error52),
          });

        const rlcType = fetchGuild.roleClaim.type;
        let msgId = fetchGuild.roleClaim.message;
        let channelId = fetchGuild.roleClaim.channel;
        let tipMsgId = fetchGuild.roleClaim.tipMessage;
        let msg, tipMsg, foundChannel;

        if (!channelId || !msgId) {
          return interaction.reply({
            ephemeral: true,
            content: errors.error10,
          });
        }

        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
        } catch (e) {
          return interaction.reply({
            ephemeral: true,
            content: errors.error10,
          });
        }

        try {
          tipMsg = await foundChannel.messages.fetch(tipMsgId);
        } catch (e) {}

        let roleRC = options.getRole("role"),
          roleAlreadyExist;
        if (
          roleRC &&
          this.client.HighestRole(guild, this.client.user.id) <
            roleRC.rawPosition &&
          options._subcommand != "remove"
        ) {
          return interaction.reply({
            ephemeral: true,
            content: eval(errors.error12),
          });
        }

        if (roleRC && roleRC.id === guild.id) {
          return interaction.reply({
            ephemeral: true,
            content: eval(errors.error13),
          });
        }

        let emoji = options.getString("emoji");

        let emojiName,
          isEmojiCustom = false,
          customEmoji,
          emojiAlreadyExist;

        if (emoji && emoji.startsWith("<") && emoji.endsWith(">")) {
          if (!(await this.client.IsValidEmoji(emoji)))
            return interaction.reply({
              ephemeral: true,
              content: eval(errors.error14),
            });
          emojiName = emoji;
          isEmojiCustom = true;
        }

        if (emoji && !isEmojiCustom && !this.client.HasEmoji(emoji)) {
          return interaction.reply({
            ephemeral: true,
            content: eval(errors.error15),
          });
        }
        if (emoji && !isEmojiCustom)
          emojiName = this.client.GetEmojiNameFromUni(emoji);

        let rolesEmbed, fieldValue;
        if (rlcType === "reaction") {
          rolesEmbed = this.client
            .Embed(false)
            .setTitle(msg.embeds[0].title)
            .setDescription(msg.embeds[0].description)
            .setFields(msg.embeds[0].fields)
            .setFooter({ text: msg.embeds[0].footer.text })
            .setColor(msg.embeds[0].color);
        }

        switch (options._subcommand) {
          case "add":
            if (!(await this.client.Defer(interaction))) return;
            /*
             * Add a role to the roleclaim message - Usage: /setup roleclaim add <role> <emoji> [description]
             * Type of errors handled and replied:
             * - Emoji specified already exist in db -> ask to remove it first
             * - Role specified already exist in db -> tell the role with emoji associated to it
             * - Max number of roles reached -> tell the user the limit
             */

            const description = options.getString("description");

            if (msg.reactions.cache.size >= 20) {
              return interaction.editReply(errors.error16);
            }

            const fieldsArray = fetchGuild.roleClaim.fields;

            emojiAlreadyExist = fieldsArray.filter(
              (f) => emojiName === f.emojiName
            );

            roleAlreadyExist = fieldsArray.filter(
              (f) => roleRC.id === f.roleId
            );

            if (emojiName && emojiAlreadyExist.length > 0) {
              return interaction.editReply(eval(errors.error17));
            }

            if (roleRC && roleAlreadyExist.length > 0) {
              return interaction.editReply(eval(errors.error18));
            }

            const field = {
              emojiName: emojiName,
              roleId: roleRC.id,
            };
            fieldsArray.push(field);

            await this.client.UpdateGuild(guild, {
              "roleClaim.fields": fieldsArray,
            });

            rolesEmbed.addFields([
              {
                name: `${description ? description : roleRC.name}`,
                value: emoji,
                inline: true,
              },
            ]);
            msg.react(emoji);

            await msg.edit({
              embeds: [rolesEmbed],
            });

            return interaction.editReply(eval(setupIds.roleclaim.add.reply));

          case "remove":
            if (!(await this.client.Defer(interaction))) return;
            /*
             * Remove a role from the roleclaim message - Usage: /setup roleclaim remove [role] [emoji]
             * Type of errors handled and replied:
             * - Emoji provided not found during the process
             * - Role provided not found during the process
             */

            let roleId, emojiUNI;

            // no arguments provided
            if (!roleRC && !emoji) {
              msg.delete().catch(() => undefined);
              tipMsg.delete().catch(() => undefined);

              await this.client.UpdateGuild(guild, {
                "roleClaim.fields": [],
                "roleClaim.channel": null,
                "roleClaim.message": null,
                "roleClaim.tipMessage": null,
              });

              return interaction.editReply(
                setupIds.roleclaim.remove.replyNoArgs
              );
            }

            // loop in fields embed
            for (let i in msg.embeds[0].fields) {
              fieldValue = msg.embeds[0].fields[i].value;

              // if the emoji is not provided, find out if the field emoji is custom or not and set it int emojiName variable
              if (!emoji && roleRC) {
                isEmojiCustom = fieldValue.startsWith("<") ? true : false;
              }

              // if the emoji is provided, set the fieldValue based on the type of emoji for later condition
              if (emoji) {
                fieldValue = isEmojiCustom
                  ? fieldValue
                  : this.client.GetEmojiNameFromUni(fieldValue);
              }

              emojiAlreadyExist = emoji
                ? fetchGuild.roleClaim.fields.filter(
                    (f) => emojiName === f.emojiName
                  )
                : null;

              roleAlreadyExist = roleRC
                ? fetchGuild.roleClaim.fields.filter(
                    (f) => roleRC.id === f.roleId
                  )
                : null;

              // first condition of the if -> search by emoji
              // second condition of the if -> search by role
              if (
                (emoji && fieldValue === emojiName) ||
                (roleRC && roleAlreadyExist.length > 0)
              ) {
                // find the role in db with emoji povided
                let roldDB = emoji ? emojiAlreadyExist : null;

                // get emojiName only the role was provided
                if (roleRC)
                  emojiName = isEmojiCustom
                    ? fieldValue
                    : this.client.GetEmojiNameFromUni(fieldValue);

                // get the role id
                roleId = roleRC ? roleRC.id : roldDB[0].roleId;

                // get correct emojis for the response
                if (isEmojiCustom) {
                  customEmoji = fieldValue.split(":")[2].slice(0, -1);
                } else {
                  emojiUNI = this.client.GetEmojiFromName(fieldValue);
                }

                rolesEmbed.data.fields.splice(i, 1);
                const filteredField = fetchGuild.roleClaim.fields
                  .map((u) => u.roleId)
                  .indexOf(
                    roleAlreadyExist
                      ? roleAlreadyExist[0].roleId
                      : roldDB[0].roleId
                  );
                fetchGuild.roleClaim.fields.splice(filteredField, 1);
                await this.client.UpdateGuild(guild, {
                  "roleClaim.fields": fetchGuild.roleClaim.fields,
                });

                await msg.reactions
                  .resolve(!isEmojiCustom ? emojiUNI : customEmoji)
                  .remove();

                await msg.edit({
                  embeds: [rolesEmbed],
                });

                return interaction.editReply(
                  eval(setupIds.roleclaim.remove.reply)
                );
              }
            }
            if (roleRC) return interaction.editReply(eval(errors.error19));

            if (emoji) return interaction.editReply(eval(errors.error20));
            break;
        }
        break;

      case "autorole":
        //permissions check
        requiredPerms = ["ManageRoles"];
        if (!me.permissions.has(PermissionFlagsBits.ManageRoles))
          return interaction.editReply({
            content: eval(errors.error52),
          });

        if (!(await this.client.Defer(interaction))) return;
        const roleAR = options.getRole("role");
        const autoroleArray = fetchGuild.autoRole.roles;
        const moreThanOneRole = autoroleArray.length > 1;

        switch (options._subcommand) {
          case "add":
            if (roleAR.id === guild.id) {
              return interaction.editReply(eval(errors.error13));
            }

            if (
              this.client.HighestRole(guild, this.client.user.id) <
              roleAR.rawPosition
            ) {
              return interaction.editReply(eval(errors.error51));
            }

            if (autoroleArray.length === 5) {
              return interaction.editReply(errors.error21);
            }

            if (autoroleArray.filter((r) => r == roleAR.id).length > 0) {
              return interaction.editReply(eval(errors.error22));
            }

            autoroleArray.push(roleAR.id);
            await this.client.UpdateGuild(guild, {
              "autoRole.roles": autoroleArray,
            });

            return interaction.editReply({
              content: eval(setupIds.autorole.add.reply),
              components: [
                this.client.ButtonRow([
                  {
                    customId: "list-autorole",
                    label: setupIds.autorole.add.button1,
                    style: "PRIMARY",
                    emoji: "📋",
                  },
                  {
                    customId: "reset-autorole",
                    label: setupIds.autorole.add.button2,
                    style: "SECONDARY",
                    emoji: "🗑",
                  },
                ]),
              ],
            });

          case "remove":
            if (!autoroleArray || autoroleArray.length === 0)
              return interaction.editReply(errors.error23);

            if (autoroleArray.filter((r) => r == roleAR.id).length === 0)
              return interaction.editReply(eval(errors.error24));

            const filteredRole = autoroleArray.indexOf(roleAR.id);
            autoroleArray.splice(filteredRole, 1);
            await this.client.UpdateGuild(guild, {
              "autoRole.roles": autoroleArray,
            });

            return interaction.editReply(eval(setupIds.autorole.remove.reply));
        }
    }

    switch (options._subcommand) {
      case "channels":
        if (!(await this.client.Defer(interaction))) return;
        const usage = options.getString("usage");
        const channel = options.getChannel("channel");
        let noParent = false;

        if (usage === "roleclaim") {
          if (channel.type !== ChannelType.GuildText) {
            return interaction.editReply(eval(errors.error25));
          }

          //permissions check
          requiredPerms = [
            "ManageRoles",
            "SendMessages",
            "AddReactions",
            "EmbedLinks",
            "UseExternalEmojis",
          ];
          if (
            !me.permissions.has(
              PermissionFlagsBits.ManageRoles |
                PermissionFlagsBits.SendMessages |
                PermissionFlagsBits.AddReactions |
                PermissionFlagsBits.EmbedLinks |
                PermissionFlagsBits.UseExternalEmojis
            )
          )
            return interaction.editReply({
              content: eval(errors.error52),
            });

          if (fetchGuild.roleClaim.message) {
            let msgId, tipMsgId, channelId, foundChannel, msg, tipMsg;

            msgId = fetchGuild.roleClaim.message;
            channelId = fetchGuild.roleClaim.channel;
            tipMsgId = fetchGuild.roleClaim.tipMessage;

            if (channelId && msgId && tipMsgId) {
              try {
                foundChannel = guild.channels.cache.get(channelId);
                msg = await foundChannel.messages.fetch(msgId);
                tipMsg = await foundChannel.messages.fetch(tipMsgId);
                msg.delete();
                tipMsg.delete();
              } catch (e) {}
            }

            this.client.UpdateGuild(guild, { roleclaim_Roles: [] });
          }

          channel
            .send({
              embeds: [
                this.client
                  .Embed()
                  .setTitle(setupIds.channels.roleclaim.embed1.title)
                  .setDescription(
                    setupIds.channels.roleclaim.embed1.description
                  )
                  .setFooter({
                    text: setupIds.channels.roleclaim.embed1.footer,
                  }),
              ],
            })
            .then((embedMsg) => {
              try {
                this.client.UpdateGuild(guild, {
                  "roleClaim.message": embedMsg.id,
                  "roleClaim.channel": channel.id,
                });
              } catch (e) {
                return interaction.editReply(eval(errors.error11));
              }

              channel
                .send({
                  content: setupIds.channels.roleclaim.tipMsg,
                })
                .then(async (tipMsg) => {
                  this.client.UpdateGuild(guild, {
                    "roleClaim.tipMessage": tipMsg.id,
                  });

                  await this.client.Wait(1000);
                  interaction.editReply({
                    content: eval(setupIds.channels.roleclaim.reply),
                    components: [
                      this.client.ButtonRow([
                        {
                          customId: "edit-roleclaim",
                          label: setupIds.channels.roleclaim.button1,
                          style: "PRIMARY",
                          emoji: "✏️",
                        },
                        {
                          customId: "delete-roleclaim",
                          label: setupIds.channels.roleclaim.button2,
                          style: "SECONDARY",
                          emoji: "🗑",
                        },
                      ]),
                    ],
                  });
                });
            })
            .catch(() => interaction.editReply(errors.error26));
          return;
        }
        if (usage === "membercount") {
          //permissions check
          requiredPerms = ["Connect", "ManageRoles"];
          if (
            !me.permissions.has(
              PermissionFlagsBits.Connect | PermissionFlagsBits.ManageRoles
            )
          )
            return interaction.editReply({
              content: eval(errors.error52),
            });

          if (fetchGuild.memberCount.channel) {
            let channelFound = await guild.channels.cache.get(
              fetchGuild.memberCount.channel
            );
            if (channelFound) channelFound.delete().catch(() => undefined);
            await this.client.UpdateGuild(guild, {
              "memberCount.channel": null,
            });
          }

          let parentFound =
            channel.type === ChannelType.GuildCategory ? channel : null;
          if (!parentFound) noParent = true;
          await guild.channels
            .create({
              name: setupIds.channels.membercount.name,
              type: ChannelType.GuildVoice,
              parent: parentFound,
              permissionOverwrites: [
                {
                  id: this.client.application.id,
                  allow: ["Connect"],
                },
                {
                  id: guild.id,
                  allow: ["ViewChannel"],
                  deny: ["Connect"],
                },
              ],
            })
            .then(async (c) => {
              this.client.UpdateMemberCount(
                guild,
                c.id,
                fetchGuild.memberCount.name
              );

              await this.client.UpdateGuild(guild, {
                "memberCount.channel": c.id,
              });

              return interaction.editReply({
                content: eval(setupIds.channels.membercount.reply),
                components: [
                  this.client.ButtonRow([
                    {
                      customId: "rename-membercount",
                      label: setupIds.channels.membercount.button1,
                      style: "PRIMARY",
                      emoji: "✏️",
                    },
                    {
                      customId: "delete-membercount",
                      label: setupIds.channels.membercount.button2,
                      style: "SECONDARY",
                      emoji: "🗑",
                    },
                  ]),
                ],
              });
            })
            .catch((e) => {
              return interaction.editReply(eval(errors.error8));
            });

          return;
        }

        if (usage === "jtc") {
          //permissions check
          requiredPerms = ["ManageRoles", "Connect", "MoveMembers"];
          if (
            !me.permissions.has(
              PermissionFlagsBits.ManageRoles |
                PermissionFlagsBits.Connect |
                PermissionFlagsBits.MoveMembers
            )
          )
            return interaction.editReply({
              content: eval(errors.error52),
            });

          if (fetchGuild.joinToCreate.channel) {
            let channelFound = await guild.channels.cache.get(
              fetchGuild.joinToCreate.channel
            );

            if (channelFound) channelFound.delete().catch(() => undefined);
            await this.client.UpdateGuild(guild, {
              "joinToCreate.channel": null,
            });
          }

          let parentFound =
            channel.type === ChannelType.GuildCategory ? channel : null;
          if (!parentFound) noParent = true;
          await guild.channels
            .create({
              name: setupIds.channels.jtc.name,
              type: ChannelType.GuildVoice,
              parent: parentFound,
            })
            .then(async (c) => {
              await c.lockPermissions().catch(() => undefined);

              await this.client.UpdateGuild(guild, {
                "joinToCreate.channel": c.id,
              });

              return interaction.editReply({
                content: eval(setupIds.channels.jtc.reply),
                components: [
                  this.client.ButtonRow([
                    {
                      customId: "channels-names-JTC",
                      label: setupIds.channels.jtc.button1,
                      style: "PRIMARY",
                      emoji: "✏️",
                    },
                    {
                      customId: "delete-JTC",
                      label: setupIds.channels.jtc.button2,
                      style: "SECONDARY",
                      emoji: "🗑",
                    },
                  ]),
                ],
              });
            })
            .catch((e) => {
              return interaction.editReply(eval(errors.error11));
            });
          return;
        }

        if (usage === "logs") {
          //permissions check
          requiredPerms = ["SendMessages", "EmbedLinks"];
          if (
            !me.permissions.has(
              PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks
            )
          )
            return interaction.editReply({
              content: eval(errors.error52),
            });

          if (channel.type !== ChannelType.GuildText)
            return interaction.editReply(errors.error26);

          await this.client.UpdateGuild(guild, { "logs.channel": channel.id });
          const enabledLogs = fetchGuild.logs.enabled;

          return interaction.editReply({
            content: eval(setupIds.channels.logs.reply),
            components: [
              this.client.SelectMenuRow(
                "logs-select",
                setupIds.channels.logs.select1.label,
                [
                  {
                    label: setupIds.channels.logs.select1.option1.label,
                    description:
                      setupIds.channels.logs.select1.option1.description,
                    value: "moderation",
                    emoji: "🛡️",
                    default: enabledLogs.includes("moderation"),
                  },
                  {
                    label: setupIds.channels.logs.select1.option2.label,
                    description:
                      setupIds.channels.logs.select1.option2.description,
                    value: "channels",
                    emoji: "📙",
                    default: enabledLogs.includes("channels"),
                  },
                  {
                    label: setupIds.channels.logs.select1.option3.label,
                    description:
                      setupIds.channels.logs.select1.option3.description,
                    value: "joinLeave",
                    emoji: "📝",
                    default: enabledLogs.includes("joinLeave"),
                  },
                  {
                    label: setupIds.channels.logs.select1.option4.label,
                    description:
                      setupIds.channels.logs.select1.option4.description,
                    value: "msgDelete",
                    emoji: "🗑",
                    default: enabledLogs.includes("msgDelete"),
                  },
                  {
                    label: setupIds.channels.logs.select1.option5.label,
                    description:
                      setupIds.channels.logs.select1.option5.description,
                    value: "msgEdit",
                    emoji: "✍️",
                    default: enabledLogs.includes("msgEdit"),
                  },
                ],
                { min: 0, max: 5 }
              ),
            ],
          });
        }

        if (usage === "jtc") {
          return interaction.editReply({
            content: eval(setupIds.channels.jtc.reply),
            components: [
              this.client.ButtonRow([
                {
                  customId: "setup-menu",
                  label: setupIds.channels.jtc.button3,
                  style: "SECONDARY",
                  emoji: "🔧",
                },
              ]),
            ],
          });
        }

        if (usage === "verify") {
          requiredPerms = ["SendMessages", "EmbedLinks", "ManageRoles"];

          if (
            !me.permissions.has(
              PermissionFlagsBits.SendMessages |
                PermissionFlagsBits.EmbedLinks |
                PermissionFlagsBits.ManageRoles
            )
          )
            return interaction.editReply({
              content: eval(errors.error52),
            });

          if (channel.type !== ChannelType.GuildText)
            return interaction.editReply(errors.error26);

          let verifyRole = await guild.roles.cache.find(
            (r) => r.id === fetchGuild.verify.role
          );

          if (fetchGuild.verify.channel) {
            const channelFound = await guild.channels.cache.get(
              fetchGuild.verify.channel
            );
            await channelFound.messages
              .fetch(fetchGuild.verify.message)
              .then((msg) => {
                if (msg) msg.delete().catch(() => undefined);
              })
              .catch(() => {
                this.client.UpdateGuild(guild, {
                  "verify.channel": null,
                  "verify.message": null,
                });
              });
          }

          await this.client.UpdateGuild(guild, {
            "verify.channel": channel.id,
          });

          guild.roles.everyone.setPermissions(0n);
          if (!verifyRole) {
            await guild.roles
              .create({
                name: setupIds.channels.verify.roleName,
                mentionable: false,
                hoist: false,
                permissions: [
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.ReadMessageHistory,
                ],
              })
              .then(async (role) => {
                verifyRole = role;
                await this.client.UpdateGuild(guild, {
                  "verify.role": role.id,
                });
              })
              .catch(() => interaction.editReply(errors.error54));
          }

          if (!verifyRole) return;
          channel.permissionOverwrites.edit(guild.roles.everyone.id, {
            ViewChannel: true,
            ReadMessageHistory: true,
          });

          await channel
            .send({
              embeds: [
                this.client
                  .Embed()
                  .setTitle(setupIds.channels.verify.embed1.title)
                  .setDescription(setupIds.channels.verify.embed1.description),
              ],
              components: [
                this.client.ButtonRow([
                  {
                    customId: "verify",
                    label: setupIds.channels.verify.button1,
                    style: "SUCCESS",
                    emoji: "✅",
                  },
                ]),
              ],
            })
            .then(async (msg) => {
              await this.client.UpdateGuild(guild, {
                "verify.message": msg.id,
              });
            })
            .catch(() =>
              interaction.editReply({
                content: errors.error26,
              })
            );

          return interaction.editReply({
            content: eval(setupIds.channels.verify.reply),
            components: [
              this.client.ButtonRow([
                {
                  customId: "verify-edit",
                  label: setupIds.channels.verify.button2,
                  style: "SECONDARY",
                  emoji: "🔧",
                },
              ]),
            ],
          });
        }

      case "blacklist":
        if (!(await this.client.Defer(interaction))) return;
        //permissions check
        requiredPerms = ["ModerateMembers"];
        if (!me.permissions.has(PermissionFlagsBits.ModerateMembers))
          return interaction.editReply({
            content: eval(errors.error52),
          });

        const blacklistState =
          fetchGuild.moderationTools.enabled.includes("blacklist");
        if (!blacklistState) {
          return interaction.editReply({
            content: setupIds.blacklist.reply1,
            components: [
              this.client.ButtonRow([
                {
                  customId: "blacklist-tool",
                  style: "SUCCESS",
                  emoji: "✅",
                },
              ]),
            ],
          });
        }

        const choice = options.getString("choice");
        const format = options.getString("format");
        const time =
          format === "minutes"
            ? options.getInteger("time") * 60000
            : options.getInteger("time") * 3600000;

        if (choice === "blacklist_minimum_age") {
          await this.client.UpdateGuild(guild, {
            "blackList.minAge": time,
          });
        }

        if (choice === "blacklist_time") {
          await this.client.UpdateGuild(guild, {
            "blackList.time": time,
          });
        }

        return interaction.editReply({
          content: eval(setupIds.blacklist.reply2),
        });
    }
  }
};
