import { SlashCommandBuilder } from "discord.js";
import { getGitCommitHash } from "../utils/git.ts" with { type: "macro" };
import type { ChatInputCommandInteraction } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName('version')
    .setDescription('Gets the version and commit information');

export async function execute(interaction: ChatInputCommandInteraction) {
    // Feel free to patch this out if this isn't your thing
    let repository = "https://github.com/taxrosdev/LDA";

    await interaction.reply(`I'm running commit \`${getGitCommitHash()}\`\nRuntime information:\nBun ${Bun.version}.\n\nYou can check for the latest version at \`${repository}\``);
}
