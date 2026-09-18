# Asset manifest

All files are local optimized WebP placeholders. They do not depict actual SAHUCONNECT sites, employees or management.

## Existing generated images

Built-in image generation was used before the user requested that remaining assets be sourced from Google Images. No further generated assets were added after that instruction.

- `public/images/industrial-panorama.webp`: panoramic cool-daylight industrial skyline. Prompt: "Photorealistic industrial photography placeholder, ultra-wide 2.5:1 panorama. Pale powder blue sky occupies upper 65 percent of central area for dark headline. Refinery towers and silver pipework frame far left and right, low cement factory structures across bottom third. Slightly desaturated blue daylight, no people, no text, no logos; generic facility."
- `public/images/cement-plant-dusk.webp`: portrait cement silos at dusk. Prompt: "Photorealistic commercial architectural photograph, portrait 3:4. Large silver cylindrical cement silos and complex factory pipework, conveyors and platforms at dusk. Warm orange lights within cool blue factory, peach sky, facility fills lower two thirds. Generic placeholder; no people, text or logos."

## Sourced photographs

Google Images was attempted but was inaccessible in this environment. These public Pexels photo pages were found through web search and the user was informed of the fallback.

- `maintenance-team.webp`: https://www.pexels.com/photo/technicians-in-factory-working-on-machine-3846251/ — Andrea Piacquadio, factory technicians. Download: https://images.pexels.com/photos/3846251/pexels-photo-3846251.jpeg
- `workshop-machinery.webp`: https://www.pexels.com/photo/industrial-workers-repairing-machinery-in-workshop-32588552/ — workshop repair technicians. Download: https://images.pexels.com/photos/32588552/pexels-photo-32588552.jpeg

Image placement and paths are centralized in `src/content.js`. Original source photos are retained alongside optimized versions. Fonts are locally bundled Barlow and Barlow Condensed via their Fontsource packages.
