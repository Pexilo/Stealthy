const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = class SlowCommand extends Command {
  constructor(client) {
    super(client, {
      name: "slow",
      nameLocalizations: {},
      description: "🐌 Set a slowmode for a channel.",
      descriptionLocalizations: {
        fr: "🐌 Définir un slowmode pour un salon.",
      },
      examples:
        "/slow `channel:#general` `format:minutes` `time:1` => 🕒 Slow time between messages in `#general` channel for `1` `minute`",
      usage: "https://i.imgur.com/wtz21Rv.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon" },
          description: "📙 Channel to set the slowmode for",
          descriptionLocalizations: {
            fr: "📙 Salon sur lequel définir le slowmode",
          },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "format",
          nameLocalizations: {},
          description: "🕒 Wich format do you want to use ?",
          descriptionLocalizations: {
            fr: "🕒 Quel format voulez-vous utiliser ?",
          },
          required: true,
          choices: [
            {
              name: "🕒 Seconds",
              nameLocalizations: { fr: "🕒 Secondes" },
              value: "seconds",
            },
            {
              name: "🕒 Minutes",
              nameLocalizations: {},
              value: "minutes",
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "time",
          nameLocalizations: { fr: "temps" },
          description: "⏱️ Define the time",
          descriptionLocalizations: {
            fr: "⏱️ Définir le temps",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the slowmode",
          descriptionLocalizations: {
            fr: "❔ Raison du slowmode",
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

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

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

    if (!logsChannel || !enabledLogs.includes("channels")) return;
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
