import { useEffect, useMemo, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
}

const MIN_ANGLE = -120;
const MAX_ANGLE = 120;
const ANIMATION_MS = 1700;

function getColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 65) return '#84cc16';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

function getLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Fair';
  return 'Poor';
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, score));
}

function easeOutExpo(value: number): number {
  if (value >= 1) return 1;
  return 1 - 2 ** (-10 * value);
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweepFlag = endAngle > startAngle ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

function scoreToAngle(score: number) {
  return MIN_ANGLE + (clampScore(score) / 100) * (MAX_ANGLE - MIN_ANGLE);
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const targetScore = clampScore(score);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setAnimatedScore(targetScore);
      return;
    }

    setAnimatedScore(0);
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / ANIMATION_MS, 1);
      const eased = easeOutExpo(progress);
      setAnimatedScore(targetScore * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [targetScore]);

  const displayScore = Math.round(animatedScore);
  const color = getColor(targetScore);
  const label = getLabel(targetScore);
  const needleAngle = scoreToAngle(animatedScore);
  const progressArc = useMemo(
    () => describeArc(110, 112, 82, MIN_ANGLE, needleAngle),
    [needleAngle],
  );

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 160" className="w-full max-w-[240px] overflow-visible">
        <defs>
          <linearGradient id="gauge-shell" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#172033" />
            <stop offset="55%" stopColor="#0f1729" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="gauge-amber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="gauge-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <filter id="gauge-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={describeArc(110, 112, 82, MIN_ANGLE, MAX_ANGLE)}
          fill="none"
          stroke="url(#gauge-shell)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d={describeArc(110, 112, 82, MIN_ANGLE, -28)}
          fill="none"
          stroke="url(#gauge-red)"
          strokeOpacity="0.25"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d={describeArc(110, 112, 82, -28, 42)}
          fill="none"
          stroke="url(#gauge-amber)"
          strokeOpacity="0.28"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d={describeArc(110, 112, 82, 42, MAX_ANGLE)}
          fill="none"
          stroke="url(#gauge-green)"
          strokeOpacity="0.28"
          strokeWidth="18"
          strokeLinecap="round"
        />

        <path
          d={progressArc}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#gauge-glow)"
        />

        {[0, 20, 40, 60, 80, 100].map((tick) => {
          const angle = scoreToAngle(tick);
          const outer = polarToCartesian(110, 112, 97, angle);
          const inner = polarToCartesian(110, 112, tick % 20 === 0 ? 80 : 85, angle);
          const labelPoint = polarToCartesian(110, 112, 112, angle);

          return (
            <g key={tick}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={tick <= displayScore ? color : '#334155'}
                strokeWidth={tick === 0 || tick === 100 ? 2.5 : 2}
                strokeLinecap="round"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y + 4}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
                fontFamily="system-ui,sans-serif"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {[10, 30, 50, 70, 90].map((tick) => {
          const angle = scoreToAngle(tick);
          const outer = polarToCartesian(110, 112, 94, angle);
          const inner = polarToCartesian(110, 112, 86, angle);

          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#243041"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}

        <g transform={`rotate(${needleAngle} 110 112)`}>
          <line
            x1="110"
            y1="112"
            x2="176"
            y2="112"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#gauge-glow)"
          />
          <circle cx="110" cy="112" r="11" fill="#0f172a" stroke="#334155" strokeWidth="3" />
          <circle cx="110" cy="112" r="4" fill={color} />
        </g>

        <text
          x="110"
          y="90"
          textAnchor="middle"
          fontSize="44"
          fontWeight="800"
          fill={color}
          fontFamily="system-ui,sans-serif"
        >
          {displayScore}
        </text>
        <text
          x="110"
          y="110"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          letterSpacing="0.24em"
          fill="#64748b"
          fontFamily="system-ui,sans-serif"
        >
          SCORE
        </text>
        <text
          x="110"
          y="128"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#94a3b8"
          fontFamily="system-ui,sans-serif"
        >
          {displayScore}% of 100
        </text>
      </svg>

      <span className="mt-1 text-sm font-bold tracking-[0.24em] uppercase" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
