const { Command } = require("sheweny");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warn",
      description: "🔨 Warn a user.",
      examples:
        "/warn add `member:@Pexi` `reason:a reason` => 🔨 Warn `@Pexi` for `a reason`",
      usage: "https://i.imgur.com/CjV2LF0.png",
      category: "Admin",
      userPermissions: ["ModerateMembers"],
      clientPermissions: ["ModerateMembers"],
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "add",
          description: "🔨 Warn a user",
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: "user",
              description: "👤 User to warn",
              required: true,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "reason",
              description: "❔ Reason for the warn",
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "remove",
          description: "🔨 Remove a warn from a user",
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: "user",
              description: "👤 User to remove a warn from",
              required: true,
            },
            {
              type: ApplicationCommandOptionType.Number,
              name: "number",
              description:
                "🔢 The index of the warn to remove (see /warn list)",
              required: true,
            },
            {
              type: ApplicationCommandOptionType.String,
              name: "reason",
              description: "❔ Reason for the warn removal",
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: "list",
          description: "🔨 List all warns for a user",
          options: [
            {
              type: ApplicationCommandOptionType.User,
              name: "user",
              description: "👤 The user to list warns of",
              required: true,
            },
          ],
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const { guild, options } = interaction;

    const member = options.getMember("user");
    if (!member) return interaction.editReply(`\`🚫\` I can't find that user.`);

    const fetchGuild = await this.client.getGuild(guild);
    const logsChannel = this.client.channels.cache.get(fetchGuild.logs.channel);
    const enabledLogs = fetchGuild.logs.enabled;

    let filteredUser, reason;
    switch (options._subcommand) {
      case "add":
        reason = options.getString("reason");
        const userArray = fetchGuild.logs.users;

        // get the highest case number from the array of warns to increment it
        const cases = userArray.map((u) => u.case);
        const highestCase = Math.max(...cases);

        // build the new warn object
        let d = new Date();
        const user = {
          case: cases.length === 0 ? 0 : highestCase + 1,
          id: member.id,
          name: member.displayName,
          moderator: interaction.user.id,
          reason: reason,
          date: d.getTime(),
        };

        userArray.push(user);
        await this.client.updateGuild(guild, { "logs.users": userArray });

        interaction.editReply({
          content: `\`🔨\` ${member.toString()} has been warn.`,
          components: [
            this.client.ButtonRow([
              {
                customId: "warns-list",
                label: "Warns",
                style: "SECONDARY",
                emoji: "🔨",
              },
            ]),
          ],
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
                .setDescription(`${member.toString()} has been warn.`)
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
            components: [
              this.client.ButtonRow([
                {
                  customId: "warns-list",
                  label: "Warns",
                  style: "SECONDARY",
                  emoji: "🔨",
                },
              ]),
            ],
          })
          .catch(() => undefined);
        break;

      case "remove":
        const number = options.getNumber("number");
        reason = options.getString("reason");

        // find if the user matches the id of a logged one
        filteredUser = fetchGuild.logs.users.filter((u) => u.id === member.id);
        if (filteredUser.length === 0)
          return interaction.editReply(`\`🚫\` This user has no warns.`);

        let index;
        try {
          // find the warn (-1 because warns are front listed from 1)
          index = filteredUser[number - 1].case;
        } catch (e) {
          return interaction.editReply(
            `\`🚫\` Warn **#${number}** of ${member.toString()} does not exist.`
          );
        }

        // get the index of the warn to remove
        const filteredCase = fetchGuild.logs.users
          .map((u) => u.case)
          .indexOf(index);

        // store old warn for the logging system
        const oldReason = fetchGuild.logs.users[filteredCase].reason;

        // remove the warn from the db
        fetchGuild.logs.users.splice(filteredCase, 1);
        await this.client.updateGuild(guild, {
          "logs.users": fetchGuild.logs.users,
        });

        interaction.editReply({
          content: `\`❎\` Warn **#${number}** of ${member.toString()} has been removed.`,
          components: [
            this.client.ButtonRow([
              {
                customId: "warns-list",
                label: "Warns",
                style: "SECONDARY",
                emoji: "🔨",
              },
            ]),
          ],
        });

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
                .setDescription(
                  "Warn of " +
                    member.toString() +
                    " has been removed.\n" +
                    `➡️\`${oldReason}\``
                )
                .addFields({
                  name: "Reason",
                  value: `${reason || "No reason provided"}`,
                })
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({
                  text: member.user.tag + " - " + member.user.id,
                }),
            ],
            components: [
              this.client.ButtonRow([
                {
                  customId: "warns-list",
                  label: "Warns",
                  style: "SECONDARY",
                  emoji: "🔨",
                },
              ]),
            ],
          })
          .catch(() => undefined);
        break;

      case "list":
        // find if the user matches the id of a logged one
        filteredUser = fetchGuild.logs.users.filter((u) => u.id === member.id);
        if (filteredUser.length === 0)
          return interaction.editReply(`\`🚫\` This user has no warns.`);

        let warnList = "";
        let i = filteredUser.length + 1;
        let s = 1;

        /* Reversing the array and then looping through it for better front listing
          show max 10 warns for space restrictions */
        filteredUser
          .slice()
          .reverse()
          .forEach((warn) => {
            i--;
            s++;
            if (s > 10) return;
            warnList += `\n**${i}:** by <@${
              warn.moderator
            }> - ${this.client.Formatter(warn.date, "R")}\n`;
            warnList += `Reason: \`${warn.reason}\`\n`;
          });

        return interaction.editReply({
          embeds: [
            this.client
              .Embed()
              .setAuthor({
                name: `${member.user.tag} warns 🔨`,
                iconURL: member.user.avatarURL({ dynamic: true }),
              })
              .setDescription(warnList)
              .setTimestamp()
              .setFooter({
                text: `${member.user.tag} - ${member.user.id}`,
              }),
          ],
        });
    }
  }
};
