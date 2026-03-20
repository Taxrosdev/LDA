import ollama from "ollama"
import type { Message } from "ollama"
import * as env from "./env.ts"

let model = env.MODEL
let system = env.MODEL

export async function generate(messages: Message[]): Promise<string> {
    let res = await ollama.chat({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        think: false
    });
    return res.message.content;
}
