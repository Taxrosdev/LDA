import ollama from "ollama"
import type { Message } from "ollama"

let model = "qwen3.5:4b"
let system = "You are qwen3.5:4b. The date is 21/3/26."

export async function generate(messages: Message[]): Promise<string> {
    let res = await ollama.chat({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        think: false
    });
    return res.message.content;
}
