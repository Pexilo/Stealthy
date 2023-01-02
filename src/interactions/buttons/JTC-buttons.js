const { Button } = require("sheweny");
const {
  ChannelType,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");

module.exports = class JTCSetupButtons extends Button {
  constructor(client) {
    super(client, [
      "create-JTC",
      "delete-JTC",
      "edit-names-JTC",
      "show-names-JTC",
      "reset-JTC-names",
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

    const { guild } = button;
    const me = await guild.members.fetchMe();
    let requiredPerms;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { JTC } = this.client.la[lang].interactions.buttons;

    switch (button.customId) {
      case "create-JTC":
        if (!(await this.client.Defer(button))) return;
        //permissions check
        requiredPerms = [
          "ViewChannel",
          "ManageChannels",
          "ManageRoles",
          "Connect",
          "MoveMembers",
        ];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel |
              PermissionFlagsBits.ManageChannels |
              PermissionFlagsBits.ManageRoles |
              PermissionFlagsBits.Connect |
              PermissionFlagsBits.MoveMembers
          )
        )
          return button.editReply({
            content: eval(errors.error52),
          });

        const JTCChannel = guild.channels.cache.get(
          fetchGuild.joinToCreate.channel
        );

        //if the channel already exists in the database
        if (fetchGuild.joinToCreate.channel) {
          //if the channel is not found, delete the channel in the database and create a new one
          if (!JTCChannel)
            await this.client.UpdateGuild(guild, {
              "joinToCreate.channel": null,
            });
          //if the channel is found, stop the process
          else
            return button.editReply({
              content: errors.error42,
            });
        }

        //find first category of the server
        let noParent = false;
        const firstCategory = guild.channels.cache
          .filter((c) => c.type === ChannelType.GuildCategory)
          .first();
        if (!firstCategory) noParent = true;

        //create the channel in the first category
        await guild.channels
          .create({
            name: JTC.create.name,
            type: ChannelType.GuildVoice,
            parent: noParent ? null : firstCategory,
          })
          .then(async (channel) => {
            channel.lockPermissions();
            await this.client.UpdateGuild(guild, {
              "joinToCreate.channel": channel.id,
            });
            return button.editReply({
              content: eval(JTC.create.reply),
            });
          })
          .catch(() => undefined);

        break;

      case "delete-JTC":
        if (!(await this.client.Defer(button))) return;
        //permissions check
        requiredPerms = ["ManageChannels"];
        if (!me.permissions.has(PermissionFlagsBits.ManageChannels))
          return button.editReply({
            content: eval(errors.error52),
          });

        //if the channel doesn't exist in the database, stop the process
        if (!fetchGuild.joinToCreate.channel) {
          return button.editReply({
            content: errors.error43,
          });
        }

        //get the channel from the database and try to find it in the server
        const channelToDelete = guild.channels.cache.get(
          fetchGuild.joinToCreate.channel
        );

        //delete the database entry
        await this.client.UpdateGuild(guild, {
          "joinToCreate.channel": null,
        });

        //if the channel isn't found, it means that the channel has been deleted in hand
        if (!channelToDelete) {
          return button.editReply(errors.error44);
        }
        //delete the channel
        channelToDelete.delete().catch((e) => {
          return button.editReply(eval(errors.error8));
        });

        return button.editReply({
          content: eval(JTC.delete.reply),
        });

      case "show-names-JTC":
        if (!(await this.client.Defer(button))) return;

        await button.editReply({
          files: [
            new AttachmentBuilder(
              Buffer.from(fetchGuild.joinToCreate.names.join("\n")),

              {
                name: `JTC-names.txt`,
              }
            ),
          ],
        });
        break;

      case "edit-names-JTC":
        const channelNames = fetchGuild.joinToCreate.names.join(", ");

        await button.showModal(
          this.client.ModalRow("edit-names-JTC", "JTC channel names", [
            {
              customId: "channel-JTC-input",
              label: JTC.channelsNames.modal1,
              style: "Paragraph",
              placeholder: `${this.client.Truncate(channelNames)}`,
              required: true,
            },
          ])
        );
        break;

      case "reset-JTC-names":
        if (!(await this.client.Defer(button))) return;

        const defaultNames = [
          "🗻 Everest",
          "🌉 San Francisco",
          "🌅 Bahamas",
          "💳 VIP Room",
          "🏰 Peach Castle",
        ];

        await this.client.UpdateGuild(guild, {
          "joinToCreate.names": defaultNames,
        });

        return button.editReply({
          content: eval(JTC.resetNames.reply),
        });
    }
  }
};
