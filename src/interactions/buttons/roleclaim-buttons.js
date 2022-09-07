const { Button } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class roleClaimButtons extends Button {
  constructor(client) {
    super(client, ["create-roleclaim", "delete-roleclaim", "edit-roleclaim"]);
  }

  async execute(button) {
    const { guild, channel } = button;
    const me = await guild.members.fetchMe();
    let requiredPerms;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { roleclaim } = this.client.la[lang].interactions.buttons;

    const msgId = fetchGuild.roleClaim.message;
    let channelId = fetchGuild.roleClaim.channel;
    const tipMsgId = fetchGuild.roleClaim.tipMessage;
    let foundChannel, msg, tipMsg;

    switch (button.customId) {
      case "create-roleclaim":
        if (!(await this.client.Defer(button))) return;
        //permissions check
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
          return button.editReply({
            content: eval(errors.error52),
          });

        if (channelId && msgId && tipMsgId) {
          try {
            foundChannel = guild.channels.cache.get(channelId);
            msg = await foundChannel.messages.fetch(msgId);
            tipMsg = await foundChannel.messages.fetch(tipMsgId);
            msg.delete();
            tipMsg.delete();
          } catch (e) {}
        }

        this.client.UpdateGuild(guild, { roleclaim_Roles: [] }); // Clear roles if they were already set

        // Send the embed and store Ids in db
        channel
          .send({
            embeds: [
              this.client
                .Embed()
                .setTitle(roleclaim.create.embed1.title)
                .setDescription(roleclaim.create.embed1.description)
                .setFooter({
                  text: roleclaim.create.embed1.footer,
                }),
            ],
          })
          .then((embed) => {
            try {
              this.client.UpdateGuild(guild, {
                "roleClaim.message": embed.id,
                "roleClaim.channel": channel.id,
              });
              channelId = channel.id;
            } catch (e) {
              eval(errors.error8);
            }

            // Tip message for the user
            channel
              .send({
                content: roleclaim.create.tipMsg,
              })
              .then((tip) => {
                this.client.UpdateGuild(guild, {
                  "roleClaim.tipMessage": tip.id,
                });
              });

            return button.editReply({
              content: eval(roleclaim.create.reply),
              components: [
                this.client.ButtonRow([
                  {
                    customId: "edit-roleclaim",
                    label: roleclaim.create.button1,
                    style: "PRIMARY",
                    emoji: "✏️",
                  },
                  {
                    customId: "delete-roleclaim",
                    label: roleclaim.create.button2,
                    style: "SECONDARY",
                    emoji: "🗑",
                  },
                ]),
              ],
            });
          });

        break;

      case "edit-roleclaim":
        //permissions check
        requiredPerms = ["ViewChannel", "ManageMessages"];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel | PermissionFlagsBits.ManageMessages
          )
        )
          return button.reply({
            content: eval(errors.error52),
            ephemeral: true,
          });

        // Check if role claim exists
        if (!channelId || !msgId) {
          return button.reply({
            content: errors.error10,
            ephemeral: true,
          });
        }

        // Check if role claim message exists
        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
        } catch (e) {
          return button.reply({
            content: errors.error11,
            ephemeral: true,
          });
        }

        // Show modal to edit the role claim message embed
        await button.showModal(
          this.client.ModalRow("edit-roleclaim", roleclaim.edit.modal1.title, [
            {
              customId: "roleclaim-title-input",
              label: roleclaim.edit.modal1.input1,
              style: "Short",
              placeholder: `${this.client.Truncate(msg.embeds[0].title)}`,
              required: false,
            },
            {
              customId: "roleclaim-description-input",
              label: roleclaim.edit.modal1.input2,
              style: "Paragraph",
              placeholder: `${this.client.Truncate(msg.embeds[0].description)}`,
              required: false,
            },
            {
              customId: "roleclaim-footer-input",
              label: roleclaim.edit.modal1.input3,
              style: "Short",
              placeholder: `${this.client.Truncate(msg.embeds[0].footer.text)}`,
              required: false,
            },
            {
              customId: "roleclaim-color-input",
              label: roleclaim.edit.modal1.input4.label,
              style: "Short",
              placeholder: roleclaim.edit.modal1.input4.placeholder,
              required: false,
            },
          ])
        );

        break;

      case "delete-roleclaim":
        if (!(await this.client.Defer(button))) return;
        //permissions check
        requiredPerms = ["ViewChannel", "ManageMessages"];
        if (
          !me.permissions.has(
            PermissionFlagsBits.ViewChannel | PermissionFlagsBits.ManageMessages
          )
        )
          return button.editReply({
            content: eval(errors.error52),
          });

        if (!fetchGuild.roleClaim.message) {
          return button.editReply({
            content: errors.error47,
          });
        }

        // Clear db
        const roleClaimObj = {
          message: null,
          type: "reaction",
          channel: null,
          tipMessage: null,
          fields: [],
        };
        this.client.UpdateGuild(guild, {
          roleClaim: roleClaimObj,
        });

        // Delete role claim messages if found
        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
          tipMsg = await foundChannel.messages.fetch(tipMsgId);
          msg.delete();
          tipMsg.delete();
        } catch (e) {}

        return button.editReply({
          content: roleclaim.delete.reply,
        });
    }
  }
};
