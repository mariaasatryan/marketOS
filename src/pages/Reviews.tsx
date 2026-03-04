import { useState } from 'react';
import { Star } from 'lucide-react';
import { DEMO_REVIEWS } from '../data/demoData';

const ratingColors: Record<number, string> = {
  5: 'text-emerald-500',
  4: 'text-lime-400',
  3: 'text-amber-400',
  2: 'text-orange-400',
  1: 'text-red-400',
};

export function Reviews() {
  const [reviews] = useState(DEMO_REVIEWS);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400" /> Reviews
      </h2>

      <div className="bg-red-950/30 border border-red-800/80 rounded-lg p-3 flex gap-3 items-center">
        <span className="text-xl">🚨</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-red-400">Negative streak detected</p>
          <p className="text-xs text-red-300/90">Bamboo Cutting Board Set — 3 negative reviews in the last 48 hours. Common theme: shipping damage.</p>
        </div>
        <button type="button" className="shrink-0 px-3 py-1.5 rounded-lg bg-red-950/50 border border-red-800 text-red-400 text-xs font-semibold hover:bg-red-900/30">
          Create task
        </button>
      </div>

      <div className="space-y-2">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 flex gap-4 items-start"
          >
            <div className="text-center shrink-0 w-10">
              <p className={`text-lg font-extrabold ${ratingColors[r.rating]}`}>{r.rating}</p>
              <span className="text-amber-400 text-xs">{'★'.repeat(r.rating)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-400">{r.product}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500">{r.date}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    r.rating >= 4 ? 'bg-emerald-500/20 text-emerald-400' : r.rating <= 2 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {r.topic}
                  </span>
                  {r.replied ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Replied</span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400">Pending</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{r.text}</p>
            </div>
            {!r.replied && (
              <button
                type="button"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-700 border border-blue-500/50 text-blue-400 text-xs font-semibold hover:bg-slate-600"
              >
                Auto-reply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
