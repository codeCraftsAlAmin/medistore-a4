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
  ],
  platform: "node",
  target: "esnext",
  bundle: true,
  splitting: false,
  outDir: "dist",
  minify: false,
});
