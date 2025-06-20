import { config as _config } from "dotenv";
import express, { static as _static } from "express";
import fs from "node:fs";

_config();

const app = express();
const config = {
  port: process.env.PORT,
  failureRate: process.env.FAILUR_RATE,
  minLatency: process.env.MIN_LATENCY,
  maxLetancy: process.env.MAX_LATENCY,
  resourceDir: process.env.RESOURCE_DIR,
};

try {
  if (!fs.existsSync(config.resourceDir)) fs.mkdirSync(config.resourceDir);
} catch (err) {
  console.error(err);
}

app.use((req, res, next) => {
  const latency =
    Math.random() * (config.maxLetancy - config.minLatency) + config.minLatency;
  setTimeout(() => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    if (Math.random() < config.failureRate) {
      console.log("[RES] Simulated CDN failure");
      res.status(503).send("Simulated CDN failure");
    } else next();
  }, latency);
});

app.use(_static(config.resourceDir));
app.listen(config.port, () =>
  console.log(`Mock CDN running on http://localhost:${config.port}`)
);
