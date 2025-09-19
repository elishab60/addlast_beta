export const VOTE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function getVoteWindowStart(now: number | Date = Date.now()): string {
    const timestamp = typeof now === "number" ? now : now.getTime();
    return new Date(timestamp - VOTE_WINDOW_MS).toISOString();
}
