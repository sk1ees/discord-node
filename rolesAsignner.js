const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.commandName === "roles") {
    const roles = [];

    interaction.guild.roles.cache.forEach((role) => {
      console.log(role.tags);
      if (role.name !== "@everyone" && Object.keys(role.tags).length <= 0) {
        roles.push({
          id: role.id,
          label: role.name,
          emoji: "🔘",
        });
      }
    });

    await interaction.reply({
      content: "Setting up roles...",
      ephemeral: true,
    });

    await roleManage(interaction, roles);
  }

  async function roleManage(interaction, roles) {
    try {
      const channel = client.channels.cache.get(interaction.channelId);
      if (!channel) return;

      let rows = [];
      let messageChunks = [];

      roles.forEach((role, index) => {
        if (rows.length === 5) {
          messageChunks.push(rows);
          rows = [];
        }

        rows.push(
          new ButtonBuilder()
            .setCustomId(role.id)
            .setLabel(role.label)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(role.emoji)
        );
      });

      if (rows.length > 0) {
        messageChunks.push(rows);
      }

      const embed = new EmbedBuilder()
        .setTitle("Role Selection")
        .setDescription("Select your roles by clicking the buttons below.")
        .setColor(0x00ae86);
      await channel.send({
        content: "Claim your roles!",
        embeds: [embed],
      });
      for (const chunk of messageChunks) {
        const actionRow = new ActionRowBuilder().addComponents(chunk);
        await channel.send({
          components: [actionRow],
        });
      }
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
        content: `The role ${role.name} has been removed!`,
        ephemeral: true,
      });
    } else {
      await interaction.member.roles.add(role);
      await interaction.reply({
        content: `The role ${role.name} has been added!`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(token);
