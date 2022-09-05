const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class SetNicknameCommand extends Command {
  constructor(client) {
    super(client, {
      name: "nick",
      nameLocalizations: {},
      description: "✍️ Change the nickname of a user.",
      descriptionLocalizations: {
        fr: "✍️ Change le pseudo d'un utilisateur.",
      },
      examples:
        "/nick `user:@Pexi` `nickname:Pexilo` => ✍️ Change the nickname of `@Pexi` to `Pexilo`",
      usage: "https://i.imgur.com/lZSnzz8.png",
      category: "Admin",
      userPermissions: ["ManageNicknames"],
      clientPermissions: ["ManageNicknames"],
      options: [
        {
          type: ApplicationCommandOptionType.User,
          name: "user",
          nameLocalizations: { fr: "utilisateur" },
          description: "👤 User to change the nickname of",
          descriptionLocalizations: {
            fr: "👤 Utilisateur dont vous voulez changer le pseudo",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "nickname",
          nameLocalizations: { fr: "pseudo" },
          description: "✏️ New nickname",
          descriptionLocalizations: { fr: "✏️ Nouveau pseudo" },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.String,
          name: "reason",
          nameLocalizations: { fr: "raison" },
          description: "❔ Reason for changing the nickname",
          descriptionLocalizations: {
            fr: "❔ Raison du changement de pseudo",
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
    const { nick } = this.client.la[lang].commands.admin;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(errors.error1);
    const nickname = options.getString("nickname");
    const reason = options.getString("reason");

    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    try {
      await member.setNickname(nickname, eval(nick.auditlog));
    } catch (e) {
      return interaction.editReply(errors.error9);
    }

    interaction.editReply(eval(nick.reply));

    if (!logsChannel || !enabledLogs.includes("moderation")) return;
    logsChannel
      .send({
        embeds: [
          this.client
            .Embed()
            .setAuthor({
              name: eval(nick.embed1.author),
              iconURL: interaction.user.displayAvatarURL({
                dynamic: true,
              }),
            })
            .setDescription(eval(nick.embed1.description))
            .addFields(
              {
                name: nick.embed1.field1,
                value: `\`${nickname}\``,
                inline: true,
              },
              {
                name: nick.embed1.field2.name,
                value: eval(nick.embed1.field2.value),
                inline: true,
              }
            )
            .setThumbnail(member.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({
              text: member.user.tag + " - " + member.user.id,
            }),
        ],
      })
      .catch(() => undefined);
  }
};
