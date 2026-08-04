import React from "react";
import { Composition } from "remotion";
import { calculateMetadata, defaultProps } from "./calculate-metadata";
import { Promotion } from "./Promotion";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Promotion"
      component={Promotion}
      durationInFrames={defaultProps.totalFrames}
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
      defaultProps={defaultProps}
    />
  );
};