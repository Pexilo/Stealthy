const { Button } = require("sheweny");
const { PermissionFlagsBits } = require("discord.js");

module.exports = class verifyButton extends Button {
  constructor(client) {
    super(client, ["verify", /verify-.*/, "verify-edit"]);
  }

  async execute(button) {
    const { guild, member } = button;
    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { verify } = this.client.la[lang].interactions.buttons;

    const me = await guild.members.fetchMe();
    const requiredPerms = ["ManageRoles"];

    if (!me.permissions.has(PermissionFlagsBits.ManageRoles))
      return selectMenu.editReply({
        content: eval(errors.error52),
      });

    const role = guild.roles.cache.get(fetchGuild.verify.role);
    if (!role)
      return button.editReply({
        content: errors.error54,
      });

    switch (button.customId) {
      case "verify":
        if (!(await this.client.Defer(button))) return;

        // check the member verification
        if (member.roles.cache.has(role.id))
          return button.editReply({
            content: verify.alreadyVerified,
          });

        // check if the captcha is disabled
        if (!fetchGuild.moderationTools.enabled.includes("verifyCaptcha")) {
          member.roles.add(role).catch(() => undefined);
          return button.editReply({ content: verify.reply1 });
        }

        // generate sequence and send it with the button id
        const sequence = await this.client.GenerateCaptcha();
        button.editReply({
          embeds: [
            this.client
              .Embed()
              .setTitle(verify.embed1.title)
              .setDescription(verify.embed1.description)
              .setFields({
                name: verify.embed1.field1,
                value: `\`\`\`${sequence}\`\`\``,
              }),
          ],
          components: [
            this.client.ButtonRow([
              {
                customId: `verify-${sequence}`,
                label: verify.button1,
                style: "SECONDARY",
                emoji: "🤖",
              },
            ]),
          ],
        });
        break;

      case "verify-edit":
        if (!(await this.client.Defer(button))) return;

        button.editReply({
          content: verify.reply2,
          components: [
            this.client.ButtonRow([
              {
                customId: "verify-captcha-tool-enable",
                label: verify.button2,
                style: "SECONDARY",
                emoji: "✅",
              },
              {
                customId: "verify-captcha-tool-disable",
                label: verify.button3,
                style: "SECONDARY",
                emoji: "❌",
              },
            ]),
          ],
        });
        break;

      case button.customId.match(/verify\-.{5}/g)[0]: // verify-xxxxx
        // get the sequence and send it with the modal id
        const sendSequence = button.customId.split("-")[1];
        await button.showModal(
          this.client.ModalRow(`verify-${sendSequence}`, verify.modal1.title, [
            {
              customId: "verify-input",
              label: verify.modal1.field1,
              style: "Short",
              placeholder: `${sendSequence}`,
              required: true,
            },
          ])
        );
    }
  }
};
