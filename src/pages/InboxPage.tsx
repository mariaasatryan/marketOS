import { useState } from 'react';
import { Inbox, MessageSquare, HelpCircle, Star, X, Send, ArrowUp } from 'lucide-react';
import { DEMO_INBOX } from '../data/demoData';

const typeIcon: Record<string, React.ReactNode> = {
  review: <Star className="w-4 h-4 text-amber-400" />,
  qa: <HelpCircle className="w-4 h-4 text-violet-400" />,
  message: <MessageSquare className="w-4 h-4 text-cyan-400" />,
};
const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400',
  'IN PROGRESS': 'bg-amber-500/20 text-amber-400',
  HANDLED: 'bg-emerald-500/20 text-emerald-400',
  ESCALATED: 'bg-red-500/20 text-red-400',
};

export function InboxPage() {
  const [items, setItems] = useState(DEMO_INBOX);
  const [selected, setSelected] = useState<typeof DEMO_INBOX[0] | null>(null);
  const [replyText, setReplyText] = useState('');
  const [tab, setTab] = useState<'All' | 'Reviews' | 'Q&A' | 'Messages'>('All');

  const typeMap = { review: 'Reviews', qa: 'Q&A', message: 'Messages' } as const;
  const filtered = tab === 'All' ? items : items.filter((i) => typeMap[i.type] === tab);

  const handleSend = (item: typeof DEMO_INBOX[0]) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'HANDLED' as const } : i)));
    setSelected(null);
  };
  const handleEscalate = (item: typeof DEMO_INBOX[0]) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'ESCALATED' as const } : i)));
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      <div className={`flex flex-col gap-3 ${selected ? 'w-[340px]' : 'flex-1'} min-w-[280px] transition-all`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Inbox className="w-5 h-5" /> Inbox
          </h2>
          <span className="text-xs font-semibold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
            {items.filter((i) => i.status === 'NEW').length} new
          </span>
        </div>
        <div className="flex gap-1.5 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          {(['All', 'Reviews', 'Q&A', 'Messages'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 px-1 rounded-md text-xs font-medium transition-colors ${
                tab === t ? 'bg-slate-700 text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelected(item);
                setReplyText(item.aiReply);
              }}
              className={`w-full text-left rounded-lg p-3 border transition-colors ${
                selected?.id === item.id
                  ? 'bg-slate-800 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {typeIcon[item.type]}
                  <span className="text-xs font-medium text-slate-400 truncate">{item.product}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">{item.snippet}</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                <span className="capitalize">{item.sentiment}</span>
                {item.rating != null && <span className="text-amber-400">{'★'.repeat(item.rating)}</span>}
                {item.urgency === 'high' && <span className="text-red-400 font-medium">Urgent</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="flex-1 flex flex-col gap-3 bg-slate-800/50 border border-slate-700 rounded-xl p-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-100">{selected.product}</p>
              <p className="text-xs text-slate-500">ASIN: {selected.asin} · {selected.type.toUpperCase()}</p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="p-1 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-700">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Customer</p>
            {selected.rating != null && <p className="text-amber-400 text-sm mb-1">{'★'.repeat(selected.rating)}</p>}
            <p className="text-sm text-slate-300 leading-relaxed">{selected.customerText}</p>
          </div>
          <div className="flex-1 flex flex-col gap-2 rounded-lg bg-slate-900/80 p-3 border border-blue-500/30">
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1">
              <ArrowUp className="w-3 h-3" /> AI Response
            </p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 min-h-[100px] bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Edit reply..."
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSend(selected)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold"
            >
              <Send className="w-4 h-4" /> Send Reply
            </button>
            <button
              type="button"
              onClick={() => handleEscalate(selected)}
              className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm font-medium hover:bg-red-500/10"
            >
              Escalate
            </button>
            <button
              type="button"
              onClick={() => {
                setItems((prev) => prev.map((i) => (i.id === selected.id ? { ...i, status: 'HANDLED' as const } : i)));
                setSelected(null);
              }}
              className="px-4 py-2 rounded-lg border border-emerald-500/50 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10"
            >
              ✓ Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
