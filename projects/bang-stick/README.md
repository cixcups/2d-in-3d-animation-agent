# Bang Stick — Production Setup

This folder is the project-specific workspace for producing Bang Stick vertical animated shorts with the 2D-in-3D framework.

## Production constraints

- Preserve the approved Bang Stick character design exactly: round white head, two black hair tufts, slim black body, white gloves, and white shoes.
- Use the approved 2D or 3D reference as supplied for the chosen production style. Do not blend the two designs or redesign proportions, colors, face, or costume details.
- Deliver vertical 9:16 video at 1080x1920 and 30 fps unless an episode brief specifies otherwise.
- Build real character acting and physical interaction with grounded 3D sets; avoid slideshow-like motion graphics.
- Use motivated lighting, dynamic multi-angle camera coverage, safe margins, and synchronized sound effects.
- Keep episode-specific code and assets inside this folder or a dedicated project folder; do not overwrite the framework demo/template.

## Pipeline

1. **Brief and assets:** lock the episode topic, narration/voiceover, duration, and approved Bang Stick reference image.
2. **Look development:** create key stills and check character fidelity, grounding, framing, lighting, and safe margins.
3. **Motion previews:** animate short representative beats and review character acting, camera movement, and timing.
4. **Final render:** render the full video, captions, and audio mix only after the previews are approved.

## Current setup status

- Repository: `cixcups/2d-in-3d-animation-agent`
- Base framework: Remotion + Three.js + React
- Project status: setup branch created; episode-specific scene code and renders have not yet been added.
- Required inputs before visual production: the episode brief/narration and the approved character reference asset.

## Model and cost constraint

The framework's `GUIDELINES.md` specifies ARGON for visual design, 3D scene code, and motion previews. Do not silently bypass that project rule. If the production is to proceed without ARGON, first agree on an alternate workflow and its quality limitations. Prefer local/free rendering and do not purchase credits or paid services without explicit approval.
