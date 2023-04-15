const { SelectMenu } = require("sheweny");
const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { supportedLanguages } = require("../../languages/supportedLanguages");

module.exports = class setupSecondSelect extends SelectMenu {
  constructor(client) {
    super(client, ["setup-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild } = selectMenu;

    const me = await guild.members.fetchMe();
    let requiredPerms;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { setupSecond } = this.client.la[lang].interactions.selectMenus;

    switch (selectMenu.values[0]) {
      case "lang_option":
        const languageRow = this.client.SelectMenuRow(
          "language-select",
          setupSecond.lang.select1.title
        );

        const defaultLanguage = fetchGuild.language;
        for (const [key, value] of Object.entries(supportedLanguages)) {
          languageRow.components[0].addOptions({
            label: key,
            value: `${key}_option`,
            emoji: value,
            default: key == defaultLanguage ? true : false,
          });
        }

        return selectMenu.editReply({
          content: eval(setupSecond.lang.reply),
          components: [languageRow],
        });

      case "channel_option":
        requiredPerms = ["ViewChannel", "SendMessages", "EmbedLinks"];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel |
              PermissionFlagsBits.SendMessages |
              PermissionFlagsBits.EmbedLinks
          )
        )
          return selectMenu.editReply({
            content: eval(errors.error52),
          });

        //can't change right here channels Id's, notify user to do it manually with /setup channels
        const logsChannel = fetchGuild.logs.channel;
        const roleclaimChannel = fetchGuild.roleClaim.channel;
        const verifyChannel = fetchGuild.verify.channel;
        const membercountChannel = guild.channels.cache.get(
          fetchGuild.memberCount.channel
        );
        const JTCChannel = guild.channels.cache.get(
          fetchGuild.joinToCreate.channel
        );

        selectMenu.editReply({
          content: eval(setupSecond.channels.reply),
        });

        if (
          logsChannel ||
          roleclaimChannel ||
          membercountChannel ||
          JTCChannel ||
          verifyChannel
        ) {
          let buttons = [];
          if (logsChannel) {
            buttons.push({
              customId: "setup-logs",
              label: setupSecond.channels.button1,
              style: "SECONDARY",
              emoji: "🚀",
            });
          }

          if (roleclaimChannel) {
            buttons.push({
              customId: "edit-roleclaim",
              label: setupSecond.channels.button2,
              style: "SECONDARY",
              emoji: "🗂️",
            });
          }

          if (membercountChannel) {
            buttons.push({
              customId: "rename-membercount",
              label: setupSecond.channels.button3,
              style: "SECONDARY",
              emoji: "🧾",
            });
          }

          if (JTCChannel) {
            buttons.push(
              {
                customId: "edit-names-JTC",
                label: setupSecond.channels.button4,
                style: "SECONDARY",
                emoji: "🔊",
              },
              {
                customId: "show-names-JTC",
                label: setupSecond.channels.button6,
                style: "SECONDARY",
                emoji: "🔊",
              }
            );
          }

          if (verifyChannel) {
            buttons.push({
              customId: "verify-edit",
              label: setupSecond.channels.button5,
              style: "SECONDARY",
              emoji: "🔎",
            });
          }

          return selectMenu.editReply({
            components: [this.client.ButtonRow(buttons)],
          });
        }
        break;

      case "verify_option":
        requiredPerms = ["ViewChannel", "EmbedLinks", "ManageRoles"];

        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel |
              PermissionFlagsBits.EmbedLinks |
              PermissionFlagsBits.ManageRoles
          )
        )
          return selectMenu.editReply({
            content: eval(errors.error52),
          });

        let verifyCnl, verifyMsg;

        if (fetchGuild.verify.channel) {
          verifyCnl = await guild.channels
            .fetch(fetchGuild.verify.channel)
            .catch(() => undefined);
        }

        if (fetchGuild.verify.message) {
          verifyMsg = await verifyCnl.messages
            .fetch(fetchGuild.verify.message)
            .catch(() => undefined);
        }

        selectMenu.editReply({
          content: eval(setupSecond.verify.reply),
        });

        if (verifyCnl) {
          return selectMenu.editReply({
            components: [
              this.client.ButtonRow([
                {
                  customId: "verify-edit",
                  label: setupSecond.verify.button1,
                  style: "SECONDARY",
                  emoji: "🔧",
                },
              ]),
            ],
          });
        }
        break;

      case "jtc_option":
        requiredPerms = [
          "ViewChannel",
          "ManageRoles",
          "Connect",
          "MoveMembers",
        ];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel |
              PermissionFlagsBits.ManageRoles |
              PermissionFlagsBits.Connect |
              PermissionFlagsBits.MoveMembers
          )
        )
          return selectMenu.editReply({
            content: eval(errors.error52),
          });

        const findChannel = guild.channels.cache.get(
          fetchGuild.joinToCreate.channel
        );

        //find first category of the server
        let noParent = false;
        const firstCategory = guild.channels.cache
          .filter((c) => c.type === ChannelType.GuildCategory)
          .first();
        if (!firstCategory) noParent = true;

        if (findChannel) {
          return selectMenu.editReply({
            content: eval(setupSecond.jtc.reply1),
            components: [
              this.client.ButtonRow([
                {
                  customId: "edit-names-JTC",
                  label: setupSecond.jtc.button1,
                  style: "PRIMARY",
                  emoji: "🔧",
                },
                {
                  customId: "show-names-JTC",
                  label: setupSecond.jtc.button4,
                  style: "SECONDARY",
                  emoji: "📖",
                },
                {
                  customId: "delete-JTC",
                  label: setupSecond.jtc.button2,
                  style: "SECONDARY",
                  emoji: "🗑",
                },
              ]),
            ],
          });
        }

        return selectMenu.editReply({
          content: eval(setupSecond.jtc.reply2),
          components: [
            this.client.ButtonRow([
              {
                customId: "create-JTC",
                label: eval(setupSecond.jtc.button3),
                style: "SUCCESS",
                emoji: "🔉",
              },
            ]),
          ],
        });

      case "blacklist_option":
        requiredPerms = ["ViewChannel", "ModerateMembers"];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel |
              PermissionFlagsBits.ModerateMembers
          )
        )
          return selectMenu.editReply({
            content: eval(errors.error52),
          });

        const blacklistTime = fetchGuild.blackList.time;
        const blacklistMinAge = fetchGuild.blackList.minAge;
        const blacklistState =
          fetchGuild.moderationTools.enabled.includes("blacklist");

        if (!blacklistState) {
          return selectMenu.editReply({
            content: setupSecond.blacklist.reply1,
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

        return selectMenu.editReply({
          content: eval(setupSecond.blacklist.reply2),
        });

      case "roleclaim_option":
        requiredPerms = [
          "ViewChannel",
          "ManageRoles",
          "AddReactions",
          "EmbedLinks",
          "UseExternalEmojis",
        ];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel |
              PermissionFlagsBits.ManageRoles |
              PermissionFlagsBits.AddReactions |
              PermissionFlagsBits.EmbedLinks |
              PermissionFlagsBits.UseExternalEmojis
          )
        )
          return selectMenu.editReply({
            content: eval(errors.error52),
          });

        const msgId = fetchGuild.roleClaim.message;
        const channelId = fetchGuild.roleClaim.channel;

        if (msgId && channelId) {
          return selectMenu.editReply({
            content: eval(setupSecond.roleclaim.reply1),
            components: [
              this.client.ButtonRow([
                {
                  customId: "edit-roleclaim",
                  label: setupSecond.roleclaim.button1,
                  style: "PRIMARY",
                  emoji: "✏️",
                },
                {
                  customId: "delete-roleclaim",
                  label: setupSecond.roleclaim.button2,
                  style: "SECONDARY",
                  emoji: "🗑",
                },
              ]),
            ],
          });
        }

        return selectMenu.editReply({
          content: eval(setupSecond.roleclaim.reply2),
          components: [
            this.client.ButtonRow([
              {
                customId: "create-roleclaim",
                label: eval(setupSecond.roleclaim.button3),
                style: "SUCCESS",
                emoji: "🗂️",
              },
            ]),
          ],
        });

      case "autorole_option":
        requiredPerms = ["ViewChannel", "ManageRoles"];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel | PermissionFlagsBits.ManageRoles
          )
        )
          return selectMenu.editReply({
            content: eval(errors.error52),
          });

        const autoroleArray = fetchGuild.autoRole.roles;

        if (autoroleArray.length === 0) {
          return selectMenu.editReply({
            content: eval(setupSecond.autorole.reply1),
          });
        }

        return selectMenu.editReply({
          content: eval(setupSecond.autorole.reply2),
          components: [
            this.client.ButtonRow([
              {
                customId: "reset-autorole",
                label: setupSecond.autorole.button1,
                style: "SECONDARY",
                emoji: "🗑",
              },
            ]),
          ],
        });

      case "moderation_option":
        const moderationTools = fetchGuild.moderationTools;

        return selectMenu.editReply({
          components: [
            this.client.SelectMenuRow(
              "moderation-tools-select",
              setupSecond.moderation.select1.title,
              [
                {
                  label: setupSecond.moderation.select1.option1.label,
                  description:
                    setupSecond.moderation.select1.option1.description,
                  value: "blacklist",
                  emoji: "🛡️",
                  default: moderationTools.enabled.includes("blacklist"),
                },
                {
                  label: setupSecond.moderation.select1.option2.label,
                  description:
                    setupSecond.moderation.select1.option2.description,
                  value: "delDcInvites",
                  emoji: "🔗",
                  default: moderationTools.enabled.includes("delDcInvites"),
                },
                {
                  label: setupSecond.moderation.select1.option3.label,
                  description:
                    setupSecond.moderation.select1.option3.description,
                  value: "verifyCaptcha",
                  emoji: "🔎",
                  default: moderationTools.enabled.includes("verifyCaptcha"),
                },
              ],
              { min: 0, max: 3 }
            ),
          ],
        });
    }
  }
};
