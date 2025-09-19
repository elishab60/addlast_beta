export type VoteActionResult = {
    ok: boolean;
    status?: number;
    message?: string;
    votes?: number;
};

type VoteMethod = "POST" | "DELETE";

async function callVotesEndpoint(method: VoteMethod, productId: string): Promise<VoteActionResult> {
    try {
        const response = await fetch("/api/votes", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
            credentials: "include",
        });

        let payload: { message?: string; votes?: number } = {};

        try {
            payload = (await response.json()) ?? {};
        } catch {
            // Ignore JSON parse errors – payload will stay empty
        }

        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                message: payload?.message,
            };
        }

        return {
            ok: true,
            status: response.status,
            message: payload?.message,
            votes: payload?.votes,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur réseau";
        return {
            ok: false,
            message,
        };
    }
}

export function createVote(productId: string) {
    return callVotesEndpoint("POST", productId);
}

export function removeVote(productId: string) {
    return callVotesEndpoint("DELETE", productId);
}
