import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https:/SBB-GA.github.io',
  base: 'Fasen-Rechner',
  integrations: [tailwind(), react()]
});
