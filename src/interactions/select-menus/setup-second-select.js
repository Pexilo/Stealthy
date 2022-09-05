const { SelectMenu } = require("sheweny");
const { ChannelType } = require("discord.js");
const { supportedLanguages } = require("../../languages/supportedLanguages");

module.exports = class setupSecondSelect extends SelectMenu {
  constructor(client) {
    super(client, ["setup-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild } = selectMenu;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
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
          content: eval(setupSecond.channels.reply),
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
            buttons.push({
              customId: "channels-names-JTC",
              label: setupSecond.channels.button4,
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
            content: eval(setupSecond.jtc.reply),
            components: [
              this.client.ButtonRow([
                {
                  customId: "channels-names-JTC",
                  label: setupSecond.jtc.button1,
                  style: "PRIMARY",
                  emoji: "🔧",
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
              ],
              { min: 0, max: 2 }
            ),
          ],
        });
    }
  }
};
