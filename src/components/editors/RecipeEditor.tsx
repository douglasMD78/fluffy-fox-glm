import React, { useState, useEffect } from 'react';
import { RecipePageData } from '@/data/initialData';
import { compressImage } from '@/utils/image';
import { ImageIcon, Plus, Trash2, Sparkles, Package, Columns, PlayCircle, Type, Minus, Maximize, HardDrive, Brain } from '@/components/icons'; // Importar Brain para nutrição
import { FONT_SIZES, IMG_SIZES, SPACING_MAP, COLUMN_RATIOS, ColumnRatioKey } from '@/lib/constants';
import { MarkdownTextarea } from '@/components/common/MarkdownTextarea';

interface RecipeEditorProps {
    activePage: RecipePageData;
    updatePage: (newData: Partial<RecipePageData>) => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({ activePage, updatePage }) => {
    const [positionX, setPositionX] = useState(50);
    const [positionY, setPositionY] = useState(50);

    useEffect(() => {
        const parsePosition = (pos: string) => {
            if (!pos) return { x: 50, y: 50 }; // Default to center

            const keywordMap: { [key: string]: { x: number, y: number } } = {
                'center': { x: 50, y: 50 },
                'top': { x: 50, y: 0 },
                'bottom': { x: 50, y: 100 },
                'left': { x: 0, y: 50 },
                'right': { x: 100, y: 50 },
                'top left': { x: 0, y: 0 },
                'top right': { x: 100, y: 0 },
                'bottom left': { x: 0, y: 100 },
                'bottom right': { x: 100, y: 100 },
            };

            if (keywordMap[pos]) {
                return keywordMap[pos];
            }

            // Try to parse as "X% Y%"
            const parts = pos.split(' ').map(p => parseInt(p.replace('%', '')));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                return { x: parts[0], y: parts[1] };
            }

            return { x: 50, y: 50 }; // Fallback
        };

        const { x, y } = parsePosition(activePage.objectPosition || 'center');
        setPositionX(x);
        setPositionY(y);
    }, [activePage.objectPosition]);

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

    const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value)) {
            const newZoom = Math.max(50, Math.min(200, value));
            updatePage({ imageZoom: newZoom });
        }
    };

    const handlePositionChange = (axis: 'x' | 'y', value: number) => {
        const clampedValue = Math.max(0, Math.min(100, value));
        let newX = positionX;
        let newY = positionY;

        if (axis === 'x') {
            newX = clampedValue;
            setPositionX(clampedValue);
        } else {
            newY = clampedValue;
            setPositionY(clampedValue);
        }
        updatePage({ objectPosition: `${newX}% ${newY}%` });
    };

    const isTwoColumnLayout = ['2', '7', '8', '9'].includes(activePage.layout);

    return (
        <div className="space-y-5">
        
        {/* Layout & Spacing Controls */}
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 bg-rose-50 p-3 rounded-xl border border-rose-100 col-span-2">
                 <label className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2"><Columns size={12}/> Estilo</label>
                <div className="flex gap-2">
                    {['2','3','4','5', '6', '7', '8', '9'].map(l => ( 
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
                {isTwoColumnLayout && (
                    <div className="flex items-center justify-between border-t border-rose-200/50 pt-2 mt-2">
                        <span className="text-[9px] font-bold text-navy/50 uppercase">Proporção Colunas</span>
                        <div className="flex bg-white rounded-lg p-0.5 border border-rose-100">
                            {Object.keys(COLUMN_RATIOS).map(ratioKey => (
                                <button 
                                    key={ratioKey}
                                    onClick={() => updatePage({ columnRatio: ratioKey as ColumnRatioKey })}
                                    title={ratioKey}
                                    className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.columnRatio === ratioKey ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-50'}`}
                                >
                                    {ratioKey === 'default' ? 'Padrão' : ratioKey === 'balanced' ? 'Balanceado' : ratioKey === 'ingredients-heavy' ? 'Ingred.' : 'Preparo'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Font Size Manual Inputs */}
            <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-100 col-span-2">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest flex items-center gap-2"><Type size={12}/> Tamanho Fonte (px)</label>
                {['title', 'ingredients', 'prep'].map(type => (
                    <div key={type} className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-navy/60 uppercase w-20">{type === 'title' ? 'Título' : type === 'ingredients' ? 'Ingred.' : 'Preparo'}</span>
                        <input 
                            type="number" 
                            value={(activePage.fontSizes && activePage.fontSizes[type]) || FONT_SIZES[type][2]} // Default to level 2 if not set
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
                        <span className="text-[10px] font-bold text-navy/60 uppercase block">Posição (%)</span>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                <span className="text-[9px] font-bold text-navy/60 uppercase w-4 text-center">X</span>
                                <input 
                                    type="number" 
                                    value={positionX} 
                                    onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
                                    className="flex-1 h-8 bg-white border border-gray-200 rounded-lg text-center text-xs font-mono font-bold text-navy focus:outline-none focus:border-accent"
                                    min="0" max="100"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                <span className="text-[9px] font-bold text-navy/60 uppercase w-4 text-center">Y</span>
                                <input 
                                    type="number" 
                                    value={positionY} 
                                    onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
                                    className="flex-1 h-8 bg-white border border-gray-200 rounded-lg text-center text-xs font-mono font-bold text-navy focus:outline-none focus:border-accent"
                                    min="0" max="100"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Zoom */}
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-navy/60 uppercase">Zoom (%)</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeImageZoom(-1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy"><Minus size={12}/></button>
                        <input 
                            type="number" 
                            value={activePage.imageZoom || 100} 
                            onChange={handleZoomInputChange}
                            className="w-12 h-8 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-mono font-bold text-navy focus:outline-none focus:border-accent"
                            min="50" max="200"
                        />
                        <button onClick={() => changeImageZoom(1)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-navy"><Plus size={12}/></button>
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
                <MarkdownTextarea 
                    placeholder="Lista de ingredientes" 
                    rows={4} 
                    value={group.items} 
                    onChange={value => {
                        const newG = [...activePage.ingredientGroups]; 
                        newG[gIdx].items = value; 
                        updatePage({ingredientGroups: newG});
                    }} 
                    className="!p-2 !pr-8" // Ajuste de padding para o botão
                    accentColor="accent"
                />
            </div>
            ))}
        </div>
        <div className="space-y-2">
            <MarkdownTextarea 
                label="Modo de Preparo" 
                rows={8} 
                value={activePage.prepSteps} 
                onChange={value => updatePage({prepSteps: value})} 
                accentColor="accent"
            />
        </div>
        
        {/* Controles de Posição para Dica e Armazenamento */}
        <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12}/> Posição da Dica</label>
            <div className="flex gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                {['footer', 'ingredients', 'prep', 'hidden'].map(placement => (
                    <button 
                        key={placement}
                        onClick={() => updatePage({ tipPlacement: placement as RecipePageData['tipPlacement'] })}
                        className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.tipPlacement === placement ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-100'}`}
                    >
                        {placement === 'footer' ? 'Rodapé' : placement === 'ingredients' ? 'Ingred.' : placement === 'prep' ? 'Preparo' : 'Ocultar'}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <MarkdownTextarea 
                label="Dica da Nutri" 
                rows={3} 
                value={activePage.tips} 
                onChange={value => updatePage({tips: value})} 
                className="!bg-orange-50 !border-orange-100 focus:!border-orange-200"
                accentColor="orange-200"
            />
        </div>

        <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-2"><HardDrive size={12}/> Posição do Armazenamento</label>
            <div className="flex gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                {['footer', 'ingredients', 'prep', 'hidden'].map(placement => (
                    <button 
                        key={placement}
                        onClick={() => updatePage({ storagePlacement: placement as RecipePageData['storagePlacement'] })}
                        className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.storagePlacement === placement ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-100'}`}
                    >
                        {placement === 'footer' ? 'Rodapé' : placement === 'ingredients' ? 'Ingred.' : placement === 'prep' ? 'Preparo' : 'Ocultar'}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <MarkdownTextarea 
                label="Armazenamento" 
                rows={2} 
                value={activePage.storage} 
                onChange={value => updatePage({storage: value})} 
                className="!bg-blue-50 !border-blue-100 focus:!border-blue-200"
                accentColor="blue-200"
            />
        </div>

        {/* Controles de Estilo de Nutrição */}
        <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <label className="text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-2"><Brain size={12}/> Estilo da Nutrição</label>
            <div className="flex gap-2 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                {['default', 'inline-compact', 'block-detailed', 'hidden'].map(style => (
                    <button 
                        key={style}
                        onClick={() => updatePage({ nutritionDisplayStyle: style as RecipePageData['nutritionDisplayStyle'] })}
                        className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${activePage.nutritionDisplayStyle === style ? 'bg-accent text-white shadow-sm' : 'text-navy/40 hover:bg-gray-100'}`}
                    >
                        {style === 'default' ? 'Padrão' : style === 'inline-compact' ? 'Compacto' : style === 'block-detailed' ? 'Detalhado' : 'Ocultar'}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
            {['cal', 'prot', 'carb', 'fat'].map(m => ( // Corrigido para 'fat'
                <div key={m} className="space-y-1 text-center">
                    <label className="text-[8px] font-black text-navy/40 uppercase">{m === 'cal' ? 'Kcal' : m === 'prot' ? 'Prot' : m === 'carb' ? 'Carb' : 'Gord'}</label>
                    <input className="w-full bg-white border border-gray-200 p-2 rounded-lg text-center text-xs text-navy font-bold focus:border-accent outline-none" value={activePage.nutrition[m as keyof typeof activePage.nutrition]} onChange={e => updatePage({ nutrition: { ...activePage.nutrition, [m]: e.target.value }})} />
                </div>
            ))}
        </div>
        </div>
    );
};