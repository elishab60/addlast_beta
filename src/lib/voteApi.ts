type VoteActionMethod = "POST" | "DELETE";

export type VoteStatus = {
    votes: number;
    userVoted: boolean;
};

export type VoteActionResult = {
    ok: boolean;
    status: number;
    message: string;
    votes?: number;
};

async function requestVoteAction(method: VoteActionMethod, productId: string): Promise<VoteActionResult> {
    const response = await fetch("/api/votes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
        cache: "no-store",
    });

    const payload = (await response
        .json()
        .catch(() => ({}) as Record<string, unknown>)) as Record<string, unknown>;

    return {
        ok: response.ok,
        status: response.status,
        message: typeof payload.message === "string" ? payload.message : "",
        votes: typeof payload.votes === "number" ? payload.votes : undefined,
    };
}

export async function voteForProduct(productId: string): Promise<VoteActionResult> {
    return requestVoteAction("POST", productId);
}

export async function removeVoteForProduct(productId: string): Promise<VoteActionResult> {
    return requestVoteAction("DELETE", productId);
}

export async function fetchVoteStatus(productId: string): Promise<VoteStatus> {
    const response = await fetch(`/api/votes?productId=${encodeURIComponent(productId)}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to fetch vote status");
    }

    const payload = (await response.json()) as Record<string, unknown>;

    return {
        votes: typeof payload.votes === "number" ? payload.votes : 0,
        userVoted: Boolean(payload.userVoted),
    };
}
