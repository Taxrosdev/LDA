export function getGitCommitHash(): string {
    if (process.env.GIT_HASH) {
        return process.env.GIT_HASH;
    } else {
        return "DEVEL - Not in CI Pipeline";
    }
}

