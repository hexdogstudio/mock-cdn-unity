import { config as _config } from "dotenv";
import express, { static as _static } from "express";
import fs from "node:fs";
import path from "node:path";

_config();

const app = express();
const config = {
  port: parseInt(process.env.PORT || "1080"),
  failureRate: parseFloat(process.env.FAILUR_RATE || "0"),
  minLatency: parseInt(process.env.MIN_LATENCY || "100"),
  maxLetancy: parseInt(process.env.MAX_LATENCY || "500"),
  resourceDir: process.env.RESOURCE_DIR || "ServerData",
  verbose: process.env.VERBOSE?.toLowerCase() == "true",
};

function log(tag, message) {
  config.verbose && console.log(`[${tag.toUpperCase()}] ${message}`);
}

function logln(tag, message) {
  config.verbose && console.log(`\n[${tag.toUpperCase()}] ${message}`);
}

function warn(tag, message) {
  config.verbose && console.warn(`[${tag.toUpperCase()}] ${message}`);
}

function error(tag, message) {
  config.verbose && console.error(`[${tag.toUpperCase()}] ${message}`);
}

function containsBundleFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (containsBundleFiles(fullPath)) return true;
    } else if (entry.isFile() && fullPath.endsWith(".bundle")) {
      log("found", `Asset Bundle at: ${fullPath}`);
      return true;
    }
  }

  return false;
}

try {
  log("init", `Checking resource directory: ${config.resourceDir}`);

  if (!fs.existsSync(config.resourceDir)) {
    error("error", "Resource directory does not exist.");
    process.exit(1);
  }

  log("scen", "Searching for Asset Bundles...");
  if (!containsBundleFiles(config.resourceDir)) {
    error("error", `No Asset Bundle found in: ${config.resourceDir}`);
    process.exit(1);
  }

  log("ok", "Asset Bundle found. Starting server...");
} catch (err) {
  error("exception", `Error during startup:\n${err}`);
  process.exit(1);
}

app.use((req, res, next) => {
  const latency =
    Math.random() * (config.maxLetancy - config.minLatency) + config.minLatency;

  setTimeout(() => {
    log("req", `${req.method} ${req.url} [~${Math.round(latency)}ms]`);

    if (Math.random() < config.failureRate) {
      warn("failure", "Simulated CDN failure");
      res.status(503).send("Simulated CDN failure");
    } else {
      next();
    }
  }, latency);
});

app.use(_static(config.resourceDir));

app.listen(config.port, () => {
  if (config.verbose)
    log("ready", `Mock CDN running at http://localhost:${config.port}`);
  else console.log(`Mock CDN running at http://localhost:${config.port}`);
});

process.on("SIGINT", () => {
  if (config.verbose) logln("shutdown", "Server stopped by user.");
  else console.log("\nServer stopped by user.");
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (config.verbose) logln("shutdown", "Server received termination signal.");
  else console.log("\nServer received termination signal.");
  process.exit(0);
});
