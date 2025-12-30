import React from "react";
import type { TocPageData } from "@/data/initialData";

interface TocEditorProps {
  activePage: TocPageData;
  updatePage: (newData: Partial<TocPageData>) => void;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const TocEditor: React.FC<TocEditorProps> = ({ activePage, updatePage }) => {
  const fontScale = clamp(Number((activePage as any).fontScale ?? 1), 0.8, 1);

  const setScale = (v: number) => {
    updatePage({ fontScale: clamp(v, 0.8, 1) } as Partial<TocPageData>);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Título</label>
        <input
          className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-navy transition-all shadow-sm"
          value={activePage.title || "Sumário"}
          onChange={(e) => updatePage({ title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Parte (automático)</label>
        <input
          type="number"
          min={1}
          className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-navy transition-all shadow-sm"
          value={activePage.part || 1}
          onChange={(e) => updatePage({ part: Math.max(1, parseInt(e.target.value || "1", 10)) })}
        />
      </div>

      <div className="space-y-2 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
          Tamanho da fonte do Sumário
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-2 rounded-xl bg-surface hover:bg-gray-100 text-navy/70 text-[10px] font-black uppercase tracking-widest"
            onClick={() => setScale(fontScale - 0.05)}
            title="Diminuir"
          >
            A-
          </button>

          <input
            type="range"
            min={0.8}
            max={1}
            step={0.01}
            value={fontScale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="flex-1"
          />

          <button
            type="button"
            className="px-3 py-2 rounded-xl bg-surface hover:bg-gray-100 text-navy/70 text-[10px] font-black uppercase tracking-widest"
            onClick={() => setScale(fontScale + 0.05)}
            title="Aumentar"
          >
            A+
          </button>
        </div>

        <div className="text-[11px] text-navy/60">
          Atual: <span className="font-bold tabular-nums">{Math.round(fontScale * 100)}%</span>
        </div>
      </div>

      <p className="text-[11px] text-navy/60 leading-relaxed">
        Dica: se estiver cortando no final da página, reduza para 95% ou 90%.
      </p>
    </div>
  );
};