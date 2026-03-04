import { MessageSquare, HelpCircle, Inbox, AlertTriangle } from 'lucide-react';

const summaryCards = [
  { label: 'Open Reviews', value: 8, sub: '3 need reply', color: 'text-blue-400', icon: MessageSquare },
  { label: 'Open Q&A', value: 4, sub: '2 unanswered', color: 'text-violet-400', icon: HelpCircle },
  { label: 'Buyer Messages', value: 6, sub: '4 in 24h SLA', color: 'text-cyan-400', icon: Inbox },
  { label: 'Active Alerts', value: 4, sub: '2 critical', color: 'text-red-400', icon: AlertTriangle },
];

const activityLog = [
  { time: '2m ago', action: 'Auto-replied to 1★ review', product: 'Bamboo Cutting Board', type: 'blue' },
  { time: '8m ago', action: 'Answered Q&A question', product: 'Water Bottle 32oz', type: 'blue' },
  { time: '14m ago', action: 'Buyer message handled', product: 'Yoga Mat', type: 'blue' },
  { time: '1h ago', action: 'Escalated to human review', product: 'LED Desk Lamp', type: 'yellow' },
];

const topIssues = [
  { issue: 'Shipping damage', count: 23, change: '+8' },
  { issue: 'Lid leaking', count: 18, change: '+12' },
  { issue: 'Missing parts', count: 7, change: '+3' },
  { issue: 'Early failure', count: 12, change: '+6' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">Good morning 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what needs your attention today</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {summaryCards.map((c) => (
          <div
            key={c.label}
            className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <p className={`text-2xl font-extrabold ${c.color}`}>{c.value}</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{c.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-slate-200">Recent activity</h3>
            <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Live</span>
          </div>
          <ul className="space-y-2">
            {activityLog.map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-1.5 border-b border-slate-700/80 last:border-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.type === 'blue' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">{a.action}</p>
                  <p className="text-[11px] text-slate-500">{a.product}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{a.time}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${a.type === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {a.type === 'blue' ? 'Handled' : 'Escalated'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Top issues this week</h3>
            {topIssues.map((t, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-slate-300">{t.issue}</span>
                    <span className={t.change.startsWith('+') ? 'text-red-400' : 'text-slate-500'}>{t.change}</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (t.count / 23) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 w-6 text-right">{t.count}</span>
              </div>
            ))}
          </div>
          <div className="bg-red-950/30 border border-red-800/80 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-xl">🚨</span>
              <div>
                <p className="text-sm font-bold text-red-400">Negative review streak</p>
                <p className="text-xs text-red-300/90 mt-0.5">Bamboo Cutting Board Set — 3 negative reviews in the last 48h</p>
                <a href="#alerts" className="inline-block mt-2 text-[11px] font-semibold text-red-400 hover:underline">View alert →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
