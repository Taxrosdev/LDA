function get_env(env: string): string {
    if (typeof process.env[env] == "undefined") {
        console.error(`${env} is not set!`)
        process.exit(1)
    }

    return process.env[env];
}

export const MODEL = get_env("MODEL")
export const SYSTEM = get_env("SYSTEM")
export const DISCORD_TOKEN = get_env("DISCORD_TOKEN")
