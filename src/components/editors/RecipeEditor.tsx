import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { compressImage } from '@/utils/image';
import { ImageIcon, Plus, Trash2, Sparkles, Package } from '@/components/icons';

interface RecipeEditorProps {
    activePage: RecipePageData;
    updatePage: (newData: Partial<RecipePageData>) => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ activePage, updatePage }) => {
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { compressImage(file).then(res => updatePage({ image: res })); }
    };
    return (
        <div className="space-y-5">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Foto do Prato</label>
                <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl group relative overflow-hidden shadow-sm">
                    {activePage.image ? <img src={activePage.image} className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300"><ImageIcon size={20}/></div>}
                    <label className="flex-1 bg-surface p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer hover:bg-gray-100 text-navy/60 transition-colors">Trocar Foto <input type="file" className="hidden" accept="image/*" onChange={handleImage}/></label>
                    {activePage.image && <button onClick={() => updatePage({image: ''})} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={10}/></button>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] font-bold text-navy/40 uppercase">Categoria</label><input className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs text-navy focus:border-accent outline-none" value={activePage.category} onChange={e => updatePage({category: e.target.value})} /></div>
                <div><label className="text-[10px] font-bold text-navy/40 uppercase">Tags</label><input className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs text-navy focus:border-accent outline-none" value={activePage.code} onChange={e => updatePage({code: e.target.value})} /></div>
                <div><label className="text-[10px] font-bold text-navy/40 uppercase">Rendimento</label><input className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs text-navy focus:border-accent outline-none" value={activePage.yield} onChange={e => updatePage({yield: e.target.value})} /></div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center"><label className="text-[10px] font-black text-accent uppercase tracking-widest">Ingredientes</label><button onClick={() => updatePage({ ingredientGroups: [...activePage.ingredientGroups, { title: '', items: '' }] })} className="p-1 bg-rose-50 text-accent rounded hover:bg-rose-100 transition-colors"><Plus size={14}/></button></div>
                {activePage.ingredientGroups.map((group, gIdx) => (
                <div key={gIdx} className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2 relative group shadow-sm">
                    <button onClick={() => updatePage({ ingredientGroups: activePage.ingredientGroups.filter((_, i) => i !== gIdx) })} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                    <input placeholder="Título (Ex: Massa)" className="w-full bg-transparent border-b border-gray-100 py-1 text-[11px] font-bold uppercase text-navy focus:border-accent outline-none" value={group.title} onChange={e => {
                    const newG = [...activePage.ingredientGroups]; newG[gIdx].title = e.target.value; updatePage({ingredientGroups: newG});
                    }} />
                    <textarea className="w-full bg-surface border border-gray-100 p-2 rounded-lg text-xs text-navy/80 focus:bg-white focus:border-accent outline-none transition-all" rows={4} value={group.items} onChange={e => {
                    const newG = [...activePage.ingredientGroups]; newG[gIdx].items = e.target.value; updatePage({ingredientGroups: newG});
                    }} />
                </div>
                ))}
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent uppercase">Modo de Preparo</label>
                <textarea className="w-full bg-white border border-gray-200 p-4 rounded-xl text-xs leading-relaxed text-navy focus:border-accent outline-none shadow-sm" rows={8} value={activePage.prepSteps} onChange={e => updatePage({prepSteps: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent uppercase">Dica da Nutri</label>
                <textarea className="w-full bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs leading-relaxed text-navy focus:border-orange-200 outline-none" rows={3} value={activePage.tips} onChange={e => updatePage({tips: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-accent uppercase">Armazenamento</label>
                <textarea className="w-full bg-blue-50 border border-blue-100 p-4 rounded-xl text-xs leading-relaxed text-navy focus:border-blue-200 outline-none" rows={2} value={activePage.storage} onChange={e => updatePage({storage: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 gap-2">
                {['cal', 'prot', 'carb', 'fat'].map(m => (
                    <div key={m} className="space-y-1 text-center">
                        <label className="text-[8px] font-black text-navy/40 uppercase">{m}</label>
                        <input className="w-full bg-white border border-gray-200 p-2 rounded-lg text-center text-xs text-navy font-bold focus:border-accent outline-none" value={activePage.nutrition[m as keyof typeof activePage.nutrition]} onChange={e => updatePage({ nutrition: { ...activePage.nutrition, [m]: e.target.value }})} />
                    </div>
                ))}
            </div>
        </div>
    );
};