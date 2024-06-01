# Versatzrechner V1

This is a tool intended to ease the use of back chamfering tools on cnc machines in combination with MasterCAM.

## 🧞 Commands

All Astro commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## ✅ Todo's
- [ ] add functionality to use / insert saved tools
- [ ] add all calculations
    - [ ] update all calculations on any Input change
- [ ] add ThreeJS rendering of tools and chamfering
    - [ ] Basic ThreeJS render component
    - [ ] Update render on any DOM change
    - [ ] Show tooltip what current dimension is referring to (maybe in the render itself, maybe as a popup / modal?)
