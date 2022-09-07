const { ShewenyClient } = require("sheweny");
const { Partials, GatewayIntentBits } = require("discord.js");
const { mongoose } = require("mongoose");
require("dotenv").config();
const { TOKEN, MONGO_URI, BOT_STATE } = process.env;
const { supportedLanguages } = require("./languages/supportedLanguages");

const client = new ShewenyClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
  ],
  admins: ["224537059308732416"],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      loadAll: true,
      applicationPermissions: true,
      default: {
        type: "SLASH_COMMAND",
        channel: "GUILD",
        cooldown: 3,
        userPermissions: ["UseApplicationCommands"],
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
    modals: {
      directory: "./interactions/modals",
      loadAll: true,
    },
  },
  mode: BOT_STATE,
});

require("./util/functions")(client);

client.la = {};
let languages = Object.keys(supportedLanguages);
for (const lang of languages) {
  client.la[lang] = require(`./languages/${lang}.json`);
}
Object.freeze(client.la);

mongoose
  .connect(MONGO_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .catch((err) => console.error("MongoDB     ❌\n", err.reason));

client.login(TOKEN);

module.exports = client;
