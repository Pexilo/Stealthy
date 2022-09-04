const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      nameLocalizations: {},
      description: "🔪 Kick a member from the server.",
      descriptionLocalizations: {
        fr: "🔪 Expulser un membre du serveur.",
      },
      examples: "/kick `user:@Pexi` => 🔪 Kick `@Pexi` from the server",
      usage: "https://i.imgur.com/b2t76SZ.png",
      category: "Admin",
      userPermissions: ["KickMembers"],
      clientPermissions: ["KickMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: { fr: "utilisateur" },
          description: "👤 User to kick",
          descriptionLocalizations: { fr: "👤 Utilisateur à expulser" },
          required: true,
        },

        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the kick",
          descriptionLocalizations: { fr: "❔ Raison de l'expulsion" },
        },
      ],
    });
  }

  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { options, guild } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find that user.`);
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await member.kick(
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        "`🚫` You don't have permission to kick this user."
      );
    }
    interaction.editReply(
      `\`🔪\` ${member.toString()} has been kick from the server.${
        reason ? `\n\n> Reason: \`${reason}\`` : ""
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
            .setDescription(member.toString() + " has been kicked.")
            .addFields({
              name: "Reason",
              value: `${reason || "No reason provided"}`,
            })
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setColor("#c97628")
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
