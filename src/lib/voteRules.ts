export type VoteRecord = {
    product_id: string;
    created_at: string;
};

export type VoteRejectionReason = "duplicate" | "limit";

export type VoteEvaluation =
    | { canVote: true }
    | { canVote: false; reason: VoteRejectionReason; remaining?: number };

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export function evaluateVoteEligibility(
    records: VoteRecord[],
    productId: string,
    now: Date = new Date(),
    limit = 2,
    windowMs = THIRTY_DAYS
): VoteEvaluation {
    const windowStart = new Date(now.getTime() - windowMs);

    const recentVotes = records.filter((record) => new Date(record.created_at) >= windowStart);

    if (recentVotes.some((record) => record.product_id === productId)) {
        return { canVote: false, reason: "duplicate" };
    }

    if (recentVotes.length >= limit) {
        return { canVote: false, reason: "limit", remaining: 0 };
    }

    return { canVote: true };
}
