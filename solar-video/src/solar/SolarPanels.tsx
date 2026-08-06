import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// A tilted array of photovoltaic panels that rises up and catches a glare sweep.
export const SolarPanels: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const rise = interpolate(local, [0, 1 * fps], [220, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const appear = interpolate(local, [0, 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glare that sweeps left-to-right across the panels.
  const glare = interpolate(local, [0.8 * fps, 2.4 * fps], [-0.2, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cols = 4;
  const rows = 2;
  const panels: { x: number; y: number; skewTop: number }[] = [];

  // Build a simple 2.5D grid (each panel a parallelogram).
  const startX = 250;
  const startY = 620;
  const pw = 300;
  const ph = 150;
  const gap = 30;
  const skew = 70; // horizontal offset per row for perspective

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      panels.push({
        x: startX + c * (pw + gap) - r * skew,
        y: startY + r * (ph + gap),
        skewTop: skew,
      });
    }
  }

  return (
    <AbsoluteFill style={{ translate: `0px ${rise}px`, opacity: appear }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="panelFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0b1e4d" />
        </linearGradient>
      </defs>

      {panels.map((p, i) => {
        const glareCenter = i % cols / (cols - 1);
        const glareOn = Math.max(0, 1 - Math.abs(glare - glareCenter) * 3);
        const topLeftX = p.x + p.skewTop;
        const topRightX = p.x + pw + p.skewTop;
        return (
          <g key={i}>
            {/* panel face */}
            <polygon
              points={`${topLeftX},${p.y} ${topRightX},${p.y} ${p.x + pw},${p.y + ph} ${p.x},${p.y + ph}`}
              fill="url(#panelFace)"
              stroke="#0a1633"
              strokeWidth={3}
            />
            {/* cell grid lines */}
            {[1, 2, 3].map((k) => {
              const t = k / 4;
              return (
                <line
                  key={`v${k}`}
                  x1={topLeftX + (topRightX - topLeftX) * t}
                  y1={p.y}
                  x2={p.x + pw * t}
                  y2={p.y + ph}
                  stroke="#3b5bb5"
                  strokeWidth={2}
                  opacity={0.6}
                />
              );
            })}
            <line
              x1={topLeftX + (topRightX - topLeftX) * 0.5}
              y1={p.y + ph / 2 - 1}
              x2={p.x + pw * 0.5}
              y2={p.y + ph / 2 - 1}
              stroke="#3b5bb5"
              strokeWidth={2}
              opacity={0.4}
            />
            <line
              x1={topLeftX}
              y1={p.y + ph / 2}
              x2={p.x}
              y2={p.y + ph / 2}
              stroke="#3b5bb5"
              strokeWidth={2}
              opacity={0.4}
              transform={`translate(${(topRightX - topLeftX) / 2},0)`}
            />
            {/* glare sweep */}
            <polygon
              points={`${topLeftX},${p.y} ${topRightX},${p.y} ${p.x + pw},${p.y + ph} ${p.x},${p.y + ph}`}
              fill="#dbeafe"
              opacity={glareOn * 0.55}
            />
            {/* support leg */}
            <rect x={p.x + pw * 0.5 - 6} y={p.y + ph} width={12} height={70} fill="#334155" />
          </g>
        );
      })}
    </svg>
    </AbsoluteFill>
  );
};
