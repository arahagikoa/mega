import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const runbook = resolve(here, 'src/lib/layouts/runbook.svelte');

export default defineConfig({
  resolve: { alias: { '#lib': resolve(here, 'src/lib') } },
  plugins: [
    svelte({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook, _: runbook } })],
    }),
  ],
  build: {
    ssr: resolve(here, 'render-entry.js'),
    outDir: resolve(here, '.render'),
    emptyOutDir: true,
    cssCodeSplit: false,
    ssrEmitAssets: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'entry.js' } },
  },
});
