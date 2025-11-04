import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Pipeline, PipelineStage } from './Pipeline';

interface ProductOption {
  id: string;
  title: string;
  marketplace?: string;
}

interface AuditModalProps {
  open: boolean;
  onClose: () => void;
  products: ProductOption[];
  onStartAudit: (productId: string) => Promise<PipelineStage[]>;
}

export const AuditModal: React.FC<AuditModalProps> = ({ open, onClose, products, onStartAudit }) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [stages, setStages] = useState<PipelineStage[] | null>(null);
  const [loading, setLoading] = useState(false);

  const canStart = useMemo(() => !!selectedId && !loading, [selectedId, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="font-semibold text-slate-900 dark:text-slate-100">Бесплатный ИИ-аудит</div>
          <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}><X /></button>
        </div>
        <div className="p-4">
          <div className="mb-3 text-sm text-slate-600 dark:text-slate-300">Выберите товар для аудита</div>
          <select
            className="w-full mb-4 p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">— Выберите товар —</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.title}{p.marketplace ? ` • ${p.marketplace}` : ''}</option>
            ))}
          </select>

          <div className="flex items-center gap-3 mb-6">
            <button
              disabled={!canStart}
              onClick={async () => {
                if (!selectedId) return;
                setLoading(true);
                try {
                  const res = await onStartAudit(selectedId);
                  setStages(res);
                } finally {
                  setLoading(false);
                }
              }}
              className={`px-4 py-2 rounded text-white ${canStart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400 cursor-not-allowed'}`}
            >
              Начать аудит
            </button>
            {loading && <span className="text-sm text-slate-500">Проверяем…</span>}
          </div>

          {stages && <Pipeline stages={stages} />}
        </div>
      </div>
    </div>
  );
};


