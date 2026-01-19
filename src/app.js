import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import { dbConfig } from "./db/config.js";
import { rateLimiter } from "./middleware/rate-limiter.js";
import v1Routes from "./routes/v1/routes.js";

await dbConfig(process.env.MONGOURI);

const app = express();

app.use(express.json());

//middlewares
app.use(rateLimiter());

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/api/v1", v1Routes);

export default app;
