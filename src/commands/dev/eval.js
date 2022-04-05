const { Command } = require("sheweny");

const clean = (text) => {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
};

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evaluate code",
      category: "Dev",
      adminsOnly: true,
      options: [
        {
          type: "STRING",
          name: "code",
          description: "some code to evaluate",
          required: true,
        },
      ],
    });
  }
  async execute(interaction) {
    if (!(await this.client.Defer(interaction))) return;

    const code = interaction.options.getString("code");

    try {
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      interaction.editReply(
        `\`\`\`xl\n${code}\n\`\`\`` + clean(evaled),
        {
          code: "xl",
        }
          ? "✅"
          : "❎"
      );
    } catch (err) {
      interaction.editReply(
        `\`ERROR: ${code}\` \`\`\`xl\n${clean(err)}\n\`\`\``
      );
    }
  }
};
