const { Command } = require("sheweny");
const { Permissions } = require("discord.js");

module.exports = class SetupBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setup",
      description: "📝 Setup bot commands",
      examples: "I think I don't have to detail much here 💭",
      category: "Setup",
      userPermissions: ["MANAGE_GUILD"],
      options: [
        {
          type: "SUB_COMMAND",
          name: "menu",
          description: "🔧 View the setup menu of Stealthy",
        },
        {
          type: "SUB_COMMAND",
          name: "channels",
          description: "💡 Setup your channels",
          options: [
            {
              type: "STRING",
              name: "usage",
              description: "💡 Define a purpose",
              required: true,
              choices: [
                {
                  name: "🚀 Logs channel - track specific user interactions",
                  value: "logs",
                },
                {
                  name: "🔊 Join to Create channel - set a voice channel creator to free up space",
                  value: "jtc",
                },
                {
                  name: "🎈 Role Claim channel - allow users to choose a role with a reaction",
                  value: "roleclaim",
                },
                {
                  name: "🧾 Member Count channel - allow users to see the member count of the server",
                  value: "membercount",
                },
              ],
            },
            {
              type: "CHANNEL",
              name: "channel",
              description: "🚀 Choose a channel",
              required: true,
              channelTypes: ["GUILD_TEXT", "GUILD_CATEGORY"],
            },
          ],
        },
        {
          type: "SUB_COMMAND",
          name: "blacklist",
          description: "👮 Manage newcomers restrictions",
          options: [
            {
              type: "STRING",
              name: "choice",
              description: "💡 Time to change",
              required: true,
              choices: [
                {
                  name: "⌚ Blacklist time - change how long the bot will block the newcomer",
                  value: "blacklist_time",
                },
                {
                  name: "🎣 Minimum account age - change the minimum age a newcomer must have to be allowed to join",
                  value: "blacklist_minimum_age",
                },
              ],
            },
            {
              type: "STRING",
              name: "format",
              description: "💡 Wich format do you want to use ?",
              required: true,
              choices: [
                {
                  name: "🕒 Hours",
                  value: "hours",
                },
                {
                  name: "🕒 Minutes",
                  value: "minutes",
                },
              ],
            },
            {
              type: "INTEGER",
              name: "time",
              description: "💡 Define the time",
              required: true,
              minValue: 1,
              maxValue: 670,
            },
          ],
        },
        {
          type: "SUB_COMMAND_GROUP",
          name: "roleclaim",
          description: "🎈 Setup Role Claim system",
          options: [
            {
              type: "SUB_COMMAND",
              name: "add",
              description: "🎈 Add a role to the Role Claim system",
              options: [
                {
                  type: "ROLE",
                  name: "role",
                  description: "🧮 Choose the role you want to add",
                  required: true,
                },
                {
                  type: "STRING",
                  name: "emoji",
                  description:
                    "😄 Choose the emoji you want to use for this role",
                  required: true,
                },
                {
                  type: "STRING",
                  name: "description",
                  description:
                    "✍️ Choose the description of this role (optional)",
                  required: false,
                },
              ],
            },
            {
              type: "SUB_COMMAND",
              name: "remove",
              description: "🎈 Delete a role from the Role Claim system",
              options: [
                {
                  type: "ROLE",
                  name: "role",
                  description: "🧮 Choose the role you want to delete",
                  required: false,
                },
                {
                  type: "STRING",
                  name: "emoji",
                  description: "😄 Choose the emoji you want to delete",
                  required: false,
                },
              ],
            },
            {
              type: "SUB_COMMAND",
              name: "embed",
              description: "🎈 Edit embed of Role Claim system",
            },
          ],
        },
        {
          type: "SUB_COMMAND_GROUP",
          name: "autorole",
          description:
            "🧮 Assign automatically roles to a newcomer when they join the server",
          options: [
            {
              type: "SUB_COMMAND",
              name: "add",
              description:
                "🧮 Assign a new role to a newcomer when they join the server",
              options: [
                {
                  type: "ROLE",
                  name: "role",
                  description: "🧮 The role to assign to the newcomer",
                  required: true,
                },
              ],
            },
            {
              type: "SUB_COMMAND",
              name: "remove",
              description: "🧮 Remove a role from the list of autoroles",
              options: [
                {
                  type: "ROLE",
                  name: "role",
                  description: "🧮 The role to remove from the list",
                  required: true,
                },
              ],
            },
            {
              type: "SUB_COMMAND",
              name: "list",
              description:
                "🧮 List all roles that will be assigned to a newcomer",
            },
          ],
        },
      ],
    });
  }

  async execute(interaction) {
    const { guild, options } = interaction;

    const fetchGuild = await this.client.getGuild(guild);

    if (options._subcommand === "menu") {
      if (!(await this.client.Defer(interaction))) return;

      return interaction.editReply({
        content: "`🐲 Click the button below`",
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

        let msgId,
          tipMsgId,
          channelId,
          roleRC,
          emojiName,
          emoji,
          isEmojiCustom = false,
          customEmoji,
          foundChannel,
          msg,
          tipMsg,
          fieldValue,
          rolesEmbed;

        msgId = fetchGuild.roleclaim_Msg;
        tipMsgId = fetchGuild.roleclaim_TipMsg;
        channelId = fetchGuild.roleclaim_Cnl;
        if (!channelId || !msgId) {
          return interaction.reply({
            ephemeral: true,
            content:
              "🚫 You need to setup the roleclaim system first.\n\n> Use `/setup channels`",
          });
        }

        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
        } catch (e) {
          return interaction.reply({
            ephemeral: true,
            content:
              "⛔ An error has occurred: Unable to find the role claim message.\n\n> Try to setup the roleclaim system again.\n\n> If the error persists, contact a administrator of Stealthy",
          });
        }

        try {
          tipMsg = await foundChannel.messages.fetch(tipMsgId);
        } catch (e) {}

        roleRC = options.getRole("role");
        if (
          roleRC &&
          this.client.HighestRole(guild, this.client.user.id) <
            roleRC.rawPosition &&
          options._subcommand != "remove"
        ) {
          return interaction.reply({
            ephemeral: true,
            content: `🚫 One of my roles need to be above ${roleRC.toString()} to perform this action.\n\n> You can do this in \`server settings -> roles\``,
          });
        }

        if (roleRC && roleRC.id === guild.id) {
          return interaction.reply({
            ephemeral: true,
            content: `🚫 You can't assign <@&${guild.id}>`,
          });
        }

        emoji = options.getString("emoji");
        if (emoji && emoji.startsWith("<") && emoji.endsWith(">")) {
          if (!(await this.client.IsValidEmoji(this.client, emoji)))
            return interaction.reply({
              ephemeral: true,
              content: `🚫 I can't find \`:${
                emoji.split(":")[1]
              }:\` emoji.\n\n> I need to be in the same server as the emoji`,
            });
          emojiName = emoji;
          isEmojiCustom = true;
        }

        if (emoji && !isEmojiCustom && !this.client.HasEmoji(emoji)) {
          return interaction.reply({
            ephemeral: true,
            content: `🚫 \` ${emoji} \` is not supported.\n\n> Please provide one [emoji](https://emojipedia.org)`,
          });
        }
        if (emoji && !isEmojiCustom)
          emojiName = this.client.GetEmojiNameFromUni(emoji);

        rolesEmbed = this.client
          .Embed(false)
          .setTitle(msg.embeds[0].title)
          .setDescription(msg.embeds[0].description)
          .setFields(msg.embeds[0].fields)
          .setFooter({ text: msg.embeds[0].footer.text })
          .setColor(msg.embeds[0].color);

        switch (options._subcommand) {
          case "embed":
            /*
             * Edit the embed of the role claim message
             */

            await interaction.showModal(
              this.client.ModalRow("edit-roleclaim", "Edit roleclaim embed", [
                {
                  customId: "roleclaim-title-input",
                  label: "Title",
                  style: "SHORT",
                  placeholder: `${msg.embeds[0].title}`,
                  required: false,
                },
                {
                  customId: "roleclaim-description-input",
                  label: "Description",
                  style: "PARAGRAPH",
                  placeholder: `${msg.embeds[0].description}`,
                  required: false,
                },
                {
                  customId: "roleclaim-footer-input",
                  label: "Footer",
                  style: "SHORT",
                  placeholder: `${msg.embeds[0].footer.text}`,
                  required: false,
                },
                {
                  customId: "roleclaim-color-input",
                  label: "Color",
                  style: "SHORT",
                  placeholder: "color must be a hex color code (#000000)",
                  required: false,
                },
              ])
            );

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
              return interaction.editReply(
                `⛔ The role claim message has reached the maximum amount of reactions.\n\n> You can provide up to 20 roles.`
              );
            }

            const fieldsArray = fetchGuild.roleclaim_Fields;

            const emojiAlreadyExist = fieldsArray.filter(
              (f) => emojiName === f.emojiName
            );

            const roleAlreadyExist = fieldsArray.filter(
              (f) => roleRC.id === f.roleId
            );

            if (emojiName && emojiAlreadyExist.length > 0) {
              return interaction.editReply(
                `🚫 \`${
                  isEmojiCustom ? emojiName : `\`${emoji}\``
                }\` is already used with <@&${
                  emojiAlreadyExist[0].roleId
                }>.\n\n> Delete it first with \`/setup roleclaim remove\``
              );
            }

            if (roleRC && roleAlreadyExist.length > 0) {
              return interaction.editReply(
                `🚫 You have already added ${roleRC.toString()} with ${
                  roleAlreadyExist[0].emojiName.startsWith("<")
                    ? roleAlreadyExist[0].emojiName
                    : `\`${this.client.GetEmojiFromName(
                        roleAlreadyExist[0].emojiName
                      )}\`.\n\n> Delete it first with \`/setup roleclaim remove\``
                }`
              );
            }

            const field = {
              emojiName: emojiName,
              roleId: roleRC.id,
            };
            fieldsArray.push(field);

            await this.client.updateGuild(guild, {
              roleclaim_Fields: fieldsArray,
            });

            rolesEmbed.addField(
              `${description ? description : roleRC.name}`,
              emoji,
              true
            );
            msg.react(emoji);

            await msg.edit({
              embeds: [rolesEmbed],
            });

            return interaction.editReply(
              `✅ Added ${roleRC.toString()} with ${
                isEmojiCustom ? emojiName : `\`${emoji}\``
              }`
            );

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
              msg.delete().catch(() => {});
              tipMsg.delete().catch(() => {});

              await this.client.updateGuild(guild, {
                roleclaim_Fields: [],
                roleclaim_Cnl: null,
                roleclaim_Msg: null,
                roleclaim_TipMsg: null,
              });

              return interaction.editReply(
                `❎ Successfully removed role claim system.`
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

              const emojiAlreadyExist = emoji
                ? fetchGuild.roleclaim_Fields.filter(
                    (f) => emojiName === f.emojiName
                  )
                : null;

              const roleAlreadyExist = roleRC
                ? fetchGuild.roleclaim_Fields.filter(
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
                !isEmojiCustom
                  ? (emojiUNI = this.client.GetEmojiFromName(fieldValue))
                  : (customEmoji = fieldValue.split(":")[2].slice(0, -1));

                rolesEmbed.fields.splice(i, 1);
                const filteredField = fetchGuild.roleclaim_Fields
                  .map((u) => u.roleId)
                  .indexOf(
                    roleAlreadyExist
                      ? roleAlreadyExist[0].roleId
                      : roldDB[0].roleId
                  );
                fetchGuild.roleclaim_Fields.splice(filteredField, 1);
                await this.client.updateGuild(guild, {
                  roleclaim_Fields: fetchGuild.roleclaim_Fields,
                });

                await msg.reactions
                  .resolve(!isEmojiCustom ? emojiUNI : customEmoji)
                  .remove();

                await msg.edit({
                  embeds: [rolesEmbed],
                });

                return interaction.editReply(
                  `❎ Removed <@&${roleId}> with ${
                    isEmojiCustom ? fieldValue : `\`${emojiUNI}\``
                  }`
                );
              }
            }
            if (!roleId && roleRC)
              return interaction.editReply(
                `🚫 ${roleRC.toString()} is not used.`
              );

            if (!roleId && emoji)
              return interaction.editReply(
                `🚫 ${
                  emoji.startsWith("<") ? emoji : `\`${emoji}\``
                } is not used.`
              );
            break;
        }

      case "autorole":
        if (!(await this.client.Defer(interaction))) return;
        const roleAR = options.getRole("role");
        const autoroleArray = fetchGuild.autorole_Roles;
        const moreThanOneRole = autoroleArray.length > 1;

        switch (options._subcommand) {
          case "add":
            if (roleAR.id === guild.id) {
              return interaction.editReply(
                `🚫 You can't assign <@&${guild.id}>`
              );
            }

            if (
              this.client.HighestRole(guild, this.client.user.id) <
              roleAR.rawPosition
            ) {
              return interaction.editReply(
                `🚫 One of my roles need to be above ${roleAR.toString()} to perform this action.\n\n> You can do this in \`server settings -> roles\``
              );
            }

            if (autoroleArray.length === 5) {
              return interaction.editReply(
                `🚫 You can't have more than 5 roles assigned.\n\n> Use \`/setup setup autorole list\` to see the list of roles.`
              );
            }

            if (autoroleArray.filter((r) => r == roleAR.id).length > 0) {
              return interaction.editReply(
                `🚫 ${roleAR.toString()} is already in the list.`
              );
            }

            autoroleArray.push(roleAR.id);
            await this.client.updateGuild(guild, {
              autorole_Roles: autoroleArray,
            });

            return interaction.editReply({
              content: `✅ Added autorole ${roleAR.toString()}.`,
              components: [
                this.client.ButtonRow([
                  {
                    customId: "list-autorole",
                    label: "List",
                    style: "PRIMARY",
                    emoji: "📋",
                  },
                  {
                    customId: "reset-autorole",
                    label: "Reset",
                    style: "SECONDARY",
                    emoji: "🗑",
                  },
                ]),
              ],
            });

          case "remove":
            if (!autoroleArray.length > 0)
              return interaction.editReply(
                `🚫 No autorole set.\n\n> Set one with \`/setup autorole add\``
              );

            if (!autoroleArray.filter((r) => r == roleAR.id).length > 0)
              return interaction.editReply(
                `🚫 ${roleAR.toString()} is not in the list.${
                  moreThanOneRole
                    ? `\n\n> Role(s): ${autoroleArray
                        .map((r) => `<@&${r}>`)
                        .join(", ")}`
                    : ""
                }`
              );

            const filteredRole = autoroleArray.indexOf(roleAR.id);
            autoroleArray.splice(filteredRole, 1);
            await this.client.updateGuild(guild, {
              autorole_Roles: autoroleArray,
            });

            return interaction.editReply(
              `❎ Removed autorole ${roleAR.toString()}.${
                moreThanOneRole
                  ? `\n\n> Role(s): ${autoroleArray
                      .map((r) => `<@&${r}>`)
                      .join(", ")}`
                  : ""
              }`
            );

          case "list":
            if (!autoroleArray.length > 0)
              return interaction.editReply(
                `🚫 No autorole set.\n\n> Set one with \`/setup autorole add\``
              );

            return interaction.editReply({
              content: `✅ Roles that will be given to new users: ${autoroleArray
                .map((r) => `<@&${r}>`)
                .join(", ")}`,
              components: [
                this.client.ButtonRow([
                  {
                    customId: "reset-autorole",
                    label: "Reset",
                    style: "SECONDARY",
                    emoji: "🗑",
                  },
                ]),
              ],
            });
        }
    }

    switch (options._subcommand) {
      case "channels":
        if (!(await this.client.Defer(interaction))) return;
        const usage = options.getString("usage");
        const channel = options.getChannel("channel");
        let noParent = false;

        if (usage === "roleclaim") {
          if (channel.type !== "GUILD_TEXT") {
            return interaction.editReply(
              `🚫 **${channel.toString()}** is not a text channel.`
            );
          }

          if (fetchGuild.roleclaim_Msg) {
            let msgId, tipMsgId, channelId, foundChannel, msg, tipMsg;

            msgId = fetchGuild.roleclaim_Msg;
            channelId = fetchGuild.roleclaim_Cnl;
            tipMsgId = fetchGuild.roleclaim_TipMsg;

            if (channelId && msgId && tipMsgId) {
              try {
                foundChannel = guild.channels.cache.get(channelId);
                msg = await foundChannel.messages.fetch(msgId);
                tipMsg = await foundChannel.messages.fetch(tipMsgId);
                msg.delete();
                tipMsg.delete();
              } catch (e) {
                console.log(e);
              }
            }

            this.client.updateGuild(guild, { roleclaim_Roles: [] });
          }

          channel
            .send({
              embeds: [
                this.client
                  .Embed()
                  .setTitle("Role Claim Title")
                  .setDescription(
                    "Role Claim Description\n⬅️ You can also change the color"
                  )
                  .setFooter({
                    text: "Role Claim Footer",
                  }),
              ],
            })
            .then((msg) => {
              try {
                this.client.updateGuild(guild, { roleclaim_Msg: msg.id });
                this.client.updateGuild(guild, { roleclaim_Cnl: channel.id });
              } catch (e) {
                return interaction.editReply(
                  `⛔ An error occured: ${"```"}${
                    e.message
                  }${"```"}\nPlease contact an administrator of the bot for further assistance.`
                );
              }
              channel
                .send({
                  content: "> Add roles with `/setup roleclaim add`",
                })
                .then((msg) => {
                  this.client.updateGuild(guild, { roleclaim_TipMsg: msg.id });
                });
            });

          await this.client.Wait(1000);

          return interaction.editReply({
            content: `✅ Role Claim system created in ${channel.toString()}\n\n> Use the button below to edit the role claim message.`,
            components: [
              this.client.ButtonRow([
                {
                  customId: "edit-roleclaim",
                  label: "Edit",
                  style: "PRIMARY",
                  emoji: "✏️",
                },
                {
                  customId: "delete-roleclaim",
                  label: "Delete",
                  style: "SECONDARY",
                  emoji: "🗑",
                },
              ]),
            ],
          });
        }
        if (usage === "membercount") {
          if (fetchGuild.membercount_Cnl) {
            let channelFound = await guild.channels.cache.get(
              fetchGuild.membercount_Cnl
            );
            if (channelFound) channelFound.delete().catch(() => {});
            await this.client.updateGuild(guild, {
              membercount_Cnl: null,
            });
          }

          let parentFound = channel.type === "GUILD_CATEGORY" ? channel : null;
          if (!parentFound) noParent = true;
          await guild.channels
            .create("Members: ", {
              type: "GUILD_VOICE",
              parent: parentFound,
              permissionOverwrites: [
                {
                  id: this.client.application.id,
                  allow: [Permissions.FLAGS.CONNECT],
                },
                {
                  id: guild.id,
                  allow: [Permissions.FLAGS.VIEW_CHANNEL],
                  deny: [Permissions.FLAGS.CONNECT],
                },
              ],
            })
            .then(async (c) => {
              this.client.UpdateMemberCount(
                guild,
                c.id,
                fetchGuild.membercount_Name
              );

              await this.client.updateGuild(guild, {
                membercount_Cnl: c.id,
              });
            })
            .catch((e) => {
              return interaction.editReply(
                `⛔ An error occured: ${"```"}${
                  e.message
                }${"```"}\nPlease contact an administrator of the bot for further assistance.`
              );
            });

          return interaction.editReply({
            content: `🧾 Member count channel is now set up in ${
              !noParent ? `<#${channel.id}>` : "default category"
            }.`,
            components: [
              this.client.ButtonRow([
                {
                  customId: "rename-membercount",
                  label: "Rename",
                  style: "PRIMARY",
                  emoji: "✏️",
                },
                {
                  customId: "delete-membercount",
                  label: "Delete",
                  style: "SECONDARY",
                  emoji: "🗑",
                },
              ]),
            ],
          });
        }

        if (usage === "jtc") {
          if (fetchGuild.JTC_Cnl) {
            let channelFound = await guild.channels.cache.get(
              fetchGuild.JTC_Cnl
            );

            if (channelFound) channelFound.delete().catch(() => {});
            await this.client.updateGuild(guild, {
              JTC_Cnl: null,
            });
          }

          let parentFound = channel.type === "GUILD_CATEGORY" ? channel : null;
          if (!parentFound) noParent = true;
          await guild.channels
            .create("🔉 Create a channel", {
              type: "GUILD_VOICE",
              parent: parentFound,
            })
            .then(async (c) => {
              async (c) => await c.lockPermissions();
              await this.client.updateGuild(guild, {
                JTC_Cnl: c.id,
              });
            })
            .catch((e) => {
              return interaction.editReply(
                `⛔ An error occured: ${"```"}${
                  e.message
                }${"```"}\nPlease contact an administrator of the bot for further assistance.`
              );
            });
        }

        if (usage === "logs") {
          if (channel.type === "GUILD_CATEGORY")
            return interaction.editReply(
              `🚫 You can't assign a category as a logs channel.`
            );
          await this.client.updateGuild(guild, { logs_Cnl: channel.id });
        }

        interaction.editReply({
          content: `🔥 ${this.client.Capitalize(usage)} is now set up in ${
            !noParent ? `<#${channel.id}>` : "default category"
          }.${
            usage === "roleclaim"
              ? "\n> Add roles with `/setup roleclaim add`"
              : ""
          } ${
            usage === "jtc"
              ? "\n> For more options use the button bellow and select **Join to Create Setup**"
              : ""
          }`,
        });

        if (usage === "jtc") {
          interaction.editReply({
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
        break;
      case "blacklist":
        if (!(await this.client.Defer(interaction))) return;

        const choice = options.getString("choice");
        const format = options.getString("format");
        let time = options.getInteger("time");

        format === "minutes" ? (time *= 60000) : (time *= 3600000);

        if (choice === "blacklist_minimum_age") {
          await this.client.updateGuild(guild, {
            blacklist_MinimumAge: time,
          });
        }

        if (choice === "blacklist_time") {
          await this.client.updateGuild(guild, {
            blacklist_Time: time,
          });
        }

        return interaction.editReply({
          content: `🔒 ${this.client.Capitalize(
            choice.replace(/_/g, " ")
          )} is now set to: \`${this.client.PrettyMs(time, {
            verbose: true,
          })}\``,
        });
    }
  }
};
