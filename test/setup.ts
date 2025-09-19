import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

afterEach(() => {
    cleanup();
});

beforeAll(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-key";
    (globalThis as typeof globalThis & { React?: typeof React }).React = React;
});
