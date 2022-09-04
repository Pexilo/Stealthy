const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      nameLocalizations: {},
      description: "🔇 Mute a member",
      descriptionLocalizations: {
        fr: "🔇 Rendre muet un membre",
      },
      examples:
        "/mute `member:@Pexi` `format:minutes` `duration:5` => 🔇 Mute `@Pexi` for `5` `minutes`",
      usage: "https://i.imgur.com/u0TBXu4.png",
      category: "Admin",
      userPermissions: ["ModerateMembers"],
      clientPermissions: ["ModerateMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: { fr: "utilisateur" },
          description: "👤 User to mute",
          descriptionLocalizations: {
            fr: "👤 Utilisateur à rendre muet",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "format",

          description: "🕒 Format to use",
          descriptionLocalizations: {
            fr: "🕒 Format à utiliser",
          },
          required: true,
          choices: [
            {
              name: "🕒 Minutes",

              value: "minutes",
            },
            {
              name: "🕒 Hours",
              nameLocalizations: { fr: "🕒 Heures" },
              value: "hours",
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Integer,
          name: "duration",
          nameLocalizations: { fr: "durée" },
          description: "⏱️ Time to mute",
          descriptionLocalizations: {
            fr: "⏱️ Temps à rendre muet",
          },
          required: true,
          minValue: 1,
          maxValue: 670,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for the mute",
          descriptionLocalizations: {
            fr: "❔ Raison du mute",
          },
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find that user.`);
    if (member.permissions.has("ManageGuild"))
      return interaction.editReply(`\`🚫\` I can't mute this user.`);

    const format = options.getString("format");
    const duration =
      format === "minutes"
        ? options.getInteger("duration") * 60000
        : options.getInteger("duration") * 3600000;
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      member.timeout(
        duration,
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        `\`⛔\` An error occured: ${"```"}${
          e.message
        }${"```"}\nPlease contact an administrator of the bot for further assistance.`
      );
    }
    interaction.editReply({
      content: `🔇 ${member.toString()} has been muted for ${this.client.PrettyMs(
        duration,
        { verbose: true }
      )}`,
    });

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: `by ${interaction.user.tag}`,
              iconURL: interaction.user.avatarURL({ dynamic: true }),
            })
            .setDescription(
              `${member.toString()} has been muted for \`${this.client.PrettyMs(
                duration
              )}\`\n\nTo unmute, use \`/unmute\`.`
            )
            .setFields({
              name: `Reason` + ":",
              value: `${reason || "No reason provided"}`,
              inline: true,
            })
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("#c97628")
            .setFooter({
              text: `${member.user.tag} - ${member.user.id}`,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
