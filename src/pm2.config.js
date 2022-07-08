module.exports = {
  apps: [
    {
      name: "Stealthy",
      script: "src/client.js",

      watch: "src",
      ignore_watch: [],

      env_production: {
        bot_state: "production",
      },
      env_development: {
        bot_state: "development",
      },

      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
