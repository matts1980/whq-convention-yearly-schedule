import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Full-duration animated sky that warms from dawn to bright midday.
export const Sky: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const top = interpolate(
    frame,
    [0, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Dawn indigo -> daytime blue
  const topColor = `hsl(${interpolate(top, [0, 1], [225, 205])}, 70%, ${interpolate(top, [0, 1], [28, 55])}%)`;
  const bottomColor = `hsl(${interpolate(top, [0, 1], [30, 45])}, 85%, ${interpolate(top, [0, 1], [55, 78])}%)`;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
      }}
    />
  );
};
