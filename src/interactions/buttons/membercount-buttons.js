const { Button } = require("sheweny");

module.exports = class memberCountButtons extends Button {
  constructor(client) {
    super(client, ["delete-membercount", "rename-membercount"]);
  }

  async execute(button) {
    const { guild, member } = button;

    const fetchGuild = await this.client.getGuild(guild);

    const memberCountChannel = guild.channels.cache.get(
      fetchGuild.memberCount.channel
    );

    if (!memberCountChannel) {
      this.client.updateGuild(guild, {
        "memberCount.channel": null,
      });

      return button.reply({
        content: "🚫 Membercount channel not found",
        ephemeral: true,
      });
    }

    switch (button.customId) {
      case "delete-membercount":
        if (!(await this.client.Defer(button))) return;

        await memberCountChannel.delete().catch((e) => {
          return button.editReply({
            content: `⛔ An error occured: ${"```"}${
              e.message
            }${"```"}\nPlease contact an administrator of the bot for further assistance.`,
          });
        });

        await this.client.updateGuild(guild, {
          "memberCount.channel": null,
          "memberCount.name": "👥 Members",
        });

        return button.editReply({
          content: "❎ Membercount channel deleted",
        });

      case "rename-membercount":
        await button.showModal(
          this.client.ModalRow(
            "channel-membercount",
            "Change member count channel",
            [
              {
                customId: "membercount-name-input",
                label: "Name",
                style: "SHORT",
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
