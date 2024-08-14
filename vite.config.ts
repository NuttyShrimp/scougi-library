import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sentrySvelteKit({
    sourceMapsUploadOptions: {
      org: "nutty",
      project: "scougi-library",
      url: "https://glitchtip.lecoutere.dev/"
    }
  }), sveltekit()],
  server: {
    port: 3000
  }
});