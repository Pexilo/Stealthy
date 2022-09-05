const { Command } = require("sheweny");

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "serverinfo",
      nameLocalizations: { fr: "serveurinfo" },
      description: "⛲ Get information about the server.",
      descriptionLocalizations: {
        fr: "⛲ Obtenir des informations sur le serveur.",
        de: "⛲ Informationen über den Server erhalten.",
        "es-ES": "⛲ Obtener información sobre el servidor.",
      },
      examples: "/serverinfo => Get server information",
      usage: "https://i.imgur.com/g7XvucX.png",
      category: "Misc",
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild } = interaction;

    const { lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { serverinfo } = this.client.la[lang].commands.misc;

    const owner = await guild.fetchOwner();

    const filterLevels = serverinfo.filterLevels;
    const verificationLevels = serverinfo.verificationLevels;
    const boostLevel = serverinfo.boostLevel;

    const embed = this.client
      .Embed()
      .setAuthor({
        name: guild.name + " - " + guild.id,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setDescription(eval(serverinfo.embed1.description1))
      .addFields(
        {
          name: serverinfo.embed1.field1,
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
          name: serverinfo.embed1.field2,
          value: `${"```"}${guild.memberCount}${"```"}`,
          inline: true,
        },
        {
          name: serverinfo.embed1.field3,
          value: `${"```"}${guild.maximumBitrate} kb/s${"```"}`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: true,
        },
        {
          name: serverinfo.embed1.field4,
          value: `${"```"}${filterLevels[guild.explicitContentFilter]}${"```"}`,
          inline: true,
        },
        {
          name: serverinfo.embed1.field5,
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
      embed.addFields({
        name: serverinfo.embed1.field6,
        value: `${"```"}${boostLevel[guild.premiumTier]}${"```"}`,
        inline: true,
      });
    }

    if (guild.description != null) {
      embed.setDescription(eval(serverinfo.embed1.description2));
    }

    if (guild.premiumSubscriptionCount !== 0) {
      embed.addFields(
        {
          name: serverinfo.embed1.field7,
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
      embeds: [embed],
    });
  }
};
