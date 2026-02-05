import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  clean: true,
  external: [
    /^dotenv/,
    /^@prisma/,
    /^express/,
    /^cors/,
    /^nodemailer/,
    "pg-native",
  ],
  platform: "node",
  target: "esnext",
  bundle: true,
  splitting: false,
  outDir: "api",
  minify: false,
});
