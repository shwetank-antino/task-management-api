import http from "node:http";
import { configDotenv } from "dotenv";
import app from "./src/app.js";

configDotenv();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err.message);
  process.exit(1);
});
const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
