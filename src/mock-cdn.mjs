import { config as _config } from "dotenv";
import express, { static as _static } from "express";
import path, { join } from "path";
import { fileURLToPath } from "url";
_config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const config = {
  port: process.env.PORT,
  failureRate: process.env.FAILUR_RATE,
  minLatency: process.env.MIN_LATENCY,
  maxLetancy: process.env.MAX_LATENCY,
  resourceDir: process.env.RESOURCE_DIR,
};

app.use((req, res, next) => {
  const delay =
    Math.random() * (config.maxLetancy - config.minLatency) + config.minLatency;
  setTimeout(() => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    if (Math.random() < config.failureRate) {
      console.log("[RES] Simulated CDN failure");
      res.status(503).send("Simulated CDN failure");
    } else next();
  }, delay);
});

app.use(_static(join(__dirname, config.resourceDir)));
app.listen(config.port, () =>
  console.log(`Mock CDN running on http://localhost:${config.port}`)
);
