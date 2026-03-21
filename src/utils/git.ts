export function getGitCommitHash(): string {
    const { stdout } = Bun.spawnSync({
        cmd: ["git", "rev-parse", "HEAD"],
        stdout: "pipe",
    });

    return stdout.toString().replaceAll("\n", "");
}

