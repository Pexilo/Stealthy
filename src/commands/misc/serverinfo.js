const { Command } = require("sheweny");

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "serverinfo",
      description: "⛲ Get information about the server.",
      examples: "/serverinfo => Get server information",
      usage: "https://i.imgur.com/g7XvucX.png",
      category: "Misc",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const { guild } = interaction;
    const owner = await guild.fetchOwner();

    const filterLevels = ["Off", "No Role", "Everyone"];

    const verificationLevels = ["❎", "Low", "Medium", "High", "Very High"];

    const boostLevel = ["❎", "Level 1", "Level 2", "Level 3"];

    const serverinfo = this.client
      .Embed()
      .setAuthor({
        name: guild.name + " - " + guild.id,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setDescription(`Owner: ${owner.user.toString()}`)
      .addFields(
        {
          name: "📅 " + "Creation date" + ":",
          value: `${this.client.Formatter(
            guild.createdAt
          )} - ${this.client.Formatter(guild.createdAt, "R")}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name: "👤 " + "Members" + ":",
          value: `${"```"}${guild.memberCount}${"```"}`,
          inline: true,
        },
        {
          name: "🗣️ " + "Maximum bitrate" + ":",
          value: `${"```"}${guild.maximumBitrate} kb/s${"```"}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name: "🔒 " + "Filter level" + ":",
          value: `${"```"}${filterLevels[guild.explicitContentFilter]}${"```"}`,
          inline: true,
        },
        {
          name: "🔐 " + "Verification" + ":",
          value: `${"```"}${
            verificationLevels[guild.verificationLevel]
          }${"```"}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        }
      );

    if (guild.premiumTier !== 0) {
      serverinfo.addFields({
        name: "💰 " + "Server Boost" + ":",
        value: `${"```"}${boostLevel[guild.premiumTier]}${"```"}`,
        inline: true,
      });
    }

    if (guild.description != null) {
      serverinfo.setDescription(
        `Owner: ${owner.user.toString()}\n${"```"}${guild.description}${"```"}`
      );
    }

    if (guild.premiumSubscriptionCount !== 0) {
      serverinfo.addFields(
        {
          name: "🪙 " + "Boost" + ":",
          value: `${"```"}${guild.premiumSubscriptionCount}${"```"}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        }
      );
    }

    interaction.editReply({
      embeds: [serverinfo],
    });
  }
};
