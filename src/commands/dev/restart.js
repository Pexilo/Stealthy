const { Command } = require("sheweny");
const execSync = require("child_process").execSync;

module.exports = class RestartCommand extends Command {
  constructor(client) {
    super(client, {
      name: "restart",
      description: "🔄️ Restart the bot",
      category: "Admin",
      adminsOnly: true,
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;
    const guilds = this.client.managers.commands.guildId;
    for (let i in guilds)
      await this.client.managers.commands.deleteAllCommands(guilds[i]);
    await interaction.editReply("Successfully restarted the bot");
    return execSync("npm run start", { encoding: "utf-8" });
  }
};
