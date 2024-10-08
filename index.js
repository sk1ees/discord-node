const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const { token } = require("./config.json");
const { EmbedBuilder } = require("discord.js");
const prefixCommand = require("./prefix-commands");
const roleAssign = require("./rolesAsignner");
const prefix = "^";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("messageCreate", (message) => {
  prefixCommand(message);
});

client.on("interactionCreate", (interaction) => {
  // console.log(interaction.commandName);

  if (interaction.commandName === "waifu") {
    fetch(`https://api.waifu.im/search`)
      // https://api.waifu.im/search/?included_tags=maid
      .then((response) => response.json())
      .then(async (data) => {
        const exampleEmbed = new EmbedBuilder()
          .setColor(data.images[0].dominant_color)
          .setTitle(data.images[0].tags[0].description)
          .setImage(data.images[0].url);
        //   const joke = data[0];
        await interaction.reply(
          {
            embeds: [exampleEmbed],
          } /*`${joke.setup} Answer: ${joke.punchline}`*/
        );
      });
  }
  if (interaction.commandName === "joke") {
    fetch("https://official-joke-api.appspot.com/jokes/programming/random")
      .then((response) => response.json())
      .then(async (data) => {
        const joke = data[0];
        await interaction.reply(`${joke.setup} Answer: ${joke.punchline}`);
      });
  }
});

// ...
client.on("ready", (c) => {
  client.user.setPresence({
    status: "dnd",
    activities: [
      {
        name: ".dev",
        type: ActivityType.Competing,
        details: "working!",
      },
    ],
  });
});

client.login(token);
