import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import { dbConfig } from "./db/config.js";
import { rateLimiter } from "./middleware/rate-limiter.js";
import v1Routes from "./routes/v1/routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../swagger-output.json"), "utf-8")
);


await dbConfig(process.env.MONGOURI);

const app = express();

app.use(express.json());

//middlewares
app.use(rateLimiter);

app.use(
  cors({
    origin:[
      'http://localhost:3000',
    ],
    methods: ['GET','POST','PATCH','DELETE'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials:true,
  })
)

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/api/v1", v1Routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
