import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { compressImage } from '@/utils/image';
import { ImageIcon, Plus, Trash2, Sparkles, Package, Columns, PlayCircle, Type, Minus, Maximize } from '@/components/icons';
import { FONT_SIZES, IMG_SIZES, SPACING_MAP } from '@/lib/constants';

interface RecipeEditorProps {
    activePage: RecipePageData;
    updatePage: (newData: Partial<RecipePageData>) => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ activePage, updatePage }) => {
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { compressImage(file).then(res => updatePage({ image: res })); }
    };

    const changeFontSize = (type: 'title' | 'ingredients' | 'prep', val: string) => {
        const currentSizes = activePage.fontSizes || { title: 3, ingredients: 2, prep: 2 };
        const numVal = parseInt(val) || 0;
        updatePage({ fontSizes: { ...currentSizes, [type]: numVal } });
    };

     const changeImageSize = (delta: number) => {
        const currentSize = activePage.imageSize || 3;
        const newValue = Math.max(1, Math.min(5, currentSize + delta));
        updatePage({ imageSize: newValue });
    };

    const changeImageZoom = (delta: number) => {
        const currentZoom = activePage.imageZoom || 100;
        const newZoom = Math.max(50, Math.min(200, currentZoom + delta)); // Limites de 50% a 200%
        updatePage({ imageZoom: newZoom });
    };

    return (
        <div className="space-y-5">
        
        {/* Layout & Spacing Controls */}
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 bg-rose-50 p-3 rounded-xl border border-rose-100 col-span-2">
                 <label className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2"><Columns size={12}/> Estilo</label>
                <div className="flex gap-2">
                    {['2','3','4','5', '6', '7', '8'].map(l => (
                        <button key={l} onClick={() => updatePage({layout: l})} className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${activePage.layout === l ? 'bg-accent text-white shadow-md' : 'bg-white text-navy/60 hover:bg-white/80'}`}>{l}</button>
                    ))}
                </div>
                 <div className="flex items-center justify-between border-t border-rose-200/50 pt-2 mt-2">
                    <span className="text-[9px] font-bold text-navy/50 uppercase">Espaçamento</span>
                    <div className="flex bg-white rounded-lg p-0.5 border border-rose-100">
                        {Object.keys(SPACING_MAP).map(s => (
                            <button 
                                key={s}
                                onClick={() => updatePage({spacing: s})}
                                title={s}
                                className={`p-1.5 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.spacing === s ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-50'}`}
                            >
                                <Maximize size={10} className={s === 'compact' ? 'scale-75' : s === 'airy' ? 'scale-125' : ''} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Font Size Manual Inputs */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-100 col-span-2">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest flex items-center gap-2"><Type size={12}/> Tamanho Fonte (px)</label>
                {['title', 'ingredients', 'prep'].map(type => (
                    <div key={type} className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-navy/60 uppercase w-20">{type === 'title' ? 'Título' : type === 'ingredients' ? 'Ingred.' : 'Preparo'}</span>
                        <input 
                            type="number" 
                            value={(activePage.fontSizes && activePage.fontSizes[type]) || 12} 
                            onChange={(e) => changeFontSize(type, e.target.value)}
                            className="w-16 h-8 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-mono font-bold text-navy focus:outline-none focus:border-accent"
                        />
                    </div>
                ))}
                 <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                    <span className="text-[10px] font-bold text-navy/60 uppercase w-20">Tam. Imagem</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeImageSize(-1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy"><Minus size={12}/></button>
                        <span className="text-xs font-mono font-bold w-4 text-center">{activePage.imageSize || 3}</span>
                        <button onClick={() => changeImageSize(1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy"><Plus size={12}/></button>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Foto do Prato</label>
            <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl group relative overflow-hidden shadow-sm">
            {activePage.image ? <img src={activePage.image} className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300"><ImageIcon size={20}/></div>}
            <label className="flex-1 bg-surface p-2 rounded-xl text-center text-[10px] font-bold cursor-pointer hover:bg-gray-100 text-navy/60 transition-colors">Trocar Foto <input type="file" className="hidden" accept="image/*" onChange={handleImage}/></label>
            {activePage.image && <button onClick={() => updatePage({image: ''})} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={10}/></button>}
            </div>
        </div>

        {/* Controles de Imagem (object-fit, object-position, zoom) */}
        {activePage.image && (
            <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12}/> Ajuste da Imagem</label>
                
                {/* Object Fit */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy/60 uppercase">Encaixe</span>
                    <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                        <button 
                            onClick={() => updatePage({ objectFit: 'cover' })} 
                            className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.objectFit === 'cover' ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-100'}`}
                        >
                            Cobrir
                        </button>
                        <button 
                            onClick={() => updatePage({ objectFit: 'contain' })} 
                            className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.objectFit === 'contain' ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-100'}`}
                        >
                            Conter
                        </button>
                    </div>
                </div>

                {/* Object Position */}
                {activePage.objectFit === 'cover' && ( // Apenas mostra se objectFit for 'cover'
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-navy/60 uppercase block">Posição</span>
                        <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                            {['top left', 'top', 'top right', 'left', 'center', 'right', 'bottom left', 'bottom', 'bottom right'].map(pos => (
                                <button 
                                    key={pos}
                                    onClick={() => updatePage({ objectPosition: pos })}
                                    className={`h-8 rounded-md text-[8px] font-bold uppercase transition-all ${activePage.objectPosition === pos ? 'bg-accent text-white shadow-sm' : 'bg-white text-navy/40 hover:bg-gray-100'}`}
                                >
                                    {pos.replace(' ', '-')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image Zoom */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy/60 uppercase">Zoom</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeImageZoom(-10)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy"><Minus size={12}/></button>
                        <span className="text-xs font-mono font-bold w-8 text-center">{activePage.imageZoom || 100}%</span>
                        <button onClick={() => changeImageZoom(10)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy"><Plus size={12}/></button>
                    </div>
                </div>
            </div>
        )}

        <div className="space-y-2">
             <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Link do Vídeo (Opcional)</label>
             <div className="flex items-center gap-2 bg-white border border-gray-200 p-3 rounded-xl">
                <PlayCircle size={14} className="text-accent" />
                <input className="flex-1 text-xs text-navy focus:outline-none bg-transparent" placeholder="Cole o link do YouTube/Instagram aqui..." value={activePage.videoLink || ''} onChange={e => updatePage({videoLink: e.target.value})} />
             </div>
        </div>

        {/* Novo controle para o estilo do vídeo */}
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Estilo do Link do Vídeo</label>
            <div className="flex gap-2 bg-white border border-gray-200 p-2 rounded-xl">
                <button 
                    onClick={() => updatePage({ videoDisplayStyle: 'button' })} 
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activePage.videoDisplayStyle === 'button' ? 'bg-accent text-white shadow-md' : 'bg-surface text-navy/60 hover:bg-gray-100'}`}
                >
                    Botão
                </button>
                <button 
                    onClick={() => updatePage({ videoDisplayStyle: 'overlay' })} 
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activePage.videoDisplayStyle === 'overlay' ? 'bg-accent text-white shadow-md' : 'bg-surface text-navy/60 hover:bg-gray-100'}`}
                >
                    Ícone na Imagem
                </button>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-navy/40 uppercase">Categoria</label><input className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs text-navy focus:border-accent outline-none" value={activePage.category} onChange={e => updatePage({category: e.target.value})} /></div>
            <div><label className="text-[10px] font-bold text-navy/40 uppercase">Tags (Códigos: CM, A, J...)</label><input className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs text-navy focus:border-accent outline-none" placeholder="Ex: CM, A, J" value={activePage.code} onChange={e => updatePage({code: e.target.value})} /></div>
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
            {['cal', 'prot', 'carb', 'Gord'].map(m => (
                <div key={m} className="space-y-1 text-center">
                    <label className="text-[8px] font-black text-navy/40 uppercase">{m}</label>
                    <input className="w-full bg-white border border-gray-200 p-2 rounded-lg text-center text-xs text-navy font-bold focus:border-accent outline-none" value={activePage.nutrition[m as keyof typeof activePage.nutrition]} onChange={e => updatePage({ nutrition: { ...activePage.nutrition, [m]: e.target.value }})} />
                </div>
            ))}
        </div>
        </div>
    );
};