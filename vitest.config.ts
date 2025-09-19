import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: [path.join(__dirname, "test", "setup.ts")],
        globals: false,
        coverage: {
            reporter: ["text", "lcov"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
