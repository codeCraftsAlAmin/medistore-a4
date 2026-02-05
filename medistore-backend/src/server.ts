import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.server.port;

if (process.env.NODE_ENV !== "production") {
  async function main() {
    try {
      await prisma.$connect();
      console.log("Successfully connected ~🎉");
      app.listen(port, () => {
        console.log(`Server is running on ~🚀 http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Something went wrong", error);
      process.exit(1);
    }
  }

  main();
}

export default app;
