import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sky } from "./Sky";
import { Sun } from "./Sun";
import { SolarPanels } from "./SolarPanels";
import { House } from "./House";

// Fades its children in at the start and out at the end of the local sequence.
const Fade: React.FC<{ children: React.ReactNode; duration: number }> = ({
  children,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = 0.4 * fps;
  const opacity = interpolate(
    frame,
    [0, fade, duration - fade, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Ground: React.FC = () => (
  <AbsoluteFill>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      <path d="M 0,830 Q 960,780 1920,830 L 1920,1080 L 0,1080 Z" fill="#4f8f4a" />
      <path d="M 0,830 Q 960,780 1920,830" fill="none" stroke="#3d7439" strokeWidth={4} />
    </svg>
  </AbsoluteFill>
);

const Title: React.FC<{
  headline: string;
  sub: string;
  delay?: number;
}> = ({ headline, sub, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const y = interpolate(local, [0, 0.7 * fps], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const o = interpolate(local, [0, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subO = interpolate(local, [0.5 * fps, 1.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        textAlign: "center",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          fontSize: 148,
          fontWeight: 800,
          color: "#fff8e1",
          letterSpacing: -2,
          textShadow: "0 8px 40px rgba(0,0,0,0.45)",
          translate: `0px ${y}px`,
          opacity: o,
          lineHeight: 1.05,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          fontSize: 58,
          fontWeight: 500,
          color: "#ffe8b0",
          marginTop: 28,
          opacity: subO,
          textShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const o = interpolate(local, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(local, [0, 0.6 * fps], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        paddingTop: 140,
      }}
    >
      <div
        style={{
          fontSize: 66,
          fontWeight: 700,
          color: "#0b1e4d",
          background: "rgba(255,255,255,0.82)",
          padding: "18px 44px",
          borderRadius: 20,
          opacity: o,
          translate: `0px ${y}px`,
          textShadow: "0 2px 6px rgba(255,255,255,0.6)",
          maxWidth: 1400,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const PercentBadge: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;
  const pct = Math.round(
    interpolate(local, [0.8 * fps, 3 * fps], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }),
  );
  const o = interpolate(local, [0.5 * fps, 1.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 250,
        top: 470,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        opacity: o,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 128, fontWeight: 800, color: "#22c55e", textShadow: "0 6px 24px rgba(0,0,0,0.35)" }}>
        {pct}%
      </div>
      <div style={{ fontSize: 46, fontWeight: 600, color: "#0b1e4d" }}>renewable</div>
    </div>
  );
};

export const SolarVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sky />
      <Sun />

      {/* Scene 1 — Title (0–3s) */}
      <Sequence from={0} durationInFrames={95} name="Scene 1 · Title">
        <Fade duration={95}>
          <Title headline="Harness the Sun" sub="The power of solar, in 10 seconds" delay={8} />
        </Fade>
      </Sequence>

      {/* Scene 2 — Panels (2.6–6.5s) */}
      <Sequence from={78} durationInFrames={120} name="Scene 2 · Panels">
        <Fade duration={120}>
          <Ground />
          <SolarPanels delay={4} />
          <Caption text="Panels turn sunlight into clean electricity" delay={20} />
        </Fade>
      </Sequence>

      {/* Scene 3 — Powering the home (6.2–10s) */}
      <Sequence from={186} durationInFrames={114} name="Scene 3 · Power">
        <Fade duration={114}>
          <Ground />
          <House delay={4} />
          <PercentBadge delay={4} />
          <Caption text="Renewable energy, powering tomorrow" delay={16} />
        </Fade>
      </Sequence>
    </AbsoluteFill>
  );
};
