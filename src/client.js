const { ShewenyClient } = require("sheweny");
const { mongoose } = require("mongoose");
require("dotenv").config();
const { token, mongo_uri } = process.env;

const client = new ShewenyClient({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGE_REACTIONS",
  ],
  partials: ["GUILD_MEMBER", "MESSAGE", "REACTION"],
  admins: ["224537059308732416"],
  presence: {
    status: "online", // online, idle, dnd, invisible
    activities: [
      {
        name: "/help",
        type: "LISTENING", // WATCHING, PLAYING, STREAMING, LISTENING, CUSTOM
      },
    ],
  },
  managers: {
    commands: {
      directory: "./commands",
      guildId: ["946475695981330545"],
      autoRegisterApplicationCommands: true, // Register commands from the application
      loadAll: true, // Load all commands in the directory
      default: {
        type: "SLASH_COMMAND",
        channel: "GUILD",
        cooldown: 5,
      },
    },
    events: {
      directory: "./events", // Directory where the events are located
      loadAll: true, // Load all events
      default: {
        once: false, // If the event should only be executed once
      },
    },
    selectMenus: {
      directory: "./interactions/select-menus", // Directory where the select-menus are stored
      loadAll: true, // Load all select-menus (default: true)
    },
    buttons: {
      directory: "./interactions/buttons", // Directory where the buttons are stored
      loadAll: true, // Load all buttons (default: true)
    },
  },
  mode: "development", // development, production
});

require("./util/functions")(client); // Load the functions file

mongoose
  .connect(mongo_uri, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("MongoDB     ✅"))
  .catch((err) => console.error(err));

client.login(token);

module.exports = client;
