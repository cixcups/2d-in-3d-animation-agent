import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const compositionId = "Saranjana004";
const outputLocation = path.resolve(
  process.argv[2] || "out/bang-stick/Saranjana_004.mp4"
);
const remotionTmp = process.env.REMOTION_TMP || path.join(os.tmpdir(), "remotion");
fs.mkdirSync(remotionTmp, { recursive: true });
fs.mkdirSync(path.dirname(outputLocation), { recursive: true });

process.env.TEMP ||= remotionTmp;
process.env.TMP ||= remotionTmp;
process.env.REMOTION_TMP ||= remotionTmp;

console.log("Bundling Remotion project...");
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.ts"),
  publicDir: fs.existsSync(path.resolve("public"))
    ? path.resolve("public")
    : undefined,
});

console.log(`Selecting composition ${compositionId}...`);
const composition = await selectComposition({
  serveUrl,
  id: compositionId,
});

const startedAt = Date.now();
console.log(
  `Rendering ${compositionId}: ${composition.durationInFrames} frames, ${(composition.durationInFrames / composition.fps).toFixed(1)} seconds.`
);

await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation,
  crf: 18,
  concurrency: Math.max(1, Math.min(4, os.cpus().length - 1)),
  timeoutInMilliseconds: 900000,
  onProgress: ({ renderedFrames, encodedFrames, progress }) => {
    if (renderedFrames % 150 === 0 || progress === 1) {
      console.log(
        `Progress: ${(progress * 100).toFixed(1)}% (${renderedFrames}/${composition.durationInFrames} frames; encoded ${encodedFrames})`
      );
    }
  },
});

console.log(
  `Render complete in ${((Date.now() - startedAt) / 1000).toFixed(1)}s: ${outputLocation}`
);
