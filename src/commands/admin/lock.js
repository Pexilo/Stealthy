const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class LockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lock",
      nameLocalizations: {},
      description: "🔒 Lock a channel.",
      descriptionLocalizations: {
        fr: "🔒 Verrouiller un salon.",
        de: "🔒 Sperren Sie einen Kanal.",
        "es-ES": "🔒 Bloquear un canal.",
      },
      examples:
        "/lock `channel:#general` => 🔒 Forbid users from sending messages in `#general`",
      usage: "https://i.imgur.com/MTb1WLk.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ViewChannel", "ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon", de: "kanal", "es-ES": "canal" },
          description: "📙 Channel to lock",
          descriptionLocalizations: {
            fr: "📙 Salon à verrouiller",
            de: "📙 Kanal sperren",
            "es-ES": "📙 Canal para bloquear",
          },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the lock",
          descriptionLocalizations: {
            fr: "❔ Raison du verrouillage",
            de: "❔ Grund für die Sperrung",
            "es-ES": "❔ Razón del bloqueo",
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
    const { lock } = this.client.la[lang].commands.admin;

    const channel = options.getChannel("channel");
    if (!channel) return interaction.editReply(errors.error4);
    const reason = options.getString("reason");

    if (!channel.permissionsFor(guild.id).has("SendMessages")) {
      return interaction.editReply(errors.error5);
    }

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false,
      });
    } catch (e) {
      return interaction.editReply(errors.error6);
    }

    interaction.editReply(eval(lock.reply));

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
              name: eval(lock.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(lock.embed1.description))
            .addFields({
              name: lock.embed1.field1.name,
              value: eval(lock.embed1.field1.value),
            })
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/locked_1f512.png"
            )
            .setColor("#ffac33")
            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
