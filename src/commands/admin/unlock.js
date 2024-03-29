const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = class UnlockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unlock",
      nameLocalizations: { fr: "delock" },
      description: "🔓 Unlock a channel.",
      descriptionLocalizations: {
        fr: "🔓 Déverrouiller un salon.",
        de: "🔓 Entsperrt einen Kanal.",
        "es-ES": "🔓 Desbloquea un canal.",
      },
      examples:
        "/unlock `channel:#general` => 🔓 Allow users to send messages in `#general`",
      usage: "https://i.imgur.com/FLdEF1d.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ViewChannel", "ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon", de: "kanal", "es-ES": "canal" },
          description: "📙 Channel to unlock",
          descriptionLocalizations: {
            fr: "📙 Salon à déverrouiller",
            de: "📙 Kanal zum Entsperren",
            "es-ES": "📙 Canal para desbloquear",
          },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison", de: "grund", "es-ES": "razón" },
          description: "❔ Reason for the unlock",
          descriptionLocalizations: {
            fr: "❔ Raison du déverrouillage",
            de: "❔ Grund für die Entsperreung",
            "es-ES": "❔ Razón para desbloquear",
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
    const { unlock } = this.client.la[lang].commands.admin;

    const channel = options.getChannel("channel");
    if (channel.permissionsFor(guild.id).has("SendMessages")) {
      return interaction.editReply(errors.error29);
    }
    const reason = options.getString("reason");

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: true,
      });
    } catch (e) {
      return interaction.editReply(errors.error30);
    }

    interaction.editReply(eval(unlock.reply));

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;
    if (!logsChannel || !enabledLogs.includes("channels")) return;
    await this.client.LogsChannelPermsCheck(guild, interaction, errors);

    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(unlock.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(unlock.embed1.description))
            .addFields({
              name: unlock.embed1.field1.name,
              value: eval(unlock.embed1.field1.value),
            })
            .setThumbnail(
              "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/unlocked_1f513.png"
            )
            .setColor("#ffac33")

            .setTimestamp(),
        ],
      })
      .catch(() => undefined);
  }
};
