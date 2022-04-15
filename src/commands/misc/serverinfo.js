const { Command } = require("sheweny");
const { Formatters } = require("discord.js");

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "serverinfo",
      description: "❔ Get information about the server.",
      examples: "/serverinfo => Get server information",
      category: "Misc",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    const creationTimestamp = this.client.Formatter(guild.createdAt);
    const relativeCreationTimestamp = this.client.Formatter(
      guild.createdAt,
      Formatters.TimestampStyles.RelativeTime
    );

    const filterLevels = {
      DISABLED: "Off",
      MEMBERS_WITHOUT_ROLES: "No Role",
      ALL_MEMBERS: "Everyone",
    };

    const verificationLevels = {
      NONE: "❎",
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "(╯°□°）╯︵ ┻━┻",
      VERY_HIGH: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻",
    };

    const boostLevel = {
      NONE: "❎",
      TIER_1: "Level 1",
      TIER_1: "Level 2",
      TIER_1: "Level 3",
    };

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
          value: `${creationTimestamp} - ${relativeCreationTimestamp}`,
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
        },
        {
          name: "💰 " + "Server Boost" + ":",
          value: `${"```"}${boostLevel[guild.premiumTier]}${"```"}`,
          inline: true,
        }
      );

    if (guild.description != null) {
      serverinfo.setDescription(
        `Owner: ${owner.user.toString()}\n${"```"}${guild.description}${"```"}`
      );
    }

    if (guild.premiumSubscriptionCount != 0) {
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
      ephemeral: true,
    });
  }
};
