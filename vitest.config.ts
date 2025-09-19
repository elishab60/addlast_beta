import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: [path.join(dirname, "test", "setup.ts")],
        globals: false,
        coverage: {
            reporter: ["text", "lcov"],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(dirname, "src"),
        },
    },
});
