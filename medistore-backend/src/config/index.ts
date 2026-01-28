import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  server: {
    port: process.env.PORT || 8000,
  },
  urls: {
    frontend_url: process.env.FRONTEND_URL || "",
    backend_url: process.env.BACKEND_URL || "",
    neon_db_url: process.env.DATABASE_URL || "",
  },
  auth: {
    better_auth_sec: process.env.BETTER_AUTH_SECRET || "",
    better_auth_url: process.env.BETTER_AUTH_URL || "",
  },
  google_credentials: {
    client_id: process.env.CLIENT_ID || "",
    client_secret: process.env.CLIENT_SECRET || "",
  },
  node_mailer: {
    google_account: process.env.GOOGLE_ACC || "",
    google_pass: process.env.GOOGLE_PASS || "",
  },
};

export default config;
