import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import { dbConfig } from "./db/config.js";
import { rateLimiter } from "./middleware/rate-limiter.js";

await dbConfig(process.env.MONGOURI);

const app = express();

app.use(express.json());

//middlewares
app.use(rateLimiter());

app.get("/", (req, res) => {
  res.send("Hello, World");
});

export default app;
