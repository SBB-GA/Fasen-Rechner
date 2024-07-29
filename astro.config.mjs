import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: 'https:/Schnetzubroot.github.io',
  base: 'VR1',
  integrations: [tailwind(), react()]
});
