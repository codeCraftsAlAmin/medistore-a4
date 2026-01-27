import app from "./app";
import config from "./config";

const port = config.server.port;

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on ~🚀 http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Something went wrong", error);
    process.exit(1);
  }
}

main();
