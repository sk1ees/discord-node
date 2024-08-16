const { userMention } = require("discord.js");
const prefix = "^";

function prefixCommand(message) {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ + /);
  const command = args.shift().toLowerCase();
  console.log(command);

  if (command == "dev") {
    message.channel.send(`At your service! ${userMention(message.author.id)}`);
  }
  if (command == "info") {
    return message.channel.send(
      `Welcome ${userMention(message.author.id)} , I am DevNode's beta version!`
    );
  }

  
}

module.exports = prefixCommand;
