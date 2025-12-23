import React from 'react';
import { ShoppingPageData } from '@/data/initialData';
import { Sparkles } from '@/components/icons';

interface ShoppingEditorProps {
    activePage: ShoppingPageData;
    updatePage: (newData: Partial<ShoppingPageData>) => void;
    onAiRequest: () => void;
}

export const ShoppingEditor: React.FC<ShoppingEditorProps> = ({ activePage, updatePage, onAiRequest }) => {
    return (
        <div className="space-y-4">
            <button onClick={onAiRequest} className="w-full py-2 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"><Sparkles size={12}/> ✨ Gerar Lista com IA</button>
            {['hortifruti', 'acougue', 'laticinios', 'padaria', 'mercearia'].map(cat => (
                <div key={cat} className="space-y-1">
                    <label className="text-[10px] font-bold text-navy/40 uppercase">{cat}</label>
                    <textarea className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs text-navy focus:border-accent outline-none" rows={3} value={activePage[cat as keyof ShoppingPageData]} onChange={e => updatePage({[cat]: e.target.value})} />
                </div>
            ))}
        </div>
    );
};