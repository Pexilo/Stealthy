const { Command } = require("sheweny");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

module.exports = class LockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lock",
      nameLocalizations: {},
      description: "🔒 Lock a channel.",
      descriptionLocalizations: {
        fr: "🔒 Verrouiller un salon.",
      },
      examples:
        "/lock `channel:#general` => 🔒 Forbid users from sending messages in `#general`",
      usage: "https://i.imgur.com/MTb1WLk.png",
      category: "Admin",
      userPermissions: ["ManageChannels"],
      clientPermissions: ["ManageChannels"],
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          nameLocalizations: { fr: "salon" },
          description: "📙 Channel to lock",
          descriptionLocalizations: { fr: "📙 Salon à verrouiller" },
          required: true,
          channelTypes: [ChannelType.GuildText],
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the lock",
          descriptionLocalizations: { fr: "❔ Raison du verrouillage" },
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

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await channel.permissionOverwrites.edit(guild.id, {
        SendMessages: false,
      });
    } catch (e) {
      return interaction.editReply(errors.error6);
    }

    interaction.editReply(eval(lock.reply));

    if (!logsChannel || !enabledLogs.includes("channels")) return;
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
