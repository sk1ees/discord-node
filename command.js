const { REST, Routes } = require("discord.js");
const { token, CLIENT_ID } = require("./config.json");

const commands = [
  {
    name: "waifu",
    description: "Replies with a random waifu!",
  },
  {
    name: "joke",
    description: "Replies with a random joke!",
  },
  {
    name: "roles",
    description: "change your color roles",
  },
];

const rest = new REST({ version: "10" }).setToken(token);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
