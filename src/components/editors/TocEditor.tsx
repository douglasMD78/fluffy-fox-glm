import React from "react";
import type { TocPageData } from "@/data/initialData";

interface TocEditorProps {
  activePage: TocPageData;
  updatePage: (newData: Partial<TocPageData>) => void;
}

export const TocEditor: React.FC<TocEditorProps> = ({ activePage, updatePage }) => {
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
        <p className="text-[11px] text-navy/60 leading-relaxed">
          O conteúdo e os números de página do Sumário são gerados automaticamente a partir da ordem das receitas.
        </p>
      </div>
    </div>
  );
};