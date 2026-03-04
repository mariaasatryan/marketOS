import { useState } from 'react';
import { AlertTriangle, Plus, Clock } from 'lucide-react';
import { DEMO_ALERTS } from '../data/demoData';

export function AlertsPage() {
  const [snoozed, setSnoozed] = useState<Record<number, boolean>>({});

  const severityStyles = {
    critical: { bg: 'bg-red-950/50', border: 'border-red-800', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' },
    warning: { bg: 'bg-amber-950/30', border: 'border-amber-800', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' },
  };

  const visible = DEMO_ALERTS.filter((a) => !snoozed[a.id]);
  const snoozedCount = Object.keys(snoozed).length;

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-400" /> Alerts
      </h2>
      <div className="space-y-3">
        {visible.map((alert) => {
          const s = severityStyles[alert.severity];
          return (
            <div
              key={alert.id}
              className={`rounded-xl p-4 border ${s.bg} ${s.border}`}
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${s.badge}`}>
                      {alert.severity}
                    </span>
                    <span className={`font-semibold ${s.text}`}>{alert.type}</span>
                  </div>
                  <p className="text-xs text-slate-400">Product: {alert.product} · ASIN: {alert.asin}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">{alert.description}</p>
              <div className="bg-slate-900/80 rounded-lg p-2.5 mb-3 text-xs text-slate-400">
                💡 Recommended: {alert.action}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-sm ${s.border} ${s.text}`}
                >
                  <Plus className="w-3.5 h-3.5" /> Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setSnoozed((p) => ({ ...p, [alert.id]: true }))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-400 text-sm hover:bg-slate-700"
                >
                  <Clock className="w-3.5 h-3.5" /> Snooze 24h
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {snoozedCount > 0 && (
        <p className="text-center text-slate-500 text-sm mt-4">
          {snoozedCount} alert(s) snoozed.{' '}
          <button type="button" onClick={() => setSnoozed({})} className="text-blue-400 hover:underline">
            Restore all
          </button>
        </p>
      )}
    </div>
  );
}
