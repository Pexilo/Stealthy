const { Button } = require("sheweny");

module.exports = class roleClaimButtons extends Button {
  constructor(client) {
    super(client, ["create-roleclaim", "delete-roleclaim", "edit-roleclaim"]);
  }

  async execute(button) {
    const { guild, channel } = button;

    const fetchGuild = await this.client.getGuild(guild);

    const msgId = fetchGuild.roleclaim_Msg;
    const channelId = fetchGuild.roleclaim_Cnl;
    const tipMsgId = fetchGuild.roleclaim_TipMsg;
    let foundChannel, msg, tipMsg;

    switch (button.customId) {
      case "create-roleclaim":
        if (!(await this.client.Defer(button))) return;

        this.client.updateGuild(guild, { roleclaim_Roles: [] });

        channel
          .send({
            embeds: [
              this.client
                .Embed()
                .setTitle("Role Claim Title")
                .setDescription(
                  "Role Claim Description\n⬅️ You can also change the color"
                )
                .setFooter({
                  text: "Role Claim Footer",
                }),
            ],
          })
          .then((msg) => {
            try {
              this.client.updateGuild(guild, { roleclaim_Msg: msg.id });
              this.client.updateGuild(guild, { roleclaim_Cnl: channel.id });
            } catch (e) {
              return interaction.editReply(
                `⛔ An error occured: ${"```"}${
                  e.message
                }${"```"}\nPlease contact an administrator of the bot for further assistance.`
              );
            }
            channel
              .send("> Add roles with `/setup roleclaim add`")
              .then((msg) => {
                this.client.updateGuild(guild, { roleclaim_TipMsg: msg.id });
              });
          });

        await this.client.Wait(1000);

        return button.editReply({
          content:
            "✅ Role Claim system created!\n\n> Use the button below to edit the role claim message.",
          components: [
            this.client.ButtonRow(
              ["edit-roleclaim"],
              ["✏️ Edit"],
              ["SECONDARY"]
            ),
          ],
        });
        break;

      case "edit-roleclaim":
        if (!channelId || !msgId) {
          return button.reply({
            content:
              "🚫 You need to setup the roleclaim system first.\n\n> Use `/setup channels`",
            ephemeral: true,
          });
        }

        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
        } catch (e) {
          return button.reply({
            content:
              "⛔ An error has occurred: Unable to find the role claim message.\n\n> Try to setup the roleclaim system again.\n\n> If the error persists, contact a administrator of Stealthy",
            ephemeral: true,
          });
        }

        await button.showModal(
          this.client.ModalRow("edit-roleclaim", "Edit roleclaim embed", [
            {
              customId: "roleclaim-title-input",
              label: "Title",
              style: "SHORT",
              placeholder: `${msg.embeds[0].title}`,
              required: false,
            },
            {
              customId: "roleclaim-description-input",
              label: "Description",
              style: "PARAGRAPH",
              placeholder: `${msg.embeds[0].description}`,
              required: false,
            },
            {
              customId: "roleclaim-footer-input",
              label: "Footer",
              style: "SHORT",
              placeholder: `${msg.embeds[0].footer.text}`,
              required: false,
            },
            {
              customId: "roleclaim-color-input",
              label: "Color",
              style: "SHORT",
              placeholder: "color must be a hex color code (#000000)",
              required: false,
            },
          ])
        );

      case "delete-roleclaim":
        if (!(await this.client.Defer(button))) return;

        this.client.updateGuild(guild, {
          roleclaim_Roles: [],
          roleclaim_Msg: null,
          roleclaim_Cnl: null,
          roleclaim_TipMsg: null,
        });

        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
          tipMsg = await foundChannel.messages.fetch(tipMsgId);
          msg.delete();
          tipMsg.delete();
        } catch (e) {}

        return button.editReply({
          content: "❎ Role Claim system deleted!",
        });
    }
  }
};
