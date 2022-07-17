const { Event } = require("sheweny");

module.exports = class interactionCreateEvent extends Event {
  constructor(client) {
    super(client, "interactionCreate", {
      description: "new interaction",
    });
  }

  async execute(interaction) {
    const { guild } = interaction;

    let fetchGuild = await this.client.getGuild(guild);

    if (!fetchGuild) {
      await this.client.createGuild(guild);
      return this.client.channels.cache.get(guild.systemChannelId).send({
        content:
          "⚠️ Database has been reset, all data of this server has been lost.\nSorry for the inconvenience.\n\n`Server initialized ✅`",
        components: [
          this.client.ButtonRow([
            {
              customId: "setup-menu",
              label: "Setup",
              style: "SECONDARY",
              emoji: "🔧",
            },
          ]),
        ],
      });
    }

    // lazy fix because permissions are terrible to setup, WIP ig
    if (!guild.me.permissions.has("ADMINISTRATOR")) {
      return interaction.reply({
        content:
          "🚫 I need the `ADMINISTRATOR` permission to operate properly.",
        ephemeral: true,
      });
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "channels-names-JTC") {
        //get input from modal
        const channels =
          interaction.fields.getTextInputValue("channel-JTC-input");

        //split channel names remove spaces, line breaks, empty strings
        const result = channels
          .replace(/[\n\r]/g, "")
          .split(",")
          .filter((n) => n.length !== 0)
          .map((n) => n.trim());

        let list = "";
        result.forEach((element) => {
          list += "➜ " + element + "\n";
        });

        await this.client.updateGuild(guild, {
          "joinToCreate.names": result,
        });

        await interaction.reply({
          content: `✅ New JTC channel names:\n${list}`,
          ephemeral: true,
        });
      }
      if (interaction.customId === "edit-roleclaim") {
        const msgId = fetchGuild.roleClaim.message;
        const channelId = fetchGuild.roleClaim.channel;

        let foundChannel, msg;

        try {
          foundChannel = guild.channels.cache.get(channelId);
          msg = await foundChannel.messages.fetch(msgId);
        } catch (e) {
          return interaction.reply({
            content:
              "⛔ An error has occurred: Unable to find the role claim message.\n\n> Try to setup the roleclaim system again.\n\n> If the error persists, contact a administrator of Stealthy",
            ephemeral: true,
          });
        }

        let rolesEmbed = this.client
          .Embed(false)
          .setTitle(msg.embeds[0].title)
          .setDescription(msg.embeds[0].description)
          .setFields(msg.embeds[0].fields)
          .setFooter({ text: msg.embeds[0].footer.text })
          .setColor(msg.embeds[0].color);

        //get all fields
        const title = interaction.fields.getTextInputValue(
          "roleclaim-title-input"
        );
        const description = interaction.fields.getTextInputValue(
          "roleclaim-description-input"
        );
        const footer = interaction.fields.getTextInputValue(
          "roleclaim-footer-input"
        );
        const color = interaction.fields.getTextInputValue(
          "roleclaim-color-input"
        );

        if (title) rolesEmbed.setTitle(title);
        if (description) rolesEmbed.setDescription(description);
        if (footer) rolesEmbed.setFooter({ text: footer });
        if (color) {
          try {
            rolesEmbed.setColor(color);
          } catch (e) {
            return interaction.reply({
              content: `🚫 Invalid color.\n\n> Please use a hexadecimal color code.\n\n> For example: \`#ff0000\``,
              ephemeral: true,
            });
          }
        }

        if (!title && !description && !footer && !color)
          return interaction.reply({
            content: "🚫 No changes made.",
            ephemeral: true,
          });

        await msg.edit({
          embeds: [rolesEmbed],
        });

        await interaction.reply({
          content: "✅ Roleclaim embed updated.",
          ephemeral: true,
        });
      }
      if (interaction.customId === "channel-membercount") {
        const name = interaction.fields.getTextInputValue(
          "membercount-name-input"
        );

        if (!name) {
          return interaction.reply({
            content: "🚫 No changes made.",
            ephemeral: true,
          });
        }

        await this.client.updateGuild(guild, {
          "memberCount.name": name,
        });

        const memberCountChannel = guild.channels.cache.get(
          fetchGuild.memberCount.channel
        );

        if (!memberCountChannel) {
          return interaction.reply({
            content: "🚫 Unable to find the member count channel.",
            ephemeral: true,
          });
        }

        this.client.UpdateMemberCount(
          guild,
          fetchGuild.memberCount.channel,
          name
        );

        await interaction.reply({
          content: "✅ Member count channel updated.",
          ephemeral: true,
        });
      }
    }
  }
};
