const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class UnSlowCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unslow",
      nameLocalizations: {},
      description: "🐇 Remove the slowmode of a channel.",
      descriptionLocalizations: {
        fr: "🐇 Retirer le slowmode d'un salon.",
        de: "🐇 Entferne den Slowmode eines Kanals.",
        "es-ES": "🐇 Elimina el modo lento de un canal.",
      },
      examples:
        "/unslow `channel:#general` => 🕒 Remove the slowmode of `#general` channel",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ViewChannel", "ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon", de: "kanal", "es-ES": "canal" },
          description: "📙 Channel to remove the slowmode from",
          descriptionLocalizations: {
            fr: "📙 Salon sur lequel retirer le slowmode",
            de: "📙 Kanal, von dem der Slowmode entfernt werden soll",
            "es-ES": "📙 Canal del que eliminar el modo lento",
          },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the slowmode",
          descriptionLocalizations: {
            fr: "❔ Raison du slowmode",
            de: "❔ Grund für den Slowmode",
            "es-ES": "❔ Razón del modo lento",
          },
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild, member } = interaction;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { unslow } = this.client.la[lang].commands.admin;

    const channel = options.getChannel("channel");
    if (!channel) return interaction.editReply(errors.error4);
    const reason = options.getString("reason");

    try {
      await channel.setRateLimitPerUser(0, eval(unslow.auditlog));
    } catch (e) {
      return interaction.editReply(errors.error27);
    }

    interaction.editReply(eval(unslow.reply));

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;
    if (!logsChannel || !enabledLogs.includes("channels")) return;
    //permissions check
    if (
      !logsChannel
        .permissionsFor(guild.me)
        .has(PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks)
    )
      return interaction.editReply(errors.error53);

    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(unslow.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(unslow.embed1.description))
            .addFields({
              name: unslow.embed1.field1.name,
              value: eval(unslow.embed1.field1.value),
            })
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/313/rabbit_1f407.png"
            )
            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
