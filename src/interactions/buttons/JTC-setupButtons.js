const { Button } = require("sheweny");

module.exports = class JTCSetupButtonsListener extends Button {
  constructor(client) {
    super(client, [
      "create-JTC",
      "delete-JTC",
      "channel-JTC",
      "confirm-channel-JTC",
    ]);
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
        let error = false;
        const voiceChannel = await guild.channels
          .create("🔉 Create a channel", {
            type: "GUILD_VOICE",
            parent: firstCategory,
          })
          .then(async (channel) => await channel.lockPermissions())
          .catch((e) => {
            button.editReply(
              `⛔ An error occured: ${"```"}${
                e.message
              }${"```"}\nPlease contact an administrator of the bot for further assistance.`
            );
            return (error = true);
          });

        //set the channel in the database
        await this.client.updateGuild(guild, {
          JTC_Cnl: voiceChannel.id,
        });

        button.editReply({
          content: `✅ JTC channel created in: **<#${voiceChannel.parentId}>** category.
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
          content: `❎ JTC channel deleted in: **<#${channelToDelete.parentId}>** category\n\n> Note that you can create only one "Join to create" channel per server.`,
        });

      case "channel-JTC":
        if (fetchGuild.JTC_setup_pending !== member.user.id) {
          return button.reply({
            ephemeral: true,
            content: `⛔ You can't change the JTC channel names: 
            > 1. You are not the one who requested it.
            > 2. You just changed it, to change it again use the setup button with \`/help\` command.`,
          });
        }

        if (
          fetchGuild.JTC_setup_pending_replied === true ||
          fetchGuild.JTC_Cnl === null
        ) {
          await this.client.updateGuild(guild, {
            JTC_setup_pending_replied: false,
          });
        }

        const channelNames = fetchGuild.JTC_CnlNames;
        let messageAlreadySent = true;

        await button.message.delete().catch((e) => {
          messageAlreadySent = false;
        });
        if (messageAlreadySent) return;

        if (!(await this.client.Defer(button))) return;

        button.editReply({
          content: `🔧 To setup the channel names for JTC, please reply in the chat with the correct format. *(use commas to seperate each name)*.
          \n> **Example:** \`🗻 Everest, 🌉 San Francisco, 🌅 Bahamas, 💳 VIP Room, 🏰 Peach Castle\`
          ${
            channelNames
              ? `\n> **Channels names for this server:** \`${channelNames}\``
              : ""
          }`,
        });

        break;

      case "confirm-channel-JTC":
        if (fetchGuild.JTC_setup_pending !== member.user.id)
          return button.reply({
            ephemeral: true,
            content: `⛔ You can't change the JTC channel names, you are not the one who requested it.`,
          });

        if (!(await this.client.Defer(button))) return;

        const channelJTC = fetchGuild.JTC_Cnl;
        button.editReply({
          content: `✅ Done! ${
            channelJTC
              ? "You can now join " +
                `<#${channelJTC}>` +
                " to try out the new channel names."
              : "You can create a JTC channel by using the setup menu with `/help` command."
          }`,
        });

        await this.client.updateGuild(guild, {
          JTC_setup_pending: null,
          JTC_setup_pending_replied: null,
        });
        await button.message.delete();
        break;
    }
  }
};
