const { ShewenyClient } = require("sheweny");
const { mongoose } = require("mongoose");
require("dotenv").config();
const { token, mongo_uri, bot_state } = process.env;
const { Intents } = require("discord.js");

const client = new ShewenyClient({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  partials: [
    "CHANNEL",
    "MESSAGE",
    "REACTION",
    "USER",
    "GUILD_MEMBER",
    "GUILD_PRESENCE",
  ],
  admins: ["224537059308732416"],
  presence: {
    status: "online",
    activities: [
      {
        name: "/help",
        type: "LISTENING",
      },
    ],
  },
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      loadAll: true,
      default: {
        type: "SLASH_COMMAND",
        channel: "GUILD",
        cooldown: 3,
      },
    },
    events: {
      directory: "./events",
      loadAll: true,
      default: {
        once: false,
      },
    },
    selectMenus: {
      directory: "./interactions/select-menus",
      loadAll: true,
    },
    buttons: {
      directory: "./interactions/buttons",
      loadAll: true,
    },
  },
  mode: bot_state,
});

require("./util/functions")(client);

mongoose
  .connect(mongo_uri, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("MongoDB     ✅"))
  .catch((err) => console.error("MongoDB     ❌\n", err.reason));

client.login(token);

module.exports = client;
