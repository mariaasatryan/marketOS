import React from 'react';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export type PipelineStageStatus = 'idle' | 'loading' | 'ok' | 'warn';

export interface PipelineStage {
  id: string;
  title: string;
  description?: string;
  status: PipelineStageStatus;
  tooltip?: string;
  onFixManually?: () => void;
  onAutoFix?: () => void;
}

interface PipelineProps {
  stages: PipelineStage[];
}

export const Pipeline: React.FC<PipelineProps> = ({ stages }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <StageIcon status={stage.status} />
              {index < stages.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-1" />
              )}
            </div>
            <div className="flex-1 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{stage.title}</div>
                  {stage.description && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stage.description}</div>
                  )}
                </div>
                {stage.status === 'warn' && (
                  <div className="group relative">
                    <AlertTriangle className="text-yellow-500" />
                    {stage.tooltip && (
                      <div className="absolute right-0 z-10 hidden group-hover:block w-80 p-3 mt-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-lg">
                        <div className="text-slate-800 dark:text-slate-200 mb-2">{stage.tooltip}</div>
                        <div className="flex gap-2">
                          {stage.onFixManually && (
                            <button onClick={stage.onFixManually} className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Исправить самому</button>
                          )}
                          {stage.onAutoFix && (
                            <button onClick={stage.onAutoFix} className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Авто-исправление с MarketAI</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StageIcon: React.FC<{ status: PipelineStageStatus }> = ({ status }) => {
  if (status === 'loading' || status === 'idle') {
    return <Loader2 className="animate-spin text-slate-400" />;
  }
  if (status === 'ok') {
    return <CheckCircle2 className="text-green-600" />;
  }
  return <AlertTriangle className="text-yellow-500" />;
};


