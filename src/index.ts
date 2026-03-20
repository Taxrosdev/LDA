import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import * as llm from "./llm.ts"

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.Channel] });

client.once(Events.ClientReady, client => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.once(Events.MessageCreate, async (message) => {
    let channel = message.channel;
    if (message.guild) return;

    channel.sendTyping();

    let res = await llm.generate([{ role: "user", content: message.content }])
    message.reply(res)
})

client.login(process.env.DISCORD_TOKEN);

