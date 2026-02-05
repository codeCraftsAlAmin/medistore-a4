import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  clean: true,
  external: [
    /^dotenv/,
    /^@prisma/,
    /^better-auth/,
    /^express/,
    /^cors/,
    /^nodemailer/,
  ],
  noExternal: [],
  platform: "node",
  target: "node20",
  bundle: true,
  shims: false,
  dts: false,
});
