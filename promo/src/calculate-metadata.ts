import type { CalculateMetadataFunction } from "remotion";
import { staticFile } from "remotion";
import { getAudioDuration } from "./get-audio-duration";
import { SCENES, FPS, type Scene } from "./scenes";

export type PromoProps = {
  sceneDurations: number[];
  totalFrames: number;
};

export const calculateMetadata: CalculateMetadataFunction<PromoProps> = async ({
  props,
}) => {
  const durations = await Promise.all(
    SCENES.map((scene: Scene) => getAudioDuration(staticFile(scene.audioFile))),
  );

  const sceneDurations = durations.map((dur, i) =>
    Math.max(Math.ceil(dur * FPS) + 15, SCENES[i].defaultFrames),
  );
  const totalFrames = sceneDurations.reduce((sum, d) => sum + d, 0);

  return { durationInFrames: totalFrames, props: { sceneDurations, totalFrames } };
};

export const defaultProps: PromoProps = {
  sceneDurations: SCENES.map((s) => s.defaultFrames),
  totalFrames: SCENES.map((s) => s.defaultFrames).reduce((a, b) => a + b, 0),
};