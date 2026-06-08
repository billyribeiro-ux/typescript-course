#!/usr/bin/env node
/**
 * serve.mjs — a tiny, zero-dependency static file server for the course.
 *
 * Opening lessons via file:// gives you full syntax highlighting and copy/paste,
 * but browsers block Web Workers on file:// — and Monaco needs a Worker for LIVE
 * type-checking (the red squiggles). Serving over http://localhost unlocks them.
 *
 * Usage:  node tools/serve.mjs           (defaults to port 5173)
 *         node tools/serve.mjs 8080
 * Then open the printed URL. Everything is still 100% local/offline.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2]) || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (urlPath === "/") urlPath = "/index.html";
    // Prevent path traversal.
    const filePath = normalize(join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }

    let target = filePath;
    try {
      const s = await stat(target);
      if (s.isDirectory()) target = join(target, "index.html");
    } catch {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end(`<h1>404</h1><p>Not found: ${urlPath}</p><p><a href="/">Home</a></p>`);
    }

    const data = await readFile(target);
    res.writeHead(200, { "Content-Type": MIME[extname(target)] || "application/octet-stream" });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end("Server error: " + err.message);
  }
});

server.listen(PORT, () => {
  console.log(`\n  📚 Course server running — open:\n`);
  console.log(`     http://localhost:${PORT}/index.html\n`);
  console.log(`  Live in-editor type-checking is now enabled. Press Ctrl+C to stop.\n`);
});
