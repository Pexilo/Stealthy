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
                `**<#${membercountChannel.parentId}>**` +
                ". \n"
              : ""
          } ${
            JTCChannel
              ? "> **Join to Create** channel is setup in " +
                `**<#${JTCChannel.parentId}>**` +
                ". \n"
              : ""
          }\nPlease use, \`/setup channels\` command to set up your channels.`,
        });
        break;

      case "jtc_option":
        // this entry will be used across files to know who is interacting with the bot (because one reply is not ephemeral)
        /* This is a way to know who is interacting with the bot (because one reply is not ephemeral). */
        await this.client.updateGuild(guild, {
          JTC_setup_pending: member.user.id,
        });

        const findChannel = guild.channels.cache.get(fetchGuild.JTC_Cnl);

        selectMenu.editReply({
          content: `Use the buttons below to setup your JTC channel.${
            findChannel
              ? `\n\n> JTC channel ${findChannel.toString()} is already setup in **${findChannel.parent.toString()}** category.`
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
        // GetBlacklistTimes function return 2 variables
        const blacklistTime = await GetBlacklistTimes(guild.id, "time");
        const blacklistMinAge = await GetBlacklistTimes(
          guild.id,
          "minimum_age"
        );

        // steps variable is used to know how many steps the user did to setup the blacklist
        let steps = 0;
        !blacklistTime.isDefault ? steps++ : null;
        !blacklistMinAge.isDefault ? steps++ : null;

        selectMenu.editReply({
          content: `> Blacklist time: \`${this.client.PrettyMs(
            blacklistTime.time,
            {
              verbose: true,
            }
          )}\` ${blacklistTime.isDefault ? " *(default)*" : ""}
          > Minimum account age required: \`${this.client.PrettyMs(
            blacklistMinAge.time,
            {
              verbose: true,
            }
          )}\` ${blacklistMinAge.isDefault ? "*(default)*" : ""}
           ${
             steps < 2
               ? `\nYou have filled **${steps} piece(s)** of information.\nTo complete the blacklist system use,`
               : "\nTo setup the blacklist system, please use,"
           } \`/setup blacklist\` command.`,
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
