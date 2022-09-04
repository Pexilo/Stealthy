const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      nameLocalizations: {},
      description: "🔪 Ban a member from the server.",
      descriptionLocalizations: {
        fr: "🔪 Bannir un membre du serveur.",
      },
      examples:
        "/ban `user:@Pexi` `days:3` => 🔪 Ban `@Pexi` from the server and delete the last `3 days` of messages",
      usage: "https://i.imgur.com/o0Dm3A6.png",
      category: "Admin",
      userPermissions: ["BanMembers"],
      clientPermissions: ["BanMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: { fr: "utilisateur" },
          description: "👤 User to ban",
          descriptionLocalizations: { fr: "👤 Utilisateur à bannir" },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "days",
          nameLocalizations: { fr: "jours" },
          description: "❌ User messages to delete (in days)",
          descriptionLocalizations: {
            fr: "❌ Messages de l'utilisateur à supprimer (en jours)",
          },
          required: true,
          min_value: 0,
          max_value: 7,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the ban",
          descriptionLocalizations: { fr: "❔ Raison du bannissement" },
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find that user.`);
    const deleteDays = options.getInteger("days");
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await member.ban({
        deleteMessageDays: deleteDays,
        reason: `by ${interaction.member.user.tag}${
          reason ? ": " + reason : ""
        }`,
      });
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to ban this user."
      );
    }

    interaction.editReply(
      `\`🔪\` ${member.toString()} has been banned from the server.\n\n> \`${deleteDays}\` days of messages have been cleared${
        reason ? `\n> Reason: \`${reason}\`` : ""
      }`
    );

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: `by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(member.toString() + " has been banned.")
            .addFields(
              {
                name: "Messages deleted",
                value: `${deleteDays} days`,
              },
              {
                name: "Reason",
                value: `${reason || "No reason provided"}`,
              }
            )
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor("#b72a2a")
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
