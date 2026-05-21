/* eslint-env node */
/* global require, process, __dirname */
/**
 * TalentTurbo — Reference Backend (Node.js + Express)
 *
 * In-memory store for development. Replace with a real database for production.
 * JWT_SECRET should be set in your environment.
 */

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";

app.use(cors());
app.use(express.json());

// ─── In-memory store ──────────────────────────────────────────────────────────

const db = {
  users: [],
  entities: {}, // { [entityName]: { [id]: record } }
};

function getCollection(name) {
  if (!db.entities[name]) db.entities[name] = {};
  return db.entities[name];
}

// ─── Auth middleware ──────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ─── Auth routes ──────────────────────────────────────────────────────────────

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  const { password_hash, ...safe } = user;
  res.json({ token, user: safe });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const { password_hash, ...safe } = user;
  res.json(safe);
});

app.patch("/api/auth/me", requireAuth, (req, res) => {
  const idx = db.users.findIndex((u) => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ message: "User not found" });
  // Never allow overwriting password or role via this endpoint
  const { password_hash, role, id, email, ...updates } = req.body;
  db.users[idx] = { ...db.users[idx], ...updates };
  const { password_hash: _, ...safe } = db.users[idx];
  res.json(safe);
});

// ─── User invite ──────────────────────────────────────────────────────────────

app.post("/api/users/invite", requireAuth, async (req, res) => {
  const { email, role = "user" } = req.body;
  if (db.users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "User already exists" });
  }
  const tempPassword = Math.random().toString(36).slice(2, 10);
  const password_hash = await bcrypt.hash(tempPassword, 10);
  const user = {
    id: uuid(),
    email,
    full_name: email.split("@")[0],
    role,
    password_hash,
    created_date: new Date().toISOString(),
  };
  db.users.push(user);
  // In production: send invite email here
  console.log(`[invite] ${email} — temp password: ${tempPassword}`);
  res.json({ message: "Invited", email, tempPassword });
});

// ─── Entity CRUD ──────────────────────────────────────────────────────────────

app.get("/api/entities/:name", (req, res) => {
  const col = getCollection(req.params.name);
  let records = Object.values(col);

  // Simple query filtering (exact match per query param, ignoring sort/limit)
  const { sort = "-created_date", limit = 100, ...filters } = req.query;
  for (const [key, val] of Object.entries(filters)) {
    records = records.filter((r) => String(r[key]) === val);
  }

  // Sort
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  records.sort((a, b) => {
    if (a[field] < b[field]) return desc ? 1 : -1;
    if (a[field] > b[field]) return desc ? -1 : 1;
    return 0;
  });

  res.json(records.slice(0, Number(limit)));
});

app.get("/api/entities/:name/:id", (req, res) => {
  const col = getCollection(req.params.name);
  const record = col[req.params.id];
  if (!record) return res.status(404).json({ message: "Not found" });
  res.json(record);
});

app.post("/api/entities/:name", requireAuth, (req, res) => {
  const col = getCollection(req.params.name);
  const record = {
    id: uuid(),
    ...req.body,
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    created_by: req.user.email,
  };
  col[record.id] = record;
  res.status(201).json(record);
});

app.post("/api/entities/:name/bulk", requireAuth, (req, res) => {
  const col = getCollection(req.params.name);
  const items = req.body;
  const created = items.map((item) => {
    const record = {
      id: uuid(),
      ...item,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      created_by: req.user.email,
    };
    col[record.id] = record;
    return record;
  });
  res.status(201).json(created);
});

app.patch("/api/entities/:name/:id", requireAuth, (req, res) => {
  const col = getCollection(req.params.name);
  if (!col[req.params.id]) return res.status(404).json({ message: "Not found" });
  col[req.params.id] = {
    ...col[req.params.id],
    ...req.body,
    updated_date: new Date().toISOString(),
  };
  res.json(col[req.params.id]);
});

app.delete("/api/entities/:name/:id", requireAuth, (req, res) => {
  const col = getCollection(req.params.name);
  if (!col[req.params.id]) return res.status(404).json({ message: "Not found" });
  delete col[req.params.id];
  res.status(204).send();
});

app.get("/api/entities/:name/schema", (req, res) => {
  res.json({ type: "object", properties: {} });
});

// ─── File upload ──────────────────────────────────────────────────────────────

const upload = multer({ dest: path.join(__dirname, "uploads/") });
fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });

app.post("/api/integrations/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  // In production: upload to S3/R2/etc. and return a public URL
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ file_url: fileUrl });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Integration stubs ────────────────────────────────────────────────────────

app.post("/api/integrations/llm", requireAuth, async (req, res) => {
  // Wire up to OpenAI, Anthropic, etc.
  // Example with OpenAI:
  // const { OpenAI } = require("openai");
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const completion = await openai.chat.completions.create({ ... });
  res.json("Implement LLM integration in server/index.js");
});

app.post("/api/integrations/email", requireAuth, async (req, res) => {
  // Wire up to Resend, SendGrid, Nodemailer, etc.
  console.log("[email]", req.body);
  res.json({ sent: true });
});

// ─── Backend functions ────────────────────────────────────────────────────────

app.post("/api/functions/checkJobAlerts", requireAuth, async (req, res) => {
  // Port the logic from functions/checkJobAlerts.js here
  res.json({ message: "Implement checkJobAlerts in server/index.js" });
});

// ─── SSE real-time events (stub) ─────────────────────────────────────────────

app.get("/api/events/:name", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  // Keep connection alive; push events here as needed
  const interval = setInterval(() => res.write(": ping\n\n"), 30000);
  req.on("close", () => clearInterval(interval));
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`TalentTurbo backend running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});