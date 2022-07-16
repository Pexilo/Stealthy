const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const Translate = require("deepl");
const wait = require("node:util").promisify(setTimeout);
require("dotenv").config();
const { Formatters } = require("discord.js");
const dayjs = require("dayjs");
const nodeEmoji = require("node-emoji");
const { Guild } = require("../models");

// This file contains all the functions that are used in the bot to avoid code duplication.
module.exports = (client) => {
  /* This function is used to create a new embed. */
  (client.Embed = (color = true) => {
    let embed = new MessageEmbed();
    if (color) embed.setColor("#508fb0");
    return embed;
  }),
    /* This function is used to format ms to a prettier way */
    (client.PrettyMs = (ms, option = { compact: true }) => {
      return prettyMilliseconds(ms, option);
    }),
    /* This function is used to create a new row for a select menu. */
    (client.SelectMenuRow = (
      customId,
      placeholder = null,
      options = null,
      amount = null
    ) => {
      let menuRow = new MessageActionRow().addComponents(
        new MessageSelectMenu().setCustomId(customId)
      );
      if (placeholder) menuRow.components[0].setPlaceholder(placeholder);
      if (amount) {
        menuRow.components[0].setMinValues(amount.min);
        menuRow.components[0].setMaxValues(amount.max);
      }
      if (options) menuRow.components[0].addOptions(options);
      return menuRow;
    }),
    /* This function is used to create buttons. */
    (client.ButtonRow = (buttons) => {
      let buttonRow = new MessageActionRow();
      buttons.forEach((btn) => {
        let button = new MessageButton()
          .setLabel(btn.label)
          .setStyle(btn.style);
        if (btn.emoji) button.setEmoji(btn.emoji);
        if (btn.url) button.setURL(btn.url);
        else button.setCustomId(btn.customId);
        buttonRow.addComponents(button);
      });
      return buttonRow;
    }),
    /* This function is used to create modals. */
    (client.ModalRow = (customId, title, textInput) => {
      const modal = new Modal().setCustomId(customId).setTitle(title);

      textInput.forEach((element) => {
        modal.addComponents(
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId(element.customId)
              .setLabel(element.label)
              .setStyle(element.style)
              .setPlaceholder(element.placeholder)
              .setRequired(element.required)
          )
        );
      });
      return modal;
    }),
    /* This function is used to translate a string from a detected language to a set one. */
    (client.FastTranslate = async (text, lang) => {
      if (lang == "en") return text;
      let r = "";
      await Translate({
        free_api: true,
        text: text,
        target_lang: lang.toUpperCase(),
        auth_key: `${process.env.deeplAuthKey}`,
      })
        .then((result) => {
          r = result.data.translations[0].text;
        })
        .catch((error) => {
          console.error(error);
        });
      return r;
    }),
    /* This function is used to translate a string from a detected language to a set one. */
    (client.Translate = async (text, lang) => {
      let r = "";
      await Translate({
        free_api: true,
        text: text,
        target_lang: lang.toUpperCase(),
        auth_key: `${process.env.deeplAuthKey}`,
      })
        .then((result) => {
          r = result.data;
        })
        .catch((error) => {
          console.error(error);
        });
      return r;
    }),
    /* This function is used to defer a reply. */
    (client.Defer = async (interaction) => {
      await wait(500); // Wait for the db check in interactionCreate
      let bool = true;
      await interaction.deferReply({ ephemeral: true }).catch(() => {
        bool = false;
      });
      return bool;
    }),
    /* This function is used to wait for a specific amount of time. */
    (client.Wait = async (ms = 2000) => {
      return await wait(ms);
    }),
    /* This function is used to capitalize the first letter of a string. */
    (client.Capitalize = (s) => {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    }),
    /* This function is used to format the time. */
    (client.Formatter = (
      ms,
      option = Formatters.TimestampStyles.ShortDateTime
    ) => {
      if (option === "relative")
        option = Formatters.TimestampStyles.RelativeTime;
      return Formatters.time(dayjs(ms).unix(), option);
    }),
    /* This function is used to return a random element from an array. */
    (client.searchRandom = (arr, count = 1) => {
      let answer = [],
        counter = 0;
      while (counter < count) {
        let rand = arr[Math.floor(Math.random() * arr.length)];
        if (!answer.some((an) => an === rand)) {
          answer.push(rand);
          counter++;
        }
      }
      return answer;
    }),
    /* This function is used to get the name of an emoji from its unicode. */
    (client.GetEmojiNameFromUni = (unicodeEmoji) => {
      return nodeEmoji.find(unicodeEmoji).key;
    }),
    /* This function is used to get the emoji from its name. */
    (client.GetEmojiFromName = (emojiName) => {
      try {
        return nodeEmoji.find(emojiName).emoji;
      } catch (e) {
        return null;
      }
    }),
    /* This function is used to check if an emoji exist. */
    (client.HasEmoji = (unicodeEmoji) => {
      return nodeEmoji.hasEmoji(unicodeEmoji);
    }),
    /* This function is used to find by name a custom emoji */
    (client.FindCustomEmoji = async (client, emoji) => {
      const customEmoji = await client.emojis.cache.find(
        (e) => e.name === emoji
      );
      if (customEmoji)
        return `<${customEmoji.animated ? "a" : ""}:${customEmoji.name}:${
          customEmoji.id
        }>`;
      return null;
    }),
    /* This function is used to check if a custom emoji is valid. */
    (client.IsValidEmoji = async (client, emojiName) => {
      const search = await client.emojis.cache.find(
        (e) => e.id === emojiName.split(":")[2].slice(0, -1)
      );

      if (search) return true;
      return false;
    }),
    /* This function is used to get the highest role of a user. */
    (client.HighestRole = (guild, userId) => {
      try {
        return guild.members.cache.find((member) => member.id === userId).roles
          .highest.position;
      } catch (e) {
        return null;
      }
    }),
    /* This function is used to update the name of the channel that is used to display the member count. */
    (client.UpdateMemberCount = (guild, channelId, channelName) => {
      try {
        guild.channels.cache
          .get(channelId)
          .setName(`${channelName}: ${guild.memberCount}`);
      } catch (e) {}
    }),
    /* This function is used to get the guild data from the database. */
    (client.getGuild = async (guild) => {
      const guildData = await Guild.findOne({ id: guild.id });
      return guildData;
    }),
    /* This function is used to create a new guild in the database. */
    (client.createGuild = async (guild) => {
      const createGuild = new Guild({ id: guild.id });
      createGuild
        .save()
        .then(() =>
          console.log(
            `➕ Guild: ${guild.name} - ${guild.id} - ${guild.members.cache.size} users`
          )
        );
    }),
    /* This function is used to delete a guild from the database. */
    (client.deleteGuild = async (guild) => {
      await Guild.deleteOne({ id: guild.id }).then(() =>
        console.log(
          `➖ Guild: ${guild.name} - ${guild.id} - ${guild.members.cache.size} users`
        )
      );
    }),
    /* This function is used to update the guild data in the database. */
    (client.updateGuild = async (guild, settings) => {
      let guildData = await client.getGuild(guild);
      if (typeof guildData != "object") guildData = {};
      // if the key is an object
      for (const key in settings) {
        if (key.includes(".") && key.split(".").length === 2) {
          if (
            guildData[key.split(".")[0]][key.split(".")[1]] != settings[key]
          ) {
            guildData[key.split(".")[0]][key.split(".")[1]] = settings[key];
          }
        }
        // if the key is a string, number or boolean
        else {
          if (guildData[key] != settings[key]) {
            guildData[key] = settings[key];
          }
        }
      }
      return guildData.updateOne(settings);
    });
};
