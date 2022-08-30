const { SelectMenu } = require("sheweny");
const { ChannelType } = require("discord.js");
const { languageFlags } = require("../../languageList");

module.exports = class SetupMenu2MsgSelect extends SelectMenu {
  constructor(client) {
    super(client, ["setup-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild } = selectMenu;
    const fetchGuild = await this.client.getGuild(guild);

    switch (selectMenu.values[0]) {
      case "lang_option":
        const languageRow = this.client.SelectMenuRow(
          "language-select",
          "Which language do you want to use?"
        );

        const defaultLanguage = fetchGuild.language;
        for (const [key, value] of Object.entries(languageFlags)) {
          languageRow.components[0].addOptions({
            label: key,
            value: `${key}_option`,
            emoji: value,
            default: key == defaultLanguage ? true : false,
          });
        }

        return selectMenu.editReply({
          content: `Good, so you want to ${
            defaultLanguage !== "en" ? "change" : "set up"
          } your language.`,
          components: [languageRow],
        });

      case "channel_option":
        //can't change right here channels Id's, notify user to do it manually with /setup channels
        const logsChannel = fetchGuild.logs.channel;
        const roleclaimChannel = fetchGuild.roleClaim.channel;
        const membercountChannel = guild.channels.cache.get(
          fetchGuild.memberCount.channel
        );
        const JTCChannel = guild.channels.cache.get(
          fetchGuild.joinToCreate.channel
        );

        selectMenu.editReply({
          content: `${
            logsChannel
              ? "> **`🚀` Logs** channel is setup in " +
                `<#${logsChannel}>` +
                ". \n"
              : ""
          } ${
            roleclaimChannel
              ? "> **`🗂️` Role claim** channel is setup in " +
                `<#${roleclaimChannel}>` +
                ". \n"
              : ""
          } ${
            membercountChannel
              ? "> **`🧾` Member count** channel is setup in " +
                `**${
                  membercountChannel.parent
                    ? `<#${membercountChannel.parentId}>`
                    : "default"
                }**` +
                " category. \n"
              : ""
          } ${
            JTCChannel
              ? "> **`🔊` Join to Create** channel is setup in " +
                `**${
                  JTCChannel.parent ? `<#${JTCChannel.parentId}>` : "default"
                }**` +
                " category. \n"
              : ""
          }\nPlease use, \`/setup channels\` command to setup your channels.`,
        });

        if (
          logsChannel ||
          roleclaimChannel ||
          membercountChannel ||
          JTCChannel
        ) {
          let buttons = [];
          if (logsChannel) {
            buttons.push({
              customId: "setup-logs",
              label: "Setup Logs",
              style: "SECONDARY",
              emoji: "🚀",
            });
          }

          if (roleclaimChannel) {
            buttons.push({
              customId: "edit-roleclaim",
              label: "Edit Role Claim message",
              style: "SECONDARY",
              emoji: "🗂️",
            });
          }

          if (membercountChannel) {
            buttons.push({
              customId: "rename-membercount",
              label: "Rename Member Count",
              style: "SECONDARY",
              emoji: "🧾",
            });
          }

          if (JTCChannel) {
            buttons.push({
              customId: "channels-names-JTC",
              label: "Edit Join to Create names",
              style: "SECONDARY",
              emoji: "🔊",
            });
          }

          return selectMenu.editReply({
            components: [this.client.ButtonRow(buttons)],
          });
        }
        break;

      case "jtc_option":
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
            content: `\`🔊\` **Join to Create** is a feature that **cleans up the voice channel space**, by making use of a **single channel to generate new voice channels**.\n\n> JTC channel ${findChannel.toString()} is currently setup in **${
              findChannel.parent ? findChannel.parent.toString() : "default"
            }** category.\n\nPlease use the **buttons below** to **edit** this feature.`,
            components: [
              this.client.ButtonRow([
                {
                  customId: "channels-names-JTC",
                  label: "Setup channel names",
                  style: "PRIMARY",
                  emoji: "🔧",
                },
                {
                  customId: "delete-JTC",
                  label: "Delete",
                  style: "SECONDARY",
                  emoji: "🗑",
                },
              ]),
            ],
          });
        }

        return selectMenu.editReply({
          content: `\`🔊\` **Join to Create** is a feature that **cleans up the voice channel space**, by making use of a **single channel to generate new voice channels**.\n\n> You can also use \`/setup channels\` to choose a different category than **${
            noParent ? "the default one" : firstCategory.name
          }**.`,
          components: [
            this.client.ButtonRow([
              {
                customId: "create-JTC",
                label: `Create ${!noParent ? "in " + firstCategory.name : ""}`,
                style: "SUCCESS",
                emoji: "🔉",
              },
            ]),
          ],
        });

      case "blacklist_option":
        const blacklistTime = fetchGuild.blackList.time;
        const blacklistMinAge = fetchGuild.blackList.minAge;
        const blacklistState =
          fetchGuild.moderationTools.enabled.includes("blacklist");

        if (!blacklistState) {
          return selectMenu.editReply({
            content:
              "`🛡️` Blacklist feature is disabled\n\n> Would you like to activate it?",
            components: [
              this.client.ButtonRow([
                {
                  customId: "blacklist-tool",
                  label: "",
                  style: "SUCCESS",
                  emoji: "✅",
                },
              ]),
            ],
          });
        }

        return selectMenu.editReply({
          content: `\`🛡️\` **Blacklist** is a feature that **prevents freshly created accounts from joining your server**. New accounts are often **bots, scams and adverts** that could be used maliciously to **harm your server users**.\n\nBlacklist is **activated by default**, you can change the times according to **your needs**:\n> \`Blacklist length: ${this.client.PrettyMs(
            blacklistTime,
            {
              verbose: true,
            }
          )}\` ${
            blacklistTime == 86400000 ? " (default)" : ""
          }\n> ↪ *change how long the bot will block the newcomer for.*
          > \`Account age required: ${this.client.PrettyMs(blacklistMinAge, {
            verbose: true,
          })}\` ${
            blacklistMinAge == 3600000 ? " (default)" : ""
          }\n> ↪ *change the minimum age a newcomer must be to join the server.*
           \n\`⏱️\` To change the blacklist times, please use, \`/setup blacklist\` command.`,
        });

      case "roleclaim_option":
        const msgId = fetchGuild.roleClaim.message;
        const channelId = fetchGuild.roleClaim.channel;

        if (msgId && channelId) {
          return selectMenu.editReply({
            content: `\`🗂️\` **Role Claim** is a feature that lets server **users pick a specific role by adding a reaction** to a message.\nChoose the **roles carefully**, to maintain the **security** of your server.\n\n> **Role Claim message** is setup in **<#${channelId}>**.\n> To change the roles use, \`/setup roleclaim add|remove\` command.\n\nYou can **edit the role claim** system with the **buttons bellow**.`,
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

        return selectMenu.editReply({
          content: `\`🗂️\` **Role Claim** is a feature that lets server **users pick a specific role by adding a reaction** to a message.\nChoose the **roles carefully**, to maintain the **security** of your server.\n\n> You can also use \`/setup channels\` to setup your role claim in a different channel than ${selectMenu.channel.toString()}.`,
          components: [
            this.client.ButtonRow([
              {
                customId: "create-roleclaim",
                label: `Create in ${selectMenu.channel.name}`,
                style: "SUCCESS",
                emoji: "🗂️",
              },
            ]),
          ],
        });

      case "autorole_option":
        const autoroleArray = fetchGuild.autoRole.roles;

        if (autoroleArray.length === 0) {
          return selectMenu.editReply({
            content: `\`🎩\` **Auto Role** is a feature that **automatically** gives one or more **roles to a newcomer** on your server.\nChoose the **roles carefully**, to maintain the **security** of your server.\n\n> You can use \`/setup autorole add\` to setup this feature.`,
          });
        }

        return selectMenu.editReply({
          content: `\`🎩\` **Auto Role** is a feature that **automatically** gives one or more **roles to a newcomer** on your server.\nChoose the **roles carefully**, to maintain the **security** of your server.\n\n> You can use, \`/setup autorole add|remove\` to edit this feature.\n\n\`🧮\` **Roles** that will be **given to newcomers**: ${autoroleArray
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

      case "moderation_option":
        const moderationTools = fetchGuild.moderationTools;

        return selectMenu.editReply({
          components: [
            this.client.SelectMenuRow(
              "moderation-tools-select",
              "Manage your tools",
              [
                {
                  label: "Blacklist",
                  description: "Protect your server against bots, scams, etc.",
                  value: "blacklist",
                  emoji: "🛡️",
                  default: moderationTools.enabled.includes("blacklist"),
                },
                {
                  label: "Discord invites suppressor",
                  description:
                    "Automatically deletes invitations sent by non-moderators",
                  value: "delDcInvites",
                  emoji: "🔗",
                  default: moderationTools.enabled.includes("delDcInvites"),
                },
              ],
              { min: 0, max: 2 }
            ),
          ],
        });
    }
  }
};
