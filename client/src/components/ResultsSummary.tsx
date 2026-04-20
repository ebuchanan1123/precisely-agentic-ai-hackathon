import ScoreGauge from './ScoreGauge';
import type { EvaluateResponse } from '../lib/types';

interface ResultsSummaryProps {
  result: EvaluateResponse;
}

function DecisionBadge({ decision, score }: { decision: string; score: number }) {
  const cls =
    score >= 75 ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
    score >= 55 ? 'bg-lime-500/15 text-lime-300 border-lime-500/30' :
    score >= 40 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
    'bg-red-500/15 text-red-300 border-red-500/30';
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${cls}`}>
      {decision}
    </span>
  );
}

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  const confCls: Record<string, string> = {
    High: 'text-emerald-400 bg-emerald-500/10',
    Medium: 'text-amber-400 bg-amber-500/10',
    Low: 'text-red-400 bg-red-500/10',
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex-shrink-0 sm:w-52">
          <ScoreGauge score={result.score} />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Site Evaluation</p>
            <p className="mt-1 text-sm font-medium text-gray-300 line-clamp-2">{result.address.normalized}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-gray-300">
                {result.businessLabel}
              </span>
              {result.address.fromPrecisely && (
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                  Precisely verified
                </span>
              )}
            </div>
          </div>

          <DecisionBadge decision={result.decision} score={result.score} />

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-sm font-bold ${confCls[result.confidenceLevel] ?? ''}`}>
                {result.confidenceLevel}
              </p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-xs text-gray-500">Competitors Nearby</p>
              <p className="mt-0.5 text-sm font-bold text-gray-100">{result.nearbyCompetitorCount}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-xs text-gray-500">Address Match</p>
              <p className="mt-0.5 text-sm font-bold text-gray-100">{result.address.confidence}%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
