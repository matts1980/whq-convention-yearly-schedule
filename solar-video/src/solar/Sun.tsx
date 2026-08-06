import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// The sun: rises into frame, glows, and casts slowly rotating rays.
export const Sun: React.FC<{ cx?: number; cy?: number; size?: number }> = ({
  cx = 1500,
  cy = 300,
  size = 170,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = interpolate(frame, [0, 1.5 * fps], [140, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const rayRotate = interpolate(frame, [0, 10 * fps], [0, 60]);
  const rayLen = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 1 + 0.03 * Math.sin((frame / fps) * Math.PI * 2 * 0.8);

  const rays = Array.from({ length: 12 });

  return (
    <AbsoluteFill style={{ translate: `0px ${rise}px` }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="55%" stopColor="#ffd23f" />
            <stop offset="100%" stopColor="#ff9e00" />
          </radialGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd23f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffd23f" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={size * 2.6} fill="url(#sunGlow)" />

        <g transform={`rotate(${rayRotate} ${cx} ${cy})`}>
          {rays.map((_, i) => {
            const a = (i / rays.length) * Math.PI * 2;
            const r0 = size * 1.35;
            const r1 = size * (1.35 + 0.7 * rayLen);
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * r0}
                y1={cy + Math.sin(a) * r0}
                x2={cx + Math.cos(a) * r1}
                y2={cy + Math.sin(a) * r1}
                stroke="#ffe08a"
                strokeWidth={10}
                strokeLinecap="round"
                opacity={0.9}
              />
            );
          })}
        </g>

        <circle cx={cx} cy={cy} r={size * pulse} fill="url(#sunCore)" />
      </svg>
    </AbsoluteFill>
  );
};
