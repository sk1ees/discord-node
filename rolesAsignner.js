const {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { token } = require("./config.json");
const { EmbedBuilder } = require("discord.js");
const prefixCommand = require("./prefix-commands");
const prefix = "^";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const roles = [
  {
    id: "1273861548733108306",
    label: "Red",
    emoji: "🔴",
  },
  {
    id: "1273861464700092556",
    label: "Green",
    emoji: "🍀",
  },
];

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "roles") {
    interaction.guild.roles.cache.forEach((role) => {
      console.log(`Role Name: ${role.name}, Role ID: ${role.id} `);
    //   console.log(Object.keys(role.tags).length);
    });
    await interaction.reply({
      content: "Setting up roles...",
      ephemeral: true,
    });
    await roleManage(interaction);
  }

  async function roleManage(interaction) {
    try {
      const channel = await client.channels.cache.get(
        `${interaction.channelId}`
      );
      // console.log(channel);
      if (!channel) return;

      const row = new ActionRowBuilder();

      roles.forEach((role) => {
        if (role.label == "Red") {
          row.components.push(
            new ButtonBuilder()
              .setCustomId(role.id)
              .setLabel(role.label)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji(role.emoji)
          );
        }
        if (role.label == "Green") {
          row.components.push(
            new ButtonBuilder()
              .setCustomId(role.id)
              .setLabel(role.label)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji(role.emoji)
          );
        }
      });

      await channel.send({
        content: "Claim your roles!",
        components: [row],
      });
      //   process.exit();
    } catch (error) {
      console.log(error);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      await interaction.reply({
        content: "Role not found in this server!",
        ephemeral: true,
      });
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);

    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.reply({
        content: `The role ${role} has been removed!`,
        ephemeral: true,
      });
    } else {
      await interaction.member.roles.add(role);
      await interaction.reply({
        content: `The role ${role} has been added!`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(token);
