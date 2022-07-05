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

        const defaultLanguage = fetchGuild.default_Lang;
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
        //can't change right here channels ID's, notify user to do it manually with /setup channels
        const logsChannel = fetchGuild.logs_Cnl;
        const roleclaimChannel = fetchGuild.roleclaim_Cnl;
        const membercountChannel = guild.channels.cache.get(
          fetchGuild.membercount_Cnl
        );
        const JTCChannel = guild.channels.cache.get(fetchGuild.JTC_Cnl);

        selectMenu.editReply({
          content: `${
            logsChannel
              ? "> **Logs** channel is setup in " + `<#${logsChannel}>` + ". \n"
              : ""
          } ${
            roleclaimChannel
              ? "> **Role claim** channel is setup in " +
                `<#${roleclaimChannel}>` +
                ". \n"
              : ""
          } ${
            membercountChannel
              ? "> **Member count** channel is setup in " +
                `**${
                  membercountChannel.parent
                    ? `<#${membercountChannel.parentId}>`
                    : "default"
                }**` +
                " category. \n"
              : ""
          } ${
            JTCChannel
              ? "> **Join to Create** channel is setup in " +
                `**${
                  JTCChannel.parent ? `<#${JTCChannel.parentId}>` : "default"
                }**` +
                " category. \n"
              : ""
          }\nPlease use, \`/setup channels\` command to set up your channels.`,
        });
        break;

      case "jtc_option":
        const findChannel = guild.channels.cache.get(fetchGuild.JTC_Cnl);
        console.log("🚀 ~ findChannel", findChannel);

        selectMenu.editReply({
          content: `Use the buttons below to setup your JTC channel.${
            findChannel
              ? `\n\n> JTC channel ${findChannel.toString()} is already setup in **${
                  findChannel.parent ? findChannel.parent.toString() : "default"
                }** category.`
              : ""
          }`,
          components: [
            this.client.ButtonRow(
              ["create-JTC", "delete-JTC", "channel-JTC"],
              ["Create", "Delete", "🔧 Setup channel names"],
              ["SUCCESS", "DANGER", "SECONDARY"]
            ),
          ],
        });
        break;

      case "blacklist_option":
        const blacklistTime = fetchGuild.blacklist_Time;
        const blacklistMinAge = fetchGuild.blacklist_MinimumAge;

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
        selectMenu.editReply({
          content: `Please use, \`/setup roleclaim\` command to setup your roleclaim.`,
          components: [
            this.client.SelectMenuRow(
              "roleclaim-select",
              "Which role do you want to add?"
            ),
          ],
        });
        break;
    }
  }
};
