const { SelectMenu } = require("sheweny");
const { languageFlags } = require("../../languageList");

module.exports = class SetupMenu2MsgSelect extends SelectMenu {
  constructor(client) {
    super(client, ["setup-select"]);
  }

  async execute(selectMenu) {
    if (!(await this.client.Defer(selectMenu))) return;
    const { guild, member } = selectMenu;
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
        break;
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
              ? "> **🚀 Logs** channel is setup in " +
                `<#${logsChannel}>` +
                ". \n"
              : ""
          } ${
            roleclaimChannel
              ? "> **🗂️ Role claim** channel is setup in " +
                `<#${roleclaimChannel}>` +
                ". \n"
              : ""
          } ${
            membercountChannel
              ? "> **🧾 Member count** channel is setup in " +
                `**${
                  membercountChannel.parent
                    ? `<#${membercountChannel.parentId}>`
                    : "default"
                }**` +
                " category. \n"
              : ""
          } ${
            JTCChannel
              ? "> **🔊 Join to Create** channel is setup in " +
                `**${
                  JTCChannel.parent ? `<#${JTCChannel.parentId}>` : "default"
                }**` +
                " category. \n"
              : ""
          }\nPlease use, \`/setup channels\` command to set up your channels.`,
        });
        break;

      case "jtc_option":
        const findChannel = guild.channels.cache.get(
          fetchGuild.joinToCreate.channel
        );

        //find first category of the server
        const firstCategory = guild.channels.cache
          .filter((c) => c.type == "GUILD_CATEGORY")
          .first();

        if (findChannel) {
          return selectMenu.editReply({
            content: `Use the buttons below to setup your JTC channel.\n\n> JTC channel ${findChannel.toString()} is already setup in **${
              findChannel.parent ? findChannel.parent.toString() : "default"
            }** category.`,
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
          content:
            "Use the button below to setup your JTC channel.\n\n> You can also use `/setup channels` to choose a specific category.",
          components: [
            this.client.ButtonRow([
              {
                customId: "create-JTC",
                label: `Create in ${firstCategory.name}`,
                style: "SUCCESS",
                emoji: "🔉",
              },
            ]),
          ],
        });
        break;

      case "blacklist_option":
        const blacklistTime = fetchGuild.blackList.time;
        const blacklistMinAge = fetchGuild.blackList.minAge;

        selectMenu.editReply({
          content: `> Blacklist length: \`${this.client.PrettyMs(
            blacklistTime,
            {
              verbose: true,
            }
          )}\` ${blacklistTime == 86400000 ? " *(default)*" : ""}
          > Minimum account age required: \`${this.client.PrettyMs(
            blacklistMinAge,
            {
              verbose: true,
            }
          )}\` ${blacklistMinAge == 3600000 ? "*(default)*" : ""}
           \nTo change the blacklist times, please use, \`/setup blacklist\` command.`,
        });

        break;

      case "roleclaim_option":
        const msgId = fetchGuild.roleClaim.message;
        const channelId = fetchGuild.roleClaim.channel;

        if (msgId && channelId) {
          return selectMenu.editReply({
            content: `Role Claim message is setup in **<#${channelId}>**.\n\n>To change the roles use, \`/setup roleclaim add/remove\` command.\n> You can edit the role claim message with the button bellow or with \`/setup roleclaim embed\``,
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

        selectMenu.editReply({
          content: `Role Claim is a feature that lets server users pick a specific role by adding a reaction to a message.\nChoose the roles carefully, to maintain the security of your server.\n\n> Please use, \`/setup channels\` command to setup your role claim message in a different channel than ${selectMenu.channel.toString()}.`,
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
        break;
    }
  }
};
