import React, { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { marketplaceService } from '../services/marketplaceService';
import { RealMarketplaceService } from '../services/realMarketplaceService';
import { SyncButton } from '../components/SyncButton';
import { Pipeline, PipelineStage } from '../components/Pipeline';
import { AuditModal } from '../components/AuditModal';
import { generateContent } from '../services/contentGenerationService';

export function Products() {
  const { t } = useI18n();
  const [items, setItems] = useState<Array<{
    id: string;
    title: string;
    sku: string;
    price: number;
    stock: number;
    marketplace: string;
  }>>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [pipelineByProduct, setPipelineByProduct] = useState<Record<string, PipelineStage[]>>({});

  const load = async () => {
    try {
      // Загружаем интеграции
      const integrationsData = await marketplaceService.listIntegrations();

      // Получаем реальные данные товаров через API маркетплейсов
      const realProductsData = await RealMarketplaceService.getRealProductsData(integrationsData);
      setItems(realProductsData);

      // Инициализируем пайплайн под каждый товар
      const initial: Record<string, PipelineStage[]> = {};
      for (const p of realProductsData) {
        initial[p.id] = [
          { id: 'name', title: 'Наименование', status: 'ok' },
          { id: 'attrs', title: 'Характеристики', status: 'loading' },
          { id: 'desc', title: 'Описание', status: 'loading' },
          { id: 'media', title: 'Фото/Видео контент', status: 'loading' },
          { id: 'dims', title: 'Размеры и вес упаковки', status: 'loading' },
          { id: 'rich', title: 'Рич контент', status: 'loading' },
          { id: 'barcode', title: 'Скачать штрихкод', status: 'idle' },
        ];
      }
      setPipelineByProduct(initial);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    try {
      // Имитируем синхронизацию данных
      await new Promise(resolve => setTimeout(resolve, 2000));
      await load();
    } catch (error) {
      console.error('Error syncing products:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const runAuditForProduct = async (productId: string): Promise<PipelineStage[]> => {
    const stages = pipelineByProduct[productId] || [];
    const evaluated = stages.map(s => {
      if (s.id === 'desc') {
        return {
          ...s,
          status: 'warn',
          tooltip: 'Отсутствуют ключевые запросы: “купить”, “для детей”',
          onFixManually: () => {},
          onAutoFix: async () => {
            const suggestion = await generateContent({ text: 'Описание товара', style: 'SEO', length: 'medium' });
            console.log('MarketAI suggestion:', suggestion);
            setPipelineByProduct(prev => ({
              ...prev,
              [productId]: (prev[productId] || []).map(ps => ps.id === 'desc' ? { ...ps, status: 'ok', tooltip: 'Описание улучшено MarketAI' } : ps)
            }));
          }
        };
      }
      if (s.id === 'barcode') return { ...s, status: 'ok' };
      return { ...s, status: 'ok' };
    });
    setPipelineByProduct(prev => ({ ...prev, [productId]: evaluated }));
    return evaluated;
  };

  const create = async () => {
    setLoading(true);
    const { error } = await supabase.from('products').insert({ title, sku, price });
    setLoading(false);
    if (!error) {
      setOpen(false);
      setTitle(''); setSku(''); setPrice(0);
      load();
    } else {
      alert(error.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm(t('products.deleteConfirm'))) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert(error.message); else load();
  };

  const filtered = items.filter(p =>
    [p.name || p.title, p.sku].join(' ').toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search size={16} />
          <input className="outline-none" placeholder={t('products.search')} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button
          className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setShowAudit(true)}
        >
          Бесплатный ИИ-аудит
        </button>
        <SyncButton
          onClick={handleSyncData}
          isLoading={syncing}
          variant="primary"
          size="sm"
        >
          {syncing ? t('products.syncing') : t('products.sync')}
        </SyncButton>
        <button className="ml-auto tech-button px-3 py-2 rounded-lg flex items-center gap-1" onClick={() => setOpen(true)}>
          <Plus size={16} className="inline" /> {t('products.add')}
        </button>
      </div>

      <div className="grid gap-2">
        {filtered.map((p) => (
          <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
            <div className="flex-1">
              <div className="font-medium">{p.name || p.title}</div>
              <div className="text-xs text-slate-500">{p.sku} · {p.price} ₽ · {t('products.stock')}: {p.stock}</div>
              <div className="mt-3">
                <Pipeline stages={pipelineByProduct[p.id] || []} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-lg border"
                onClick={() => runAuditForProduct(p.id)}
              >
                Запустить аудит
              </button>
              <button className="px-3 py-1.5 rounded-lg border"><Edit2 size={14} /></button>
              <button className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600" onClick={() => remove(p.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AuditModal
        open={showAudit}
        onClose={() => setShowAudit(false)}
        products={items.map(p => ({ id: p.id, title: p.name || p.title, marketplace: p.marketplace }))}
        onStartAudit={runAuditForProduct}
      />

      {open && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
          <div className="bg-white w-full max-w-md rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-lg">{t('products.newProduct')}</h3>
            <input className="w-full border rounded-lg px-3 py-2" placeholder={t('products.name')} value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="w-full border rounded-lg px-3 py-2" placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
            <input className="w-full border rounded-lg px-3 py-2" placeholder={t('products.price')} type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            <div className="flex gap-2">
              <button className="flex-1 border rounded-lg px-3 py-2" onClick={() => setOpen(false)}>{t('products.cancel')}</button>
              <button className="flex-1 bg-red-600 text-white rounded-lg px-3 py-2" onClick={create} disabled={loading}>
                {loading ? t('products.creating') : t('products.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}