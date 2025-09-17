#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(__dirname, '../..');
const publicDir = path.join(root, 'public');
const imagesSrc = path.join(repoRoot, 'images');
const stylesSrc = path.join(repoRoot, 'styles.css');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

// Ensure public dir
ensureDir(publicDir);

// Copy images -> public/images
copyDir(imagesSrc, path.join(publicDir, 'images'));

// Copy styles.css -> public/styles.css
copyFile(stylesSrc, path.join(publicDir, 'styles.css'));

console.log('[copy-assets] Assets copiados para frontend/public');

