import React from 'react';
import { LegendPageData } from '@/data/initialData';

interface LegendEditorProps {
    activePage: LegendPageData;
    updatePage: (newData: Partial<LegendPageData>) => void;
}

export const LegendEditor: React.FC<LegendEditorProps> = ({ activePage, updatePage }) => {
     return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Título</label>
                <input className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-navy transition-all shadow-sm" value={activePage.title} onChange={e => updatePage({title: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Texto de Orientação</label>
                <textarea className="w-full bg-white border border-gray-200 p-4 rounded-xl text-xs leading-relaxed text-navy focus:border-accent outline-none shadow-sm" rows={6} value={activePage.text} onChange={e => updatePage({text: e.target.value})} />
            </div>
        </div>
    );
};