const { Command } = require("sheweny");
const { Formatters } = require("discord.js");

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "serverinfo",
      type: "SLASH_COMMAND",
      description: "Show information about the server you are in.",
      category: "Misc",
    });
  }
  async execute(interaction) {
    return;
    if (!(await this.client.Defer(interaction))) return;

    const lang = GetLanguage(interaction.guild.id);

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
      .setDescription(
        `${await FastTranslate(
          Serverinfo.Embed.description,
          lang
        )}: ${owner.user.toString()}`
      )
      .addFields(
        {
          name:
            "📅 " +
            `${await FastTranslate(Serverinfo.Embed.field1, lang)}` +
            ":",
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
          name:
            "👤 " +
            `${await FastTranslate(Serverinfo.Embed.field2, lang)}` +
            ":",
          value: `${"```"}${guild.memberCount}${"```"}`,
          inline: true,
        },
        {
          name:
            "🗣️ " +
            `${await FastTranslate(Serverinfo.Embed.field3, lang)}` +
            ":",
          value: `${"```"}${guild.maximumBitrate} kb/s${"```"}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name:
            "🔒 " +
            `${await FastTranslate(Serverinfo.Embed.field4, lang)}` +
            ":",
          value: `${"```"}${await FastTranslate(
            filterLevels[guild.explicitContentFilter],
            lang
          )}${"```"}`,
          inline: true,
        },
        {
          name:
            "🔐 " +
            `${await FastTranslate(Serverinfo.Embed.field5, lang)}` +
            ":",
          value: `${"```"}${await FastTranslate(
            verificationLevels[guild.verificationLevel],
            lang
          )}${"```"}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name:
            "💰 " +
            `${await FastTranslate(Serverinfo.Embed.field6, lang)}` +
            ":",
          value: `${"```"}${await FastTranslate(
            boostLevel[guild.premiumTier],
            lang
          )}${"```"}`,
          inline: true,
        }
      );

    if (guild.description != null) {
      serverinfo.setDescription(
        `${await FastTranslate(
          Serverinfo.Embed.description,
          lang
        )}: ${owner.user.toString()}\n${"```"}${guild.description}${"```"}`
      );
    }

    if (guild.premiumSubscriptionCount != 0) {
      serverinfo.addFields(
        {
          name:
            "🪙 " +
            `${await FastTranslate(Serverinfo.Embed.field7, lang)}` +
            ":",
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
