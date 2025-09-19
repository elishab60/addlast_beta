import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const fileName = fileURLToPath(import.meta.url);
const baseDir = dirname(fileName);

const compat = new FlatCompat({
  baseDirectory: baseDir,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
