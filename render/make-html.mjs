import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'kb', 'support-kb', '.render');
const mod = await import(pathToFileURL(resolve(out, 'entry.js')).href);
const { head, body } = mod.default();

const cssFile = readdirSync(resolve(out, 'assets')).find((f) => f.endsWith('.css'));
const css = readFileSync(resolve(out, 'assets', cssFile), 'utf8');

const html = [
  '<!doctype html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="utf-8" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  head.trim(),
  '<style>',
  css.trim(),
  '</style>',
  '</head>',
  '<body>',
  body.trim(),
  '</body>',
  '</html>',
  '',
].join('\n');

const dest = resolve(here, '..', 'page.html');
writeFileSync(dest, html, 'utf8');
console.log('wrote', dest, html.length, 'bytes');
