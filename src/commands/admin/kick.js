const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "🔪 Kick a member from the server.",
      examples: "/kick `user:@Pexilo#0001` => 🔪 Kick Pexilo from the server.",
      category: "Admin",
      userPermissions: ["KickMembers"],
      clientPermissions: ["KickMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          description: "👤 User to kick",
          required: true,
        },

        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          description: "❔ Reason for the kick",
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
