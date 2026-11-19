"use strict";

const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const REG_DIR = path.join(DATA_DIR, "registers");
const FILES_DIR = path.join(ROOT, "files");
const BACKUP_DIR = path.join(ROOT, "backup");
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
};

const safeId = id => String(id || "").replace(/[\\/:*?"<>|#%]+/g, "_").replace(/\s+/g, " ").trim().slice(-80) || "file";

function fmtReg(reg) {
  const { records = [], ...meta } = reg;
  const head = JSON.stringify(meta, null, 2);
  return `${head.slice(0, -2)},\n  "records": [${records.length ? "\n" + records.map(r => "    " + JSON.stringify(r)).join(",\n") + "\n  " : ""}]\n}\n`;
}

function sendJSON(res, code, obj) {
  const body = Buffer.from(JSON.stringify(obj), "utf8");
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": body.length
  });
  res.end(body);
}

function readBody(req, maxBytes = 50 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let len = 0;
    req.on("data", chunk => {
      len += chunk.length;
      if (len > maxBytes) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function resolveInside(baseDir, relPath) {
  const norm = path.normalize(String(relPath || "").replace(/^[/\\]+/, ""));
  const abs = path.resolve(baseDir, norm);
  const base = path.resolve(baseDir);
  if (abs !== base && !abs.startsWith(base + path.sep)) return null;
  return abs;
}

async function autoBackupToday() {
  const today = new Date().toLocaleDateString("sv-SE");
  const dest = path.join(BACKUP_DIR, today);
  try {
    await fsp.access(path.join(dest, "app.json"));
    return;
  } catch (e) {}
  try {
    await fsp.access(path.join(DATA_DIR, "app.json"));
  } catch (e) {
    return;
  }
  const destReg = path.join(dest, "registers");
  await fsp.mkdir(destReg, { recursive: true });
  await fsp.copyFile(path.join(DATA_DIR, "app.json"), path.join(dest, "app.json"));
  const entries = await fsp.readdir(REG_DIR).catch(() => []);
  for (const name of entries) {
    if (name.endsWith(".json")) {
      await fsp.copyFile(path.join(REG_DIR, name), path.join(destReg, name));
    }
  }
}

async function saveStorePayload(payload) {
  const { app, regs } = payload || {};
  if (!app || !Array.isArray(regs)) throw new Error("Invalid store payload");

  await fsp.mkdir(REG_DIR, { recursive: true });
  await autoBackupToday().catch(() => {});

  const keep = new Set();
  for (const reg of regs) {
    if (!reg || !reg.id) continue;
    const fname = `${safeId(reg.id)}.json`;
    keep.add(fname);
    await fsp.writeFile(path.join(REG_DIR, fname), fmtReg(reg), "utf8");
  }

  const existing = await fsp.readdir(REG_DIR).catch(() => []);
  for (const name of existing) {
    if (name.endsWith(".json") && !keep.has(name)) {
      await fsp.unlink(path.join(REG_DIR, name)).catch(() => {});
    }
  }

  await fsp.writeFile(path.join(DATA_DIR, "app.json"), JSON.stringify(app, null, 2) + "\n", "utf8");

  // Keep pages.config.js synchronized for fallback / download
  const { registers, format, ...rest } = app;
  const fullCfg = { ...rest, datasets: regs };
  const cfgJs = `window.DASHBOARD_CONFIG = ${JSON.stringify(fullCfg, null, 2)};\n`;
  await fsp.writeFile(path.join(ROOT, "pages.config.js"), cfgJs, "utf8");
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(u.pathname);

    // 1. Health / capability check
    if (pathname === "/api/health" && req.method === "GET") {
      return sendJSON(res, 200, { ok: true, mode: "server" });
    }

    // 2. Save data/app.json + data/registers/*.json + pages.config.js
    if (pathname === "/api/store" && req.method === "POST") {
      const raw = await readBody(req);
      const payload = JSON.parse(raw.toString("utf8"));
      await saveStorePayload(payload);
      return sendJSON(res, 200, { ok: true });
    }

    // 3. Upload or delete attachment file under files/
    if (pathname === "/api/file" && (req.method === "PUT" || req.method === "DELETE")) {
      const rel = u.searchParams.get("path") || "";
      if (!rel.startsWith("files/")) return sendJSON(res, 400, { ok: false, error: "Invalid file path" });
      const abs = resolveInside(FILES_DIR, rel.slice("files/".length));
      if (!abs) return sendJSON(res, 400, { ok: false, error: "Path traversal blocked" });

      if (req.method === "PUT") {
        const buf = await readBody(req);
        await fsp.mkdir(path.dirname(abs), { recursive: true });
        await fsp.writeFile(abs, buf);
        return sendJSON(res, 200, { ok: true, path: rel });
      } else {
        await fsp.unlink(abs).catch(() => {});
        return sendJSON(res, 200, { ok: true });
      }
    }

    // 4. Static file serving
    if (req.method !== "GET" && req.method !== "HEAD") {
      return sendJSON(res, 405, { ok: false, error: "Method not allowed" });
    }

    const reqPath = pathname === "/" ? "index.html" : pathname;
    const absPath = resolveInside(ROOT, reqPath);
    if (!absPath) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    const baseName = path.basename(absPath);
    if (baseName.startsWith(".")) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    let stat = await fsp.stat(absPath).catch(() => null);
    let finalPath = absPath;
    if (stat && stat.isDirectory()) {
      finalPath = path.join(absPath, "index.html");
      stat = await fsp.stat(finalPath).catch(() => null);
    }
    if (!stat || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not Found");
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const isJsonOrConfig = ext === ".json" || baseName === "pages.config.js";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Cache-Control": isJsonOrConfig ? "no-store" : "public, max-age=60"
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(finalPath).pipe(res);
  } catch (err) {
    sendJSON(res, 500, { ok: false, error: err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[MY_QA_DASHBOARD] Server listening on http://${HOST}:${PORT}`);
});
