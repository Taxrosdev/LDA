import { Client, Events, GatewayIntentBits, Partials, MessageFlags } from "discord.js";
import type { TextBasedChannel, Message as DiscordMessage, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import path from "node:path"
import fs from "node:fs/promises"
import type { Message } from "ollama"
import * as llm from "./llm.ts"
import * as env from "./env.ts"

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.Channel] });

const message_cache: { [key: string]: Message[] } = {}

client.once(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
    let channel = message.channel;
    if (message.guild) return;
    if (message.author.bot) return;

    let history = message_cache[message.channel.id];

    if (!history) {
        let raw_messages = await load_messages(message.channel);
        history = raw_messages.reverse();
        message_cache[message.channel.id] = history;
    } else {
        history.push(map_message(message))
    }

    channel.sendTyping();

    let res = await llm.generate(history)
    message.reply(res)

    history.push({ content: res, role: "assistant" })
})

client.login(env.DISCORD_TOKEN);

async function load_messages(channel: TextBasedChannel): Promise<Message[]> {
    let messages = await channel.messages.fetch({ limit: 50 })

    return messages.map(map_message);
}

function map_message(message: DiscordMessage): Message {
    return {
        role: message.author.bot ? "assistant" : "user",
        content: message.content
    }
}

// Command Handling
const commands: { [key: string]: { data: SlashCommandBuilder, execute: (interaction: ChatInputCommandInteraction) => Promise<void> } } = {};
const commands_path = path.join(__dirname, 'commands');

for (const file of await fs.readdir(commands_path)) {
    const filePath = path.join(commands_path, file);
    const command = await import(filePath);

    if ('data' in command && command.execute) {
        commands[command.data.name] = command;
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = commands[interaction.commandName];

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});
