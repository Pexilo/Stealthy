const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  id: String,
  language: { type: String, default: "en" },

  logs: {
    channel: { type: String, default: null },
    users: { type: Array, default: [] },
  },

  memberCount: {
    name: { type: String, default: "👥 Members" },
    channel: { type: String, default: null },
  },

  roleClaim: {
    message: { type: String, default: null },
    channel: { type: String, default: null },
    tipMessage: { type: String, default: null },
    fields: { type: Array, default: [] },
  },

  autoRole: {
    roles: { type: Array, default: [] },
  },

  blackList: {
    time: { type: Number, default: 86400000 },
    minAge: { type: Number, default: 3600000 },
  },

  joinToCreate: {
    names: {
      type: Array,
      default: [
        "🗻 Everest",
        "🌉 San Francisco",
        "🌅 Bahamas",
        "💳 VIP Room",
        "🏰 Peach Castle",
      ],
    },
    channel: { type: String, default: null },
    activeChannels: { type: Array, default: [] },
  },
});

module.exports = mongoose.model("Guild", guildSchema);
