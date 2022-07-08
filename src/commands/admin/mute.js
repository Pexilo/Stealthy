const { Command } = require("sheweny");

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      type: "SLASH_COMMAND",
      description: "🔇Mute a specific member",
      examples:
        "/mute `member:@Pexilo#0001` `format:minutes` `duration:5` => 🔇Mute `@Pexilo#0001` for `5` `minutes`",
      category: "Admin",
      userPermissions: ["MODERATE_MEMBERS"],
      clientPermissions: ["MODERATE_MEMBERS"],
      options: [
        {
          type: "USER",
          name: "user",
          description: "💡User to mute",
          required: true,
        },
        {
          type: "STRING",
          name: "format",
          description: "💡Format to use",
          required: true,
          choices: [
            {
              name: "🕒 Minutes",
              value: "minutes",
            },
            {
              name: "🕒 Hours",
              value: "hours",
            },
          ],
        },
        {
          type: "INTEGER",
          name: "duration",
          description: "💡Time to mute",
          required: true,
          minValue: 1,
          maxValue: 670,
        },
        {
          type: "STRING",
          name: "reason",
          description: "💡Reason for the mute",
          required: false,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`🚫 I can't find that user.`);
    const format = options.getString("format");
    let duration = options.getInteger("duration");
    const reason = options.getString("reason");

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs_Cnl);
    if (!logsChannel)
      return interaction.editReply(
        `🚫 I can't find the logs channel.\n\n> Please use \`/setup channels\` to set it up.`
      );

    format === "minutes" ? (duration *= 60000) : (duration *= 3600000);

    try {
      member.timeout(
        duration,
        `by ${interaction.member.user.tag}${reason ? ": " + reason : ""}`
      );
    } catch (e) {
      return interaction.editReply(
        `⛔ An error occured: ${"```"}${
          e.message
        }${"```"}\nPlease contact an administrator of the bot for further assistance.`
      );
    }

    logsChannel.send({
      embeds: [
        this.client
          .Embed()
          .setAuthor({
            name: `by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
          })
          .setDescription(
            `${member.toString()} has been muted for \`${this.client.PrettyMs(
              duration
            )}\`\n\nTo unmute, use \`/unmute user:@${member.user.tag}\``
          )
          .setFields({
            name: `Reason` + ":",
            value: `${reason || "No reason provided"}`,
            inline: true,
          })
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({
            text: `${member.user.tag} - ${member.user.id}`,
          }),
      ],
    });

    return interaction.editReply({
      content: `${member.toString()} has been muted for ${this.client.PrettyMs(
        duration,
        { verbose: true }
      )}`,
    });
  }
};
