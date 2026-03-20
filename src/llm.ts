import ollama from "ollama"
import type { Message } from "ollama"
import * as env from "./env.ts"

let model = env.MODEL
let system = env.MODEL

export async function generate(messages: Message[]): Promise<string> {
    let res = await ollama.chat({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        think: false,
        options: {
            // 500 tokens, safe for roughly 4 characters per 1 token
            num_predict: 500
        }
    });

    let content = res.message.content.slice(0, 2000);

    return content;
}
