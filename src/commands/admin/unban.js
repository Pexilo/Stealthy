const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class UnBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unban",
      nameLocalizations: { fr: "deban" },
      description: "🔪 Unban a member from the server.",
      descriptionLocalizations: { fr: "🔪 Débannir un membre du serveur." },
      examples:
        "/unban `userid:7963..` => 🔪 Unban `Pexi's id` from the server.\n(you can find the `user id` in your logs)",
      usage: "https://i.imgur.com/CIw2TSM.png",
      category: "Admin",
      userPermissions: ["BanMembers"],
      clientPermissions: ["BanMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.String,
          name: "userid",
          nameLocalizations: { fr: "id-utilisateur" },
          description: "👤 Id of the user to unban",
          descriptionLocalizations: { fr: "👤 Id de l'utilisateur à débannir" },
          required: true,
        },

        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the unban",
          descriptionLocalizations: { fr: "❔ Raison du déban" },
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const { fetchGuild, lang } = await this.client.FetchAndGetLang(guild);
    const { errors } = this.client.la[lang];
    const { unban } = this.client.la[lang].commands.admin;

    const memberId = options.getString("userid");
    if (!memberId) return interaction.editReply(errors.error1);
    const reason = options.getString("reason");

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await guild.members.unban(memberId, [
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`,
      ]);
    } catch (e) {
      return interaction.editReply(errors.error28);
    }
    interaction.editReply(eval(unban.reply));

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(unban.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(unban.embed1.description))
            .addFields({
              name: unban.embed1.field1.name,
              value: eval(unban.embed1.field1.value),
            })
            .setColor("#b72a2a")
            .setTimestamp()
            .setFooter({
              text: memberId,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
