const { Button } = require("sheweny");

module.exports = class JTCSetupButtons extends Button {
  constructor(client) {
    super(client, ["create-JTC", "delete-JTC", "channel-JTC"]);
  }
  async execute(button) {
    /*
     * This code could have 3 types of errors / warnings:
     * 1. The user repeats the same request that has already been made -> ex: create a channel that already exists in discord and the database
     * 2. The user has deleted the JTC channel in hand and try to create or delete it (or the channel is not found for x reason) -> ex: channel is found in database but not in discord
     * 3. Discord API errors while creating or deleting the channel (or things that I didn't think of), will throw an error reply
     * -- These 3 types of errors are handle and will not crash the bot
     */

    const { guild, member } = button;

    const fetchGuild = await this.client.getGuild(guild);
    switch (button.customId) {
      case "create-JTC":
        if (!(await this.client.Defer(button))) return;

        const JTCChannel = guild.channels.cache.get(fetchGuild.JTC_Cnl);

        //if the channel already exists in the database
        if (fetchGuild.JTC_Cnl) {
          //if the channel is not found, delete the channel in the database and create a new one
          if (!JTCChannel)
            await this.client.updateGuild(guild, {
              JTC_Cnl: null,
            });
          //if the channel is found, stop the process
          else
            return button.editReply({
              content:
                "⛔ JTC already setup, delete it first in order to create a new one",
            });
        }

        //find first category of the server
        const firstCategory = guild.channels.cache
          .filter((c) => c.type == "GUILD_CATEGORY")
          .first();

        //create the channel in the first category
        const voiceChannel = await guild.channels
          .create("🔉 Create a channel", {
            type: "GUILD_VOICE",
            parent: firstCategory,
          })
          .then(async (channel) => await channel.lockPermissions())
          .catch((e) => {
            return button.editReply(
              `⛔ An error occured: ${"```"}${
                e.message
              }${"```"}\nPlease contact an administrator of the bot for further assistance.`
            );
          });

        //set the channel in the database
        await this.client.updateGuild(guild, {
          JTC_Cnl: voiceChannel.id,
        });

        button.editReply({
          content: `✅ JTC channel created in: **${
            channelToDelete.parent
              ? `<#${channelToDelete.parentId}>`
              : "default"
          }** category.
          \n> You can move it to another category if you want.\n > You can use \`/invite-vc member:\` to invite someone in dm to join your channel.`,
        });
        break;

      case "delete-JTC":
        if (!(await this.client.Defer(button))) return;

        //if the channel doesn't exist in the database, stop the process
        if (!fetchGuild.JTC_Cnl) {
          return button.editReply({
            content: "⛔ JTC channel doesn't exist, create it first",
          });
        }

        //get the channel from the database and try to find it in the server
        const channelToDelete = guild.channels.cache.get(fetchGuild.JTC_Cnl);

        //delete the database entry
        await this.client.updateGuild(guild, {
          JTC_Cnl: null,
        });

        //if the channel isn't found, it means that the channel has been deleted in hand
        if (!channelToDelete) {
          return button.editReply(
            `⛔ JTC channel doesn't exist, maybe it has already been deleted?`
          );
        }
        //delete the channel
        channelToDelete.delete().catch((e) => {
          return button.editReply(
            `⛔ An error occured: ${"```"}${
              e.message
            }${"```"}\nPlease contact an administrator of the bot for further assistance.`
          );
        });

        return button.editReply({
          content: `❎ JTC channel deleted in: **${
            channelToDelete.parent
              ? `<#${channelToDelete.parentId}>`
              : "default"
          }** category\n\n> Note that you can create only one "Join to create" channel per server.`,
        });

      case "channel-JTC":
        const channelNames = fetchGuild.JTC_CnlNames;
        //prepare the modal, intercepted in interactionCreate class (temp)
        await button.showModal(
          this.client.ModalRow("channel-JTC", "JTC channel names", [
            {
              customID: "channel-JTC-input",
              label: "Names (must be separated by a comma)",
              style: "PARAGRAPH",
              placeholder: `${channelNames}`,
              required: true,
            },
          ])
        );
        break;
    }
  }
};
