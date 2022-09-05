const { Button } = require("sheweny");

module.exports = class memberCountButtons extends Button {
  constructor(client) {
    super(client, ["delete-membercount", "rename-membercount"]);
  }

  async execute(button) {
    const { guild } = button;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { membercount } = this.client.la[lang].interactions.buttons;

    const memberCountChannel = guild.channels.cache.get(
      fetchGuild.memberCount.channel
    );

    if (!memberCountChannel) {
      this.client.UpdateGuild(guild, {
        "memberCount.channel": null,
      });

      return button.reply({
        content: errors.error46,
        ephemeral: true,
      });
    }

    switch (button.customId) {
      case "delete-membercount":
        if (!(await this.client.Defer(button))) return;

        await memberCountChannel.delete().catch((e) => {
          return button.editReply({
            content: eval(errors.error8),
          });
        });

        await this.client.UpdateGuild(guild, {
          "memberCount.channel": null,
          "memberCount.name": "👥 Members",
        });

        return button.editReply({
          content: membercount.reply,
        });

      case "rename-membercount":
        await button.showModal(
          this.client.ModalRow(
            "channel-membercount",
            membercount.modal1.title,
            [
              {
                customId: "membercount-name-input",
                label: membercount.modal1.input1,
                style: "Short",
                placeholder: `${this.client.Truncate(
                  memberCountChannel.name.split(":")[0]
                )}`,
                required: true,
              },
            ]
          )
        );

        break;
    }
  }
};
