import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import type { TextBasedChannel, Message as DiscordMessage } from "discord.js"
import * as llm from "./llm.ts"
import type { Message } from "ollama"
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
