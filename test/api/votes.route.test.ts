import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE, GET, POST } from "@/app/api/votes/route";
import { supabaseRoute } from "@/lib/supabaseRoute";

vi.mock("@/lib/supabaseRoute", () => ({
    supabaseRoute: vi.fn(),
}));

type SupabaseMock = {
    auth: {
        getUser: ReturnType<typeof vi.fn>;
    };
    from: ReturnType<typeof vi.fn>;
};

const mockedSupabaseRoute = supabaseRoute as unknown as ReturnType<typeof vi.fn>;

function futureTimestamp() {
    return Math.floor(Date.now() / 1000) + 60;
}

function createFilterChain(result: unknown) {
    const final = () => Promise.resolve(result);
    const chain: any = {
        eq: vi.fn(() => chain),
        limit: vi.fn(() => final()),
        maybeSingle: vi.fn(() => final()),
        then: (resolve: (value: unknown) => void, reject?: (reason: unknown) => void) =>
            final().then(resolve, reject),
    };

    return chain;
}

function createSelectBuilder(result: unknown) {
    const chain = createFilterChain(result);
    return {
        select: vi.fn(() => chain),
    } as const;
}

function createInsertBuilder(result: unknown) {
    return {
        insert: vi.fn(() => Promise.resolve(result)),
    } as const;
}

function createDeleteBuilder(result: unknown) {
    const chain = createFilterChain(result);
    return {
        delete: vi.fn(() => chain),
    } as const;
}

function createSupabaseMock(steps: Array<Record<string, unknown>>): SupabaseMock {
    const queue = [...steps];

    return {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn(() => {
            const next = queue.shift();

            if (!next) {
                throw new Error("Unexpected call to from()");
            }

            return next;
        }),
    };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("/api/votes", () => {
    it("allows a user fetched from Supabase to vote", async () => {
        const supabase = createSupabaseMock([
            createSelectBuilder({ data: null, error: null }),
            createInsertBuilder({ error: null }),
            createSelectBuilder({ count: 3, error: null }),
        ]);

        supabase.auth.getUser.mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
        });

        mockedSupabaseRoute.mockResolvedValue({
            supabase,
            session: { access_token: "token", expires_at: futureTimestamp() },
        });

        const request = new Request("http://localhost/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: "product-1" }),
        });

        const response = await POST(request);
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload).toEqual({
            message: "Ton vote a bien été pris en compte !",
            votes: 3,
        });
        expect(supabase.auth.getUser).toHaveBeenCalledWith("token");
    });

    it("returns 401 when the user is not authenticated", async () => {
        const supabase = createSupabaseMock([]);

        mockedSupabaseRoute.mockResolvedValue({ supabase, session: null });

        const request = new Request("http://localhost/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: "product-1" }),
        });

        const response = await POST(request);

        expect(response.status).toBe(401);
        expect(supabase.from).not.toHaveBeenCalled();
    });

    it("reports when the authenticated user already voted", async () => {
        const supabase = createSupabaseMock([
            createSelectBuilder({ data: { id: "vote-1" }, error: null }),
        ]);

        mockedSupabaseRoute.mockResolvedValue({
            supabase,
            session: {
                access_token: "token",
                expires_at: futureTimestamp(),
                user: { id: "user-123" } as any,
            },
        });

        const request = new Request("http://localhost/api/votes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: "product-1" }),
        });

        const response = await POST(request);
        const payload = await response.json();

        expect(response.status).toBe(409);
        expect(payload.message).toContain("déjà liké");
    });

    it("returns the vote status for an authenticated user", async () => {
        const supabase = createSupabaseMock([
            createSelectBuilder({ count: 5, error: null }),
            createSelectBuilder({ data: [{ id: "vote-1" }], error: null }),
        ]);

        mockedSupabaseRoute.mockResolvedValue({
            supabase,
            session: {
                access_token: "token",
                expires_at: futureTimestamp(),
                user: { id: "user-123" } as any,
            },
        });

        const response = await GET(new Request("http://localhost/api/votes?productId=product-1"));
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload).toEqual({ votes: 5, userVoted: true });
    });

    it("removes a vote when requested by an authenticated user", async () => {
        const supabase = createSupabaseMock([
            createSelectBuilder({ data: { id: "vote-1" }, error: null }),
            createDeleteBuilder({ error: null }),
            createSelectBuilder({ count: 0, error: null }),
        ]);

        mockedSupabaseRoute.mockResolvedValue({
            supabase,
            session: {
                access_token: "token",
                expires_at: futureTimestamp(),
                user: { id: "user-123" } as any,
            },
        });

        const request = new Request("http://localhost/api/votes", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: "product-1" }),
        });

        const response = await DELETE(request);
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload).toEqual({
            message: "Ton like a bien été retiré.",
            votes: 0,
        });
    });
});

