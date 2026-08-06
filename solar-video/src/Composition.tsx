import { Composition } from "remotion";
import { SolarVideo } from "./solar/SolarVideo";

export const MyComposition = () => {
  return (
    <Composition
      id="SolarPanels"
      component={SolarVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
