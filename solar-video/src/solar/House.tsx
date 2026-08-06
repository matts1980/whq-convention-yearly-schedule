import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// A house with a rooftop panel and a battery that charges to 100%,
// with energy bolts flowing from roof to battery.
export const House: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const pop = interpolate(local, [0, 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  const charge = interpolate(local, [0.8 * fps, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const batteryX = 1230;
  const batteryY = 560;
  const batteryH = 240;
  const fillH = batteryH * charge;

  // Three bolts travelling roof -> battery on a loop.
  const bolts = [0, 0.33, 0.66];

  return (
    <AbsoluteFill style={{ scale: String(pop), transformOrigin: "760px 620px" }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="roofPanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0b1e4d" />
        </linearGradient>
      </defs>

      {/* house body */}
      <rect x={520} y={560} width={480} height={280} fill="#f4f1ea" stroke="#c9c2b4" strokeWidth={4} />
      <rect x={690} y={690} width={140} height={150} fill="#8b6f47" />
      <rect x={560} y={600} width={90} height={90} fill="#bfe3ff" stroke="#c9c2b4" strokeWidth={4} />
      {/* roof */}
      <polygon points="500,560 760,400 1020,560" fill="#7c4a3a" />
      {/* rooftop solar panel */}
      <polygon points="640,505 900,505 860,560 680,560" fill="url(#roofPanel)" stroke="#0a1633" strokeWidth={3} />
      {[1, 2, 3].map((k) => (
        <line
          key={k}
          x1={640 + (260 * k) / 4}
          y1={505}
          x2={680 + (180 * k) / 4}
          y2={560}
          stroke="#3b5bb5"
          strokeWidth={2}
          opacity={0.6}
        />
      ))}

      {/* battery */}
      <rect x={batteryX - 12} y={batteryY - 22} width={104} height={18} rx={4} fill="#334155" />
      <rect x={batteryX} y={batteryY} width={80} height={batteryH} rx={12} fill="#0f172a" stroke="#334155" strokeWidth={5} />
      <rect
        x={batteryX + 6}
        y={batteryY + (batteryH - fillH) + 6 - 12}
        width={68}
        height={Math.max(0, fillH - 12)}
        rx={8}
        fill={charge > 0.75 ? "#22c55e" : "#facc15"}
      />

      {/* energy bolts roof -> battery */}
      {bolts.map((offset, i) => {
        const t = ((local / fps) * 0.6 + offset) % 1;
        const x = interpolate(t, [0, 1], [860, batteryX + 40]);
        const y = interpolate(t, [0, 1], [530, batteryY + 20]);
        const o = interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
        return (
          <g key={i} transform={`translate(${x},${y})`} opacity={o * charge}>
            <path d="M 0,-16 L -9,2 L -1,2 L -3,16 L 10,-4 L 1,-4 Z" fill="#fde047" stroke="#f59e0b" strokeWidth={1.5} />
          </g>
        );
      })}
    </svg>
    </AbsoluteFill>
  );
};
