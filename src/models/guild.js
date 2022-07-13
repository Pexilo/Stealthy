const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  id: String,
  default_Lang: { type: String, default: "en" },
  users: { type: Array, default: [] },

  logs_Cnl: { type: String, default: null },
  roleclaim_Cnl: { type: String, default: null },
  membercount_Cnl: { type: String, default: null },
  membercount_Name: { type: String, default: "👥 Members" },
  JTC_Cnl: { type: String, default: null },

  roleclaim_Msg: { type: String, default: null },
  roleclaim_TipMsg: { type: String, default: null },
  roleclaim_Fields: { type: Array, default: [] },

  autorole_Roles: { type: Array, default: null },

  blacklist_Time: { type: Number, default: 86400000 },
  blacklist_MinimumAge: { type: Number, default: 3600000 },

  JTC_CnlNames: {
    type: Array,
    default: [
      "🗻 Everest",
      "🌉 San Francisco",
      "🌅 Bahamas",
      "💳 VIP Room",
      "🏰 Peach Castle",
    ],
  },
  JTCs: { type: Array, default: [] },
});

module.exports = mongoose.model("Guild", guildSchema);
