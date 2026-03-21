import { REST, Routes } from "discord.js"
import * as env from "./env"
import path from "node:path";
import fs from "node:fs/promises"

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Load Commands
for (const file of await fs.readdir(commandsPath)) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if (command.data && command.execute) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`${filePath} does not have 'data' or 'execute'.`);
    }
}

// Push Commands
const rest = new REST().setToken(env.DISCORD_TOKEN);

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commands }) as string;

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.error(error);
}
