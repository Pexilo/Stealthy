const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class SlowCommand extends Command {
  constructor(client) {
    super(client, {
      name: "slow",
      nameLocalizations: {},
      description: "🐌 Set a slowmode for a channel.",
      descriptionLocalizations: {
        fr: "🐌 Définir un slowmode pour un salon.",
        de: "🐌 Setze einen Slowmode für einen Kanal.",
        "es-ES": "🐌 Establece un modo lento para un canal.",
      },
      examples:
        "/slow `channel:#general` `format:minutes` `time:1` => 🕒 Slow time between messages in `#general` channel for `1` `minute`",
      usage: "https://i.imgur.com/wtz21Rv.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ViewChannel", "ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon", de: "kanal", "es-ES": "canal" },
          description: "📙 Channel to set the slowmode for",
          descriptionLocalizations: {
            fr: "📙 Salon sur lequel définir le slowmode",
            de: "📙 Kanal, für den der Slowmode festgelegt werden soll",
            "es-ES": "📙 Canal para establecer el modo lento",
          },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "format",
          nameLocalizations: {
            fr: "format",
            de: "format",
            "es-ES": "formato",
          },
          description: "🕒 Wich format do you want to use ?",
          descriptionLocalizations: {
            fr: "🕒 Quel format voulez-vous utiliser ?",
            de: "🕒 Welches Format möchten Sie verwenden?",
            "es-ES": "🕒 ¿Qué formato desea usar?",
          },
          required: true,
          choices: [
            {
              name: "🕒 Seconds",
              nameLocalizations: {
                fr: "🕒 Secondes",
                de: "🕒 Sekunden",
                "es-ES": "🕒 Segundos",
              },
              value: "seconds",
            },
            {
              name: "🕒 Minutes",
              nameLocalizations: {
                fr: "🕒 Minutes",
                de: "🕒 Minuten",
                "es-ES": "🕒 Minutos",
              },
              value: "minutes",
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "time",
          nameLocalizations: { fr: "temps", de: "zeit", "es-ES": "tiempo" },
          description: "⏱️ Define the time",
          descriptionLocalizations: {
            fr: "⏱️ Définir le temps",
            de: "⏱️ Definieren Sie die Zeit",
            "es-ES": "⏱️ Definir el tiempo",
          },
          required: true,
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
    const { options, guild } = interaction;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { slow } = this.client.la[lang].commands.admin;

    const channel = options.getChannel("channel");
    if (!channel) return interaction.editReply(errors.error4);

    const format = options.getString("format");
    const time = options.getInteger("time");
    const reason = options.getString("reason");

    const formattedTime = format === "minutes" ? time * 60 : time;

    try {
      await channel.setRateLimitPerUser(formattedTime, eval(slow.auditlog));
    } catch (e) {
      return interaction.editReply(errors.error27);
    }

    if (time === 0) {
      interaction.editReply(eval(slow.reply1));
    } else {
      interaction.editReply(eval(slow.reply2));
    }

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
              name: eval(slow.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(slow.embed1.description))
            .addFields(
              {
                name: slow.embed1.field1.name,
                value: eval(slow.embed1.field1.value),
                inline: true,
              },
              {
                name: slow.embed1.field2.name,
                value: eval(slow.embed1.field2.value),
                inline: true,
              }
            )
            .setThumbnail(
              `${
                time !== 0
                  ? "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/snail_1f40c.png"
                  : "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/313/rabbit_1f407.png"
              }`
            )
            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
