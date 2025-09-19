import { describe, it, expect } from "vitest";
import { evaluateVoteEligibility, VoteRecord } from "../voteRules";

describe("evaluateVoteEligibility", () => {
    const now = new Date("2024-01-31T12:00:00.000Z");

    const vote = (overrides: Partial<VoteRecord>): VoteRecord => ({
        product_id: "product-1",
        created_at: new Date(now.getTime() - 1_000).toISOString(),
        ...overrides,
    });

    it("allows voting when under the limit and no duplicate", () => {
        const records: VoteRecord[] = [vote({ product_id: "product-2" })];

        const result = evaluateVoteEligibility(records, "product-1", now);

        expect(result.canVote).toBe(true);
    });

    it("rejects duplicate votes within the window", () => {
        const records: VoteRecord[] = [vote({})];

        const result = evaluateVoteEligibility(records, "product-1", now);

        expect(result).toEqual({ canVote: false, reason: "duplicate" });
    });

    it("rejects when the monthly limit is reached", () => {
        const records: VoteRecord[] = [vote({ product_id: "a" }), vote({ product_id: "b" })];

        const result = evaluateVoteEligibility(records, "product-3", now);

        expect(result).toEqual({ canVote: false, reason: "limit", remaining: 0 });
    });

    it("ignores votes older than 30 days", () => {
        const oldVote = vote({ created_at: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString() });
        const records: VoteRecord[] = [oldVote];

        const result = evaluateVoteEligibility(records, "product-1", now);

        expect(result.canVote).toBe(true);
    });
});
