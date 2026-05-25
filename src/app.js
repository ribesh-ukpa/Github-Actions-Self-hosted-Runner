const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || "1.0.0";

app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.json({
    message: "Hello from the dummy app!",
    version: APP_VERSION,
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    hostname: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/info", (req, res) => {
  res.json({
    version: APP_VERSION,
    node: process.version,
    platform: os.platform(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
    },
  });
});

// ── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Version: ${APP_VERSION}`);
});

module.exports = app;