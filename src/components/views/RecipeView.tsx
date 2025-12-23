import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { IconBase, ImageIcon, Sparkles, Package } from '@/components/icons';

interface RecipeViewProps {
    data: RecipePageData;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ data }) => {
    return (
        <div className="h-full flex flex-col pt-10 px-10 pb-0 font-sans">
            {/* Header */}
            <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-rose-50 text-accent text-[10px] font-black uppercase tracking-widest mb-3 border border-rose-100 shadow-sm">
                    {data.category || 'Receita'}
                </span>
                <h1 className="font-playfair text-[44px] font-bold leading-[1.1] text-navy mb-2">
                    {data.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                    {data.yield && <span className="flex items-center gap-1"><IconBase size={12}><circle cx="12" cy="12" r="10"></circle></IconBase> {data.yield}</span>}
                    {data.code && <span className="text-pastel">|</span>}
                    {data.code && <span>{data.code}</span>}
                </div>
            </div>

            {/* Layout em Grid Flexível (2 Colunas) */}
            <div className="flex-1 grid grid-cols-[1fr_1.8fr] gap-8 min-h-0 items-start">
                
                {/* Coluna Esquerda: Ingredientes + Imagem */}
                <div className="flex flex-col gap-6">
                    
                    {/* Card de Ingredientes (Compacto) */}
                    <div className="bg-[#FFF5F7] rounded-[1.5rem] p-5 border border-white shadow-soft relative">
                        <h3 className="font-playfair font-bold text-lg text-navy mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs shadow-glow">I</span>
                            Ingredientes
                        </h3>
                        <div className="space-y-4">
                            {data.ingredientGroups.map((g, i) => (
                                <div key={i}>
                                    {g.title && <h4 className="text-[10px] font-black text-pastel uppercase tracking-widest mb-2 border-b border-accent/10 pb-1 inline-block">{g.title}</h4>}
                                    <ul className="space-y-2">
                                        {g.items.split('\n').filter(l => l.trim()).map((item, j) => (
                                            <li key={j} className="text-[12px] font-medium text-navy/80 flex items-start gap-2 leading-snug">
                                                <div className="w-1.5 h-1.5 rounded-full bg-pastel mt-1.5 shrink-0"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Imagem (Se houver espaço ou for pequena) */}
                    <div className="p-2 bg-white shadow-card-float rounded-2xl transform rotate-[-2deg] transition-transform hover:rotate-0 self-center w-4/5">
                        {data.image ? (
                            <div className="aspect-square rounded-xl overflow-hidden shadow-inner">
                                <img src={data.image} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="aspect-square rounded-xl bg-rose-50 flex items-center justify-center text-pastel">
                                <ImageIcon size={24}/>
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna Direita: Preparo e Detalhes */}
                <div className="flex flex-col h-full">
                    <h3 className="font-playfair font-bold text-xl text-navy mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-xs">P</span>
                        Modo de Preparo
                    </h3>
                    
                    <div className="space-y-4 mb-6 flex-1">
                        {data.prepSteps.split('\n').filter(l => l.trim()).map((step, i) => (
                            <div key={i} className="flex gap-4 group items-baseline">
                                <span className="font-playfair text-2xl text-pastel font-bold group-hover:text-accent transition-colors w-6 text-right shrink-0">
                                    {String(i+1).padStart(2,'0')}
                                </span>
                                <div className="flex-1 pb-3 border-b border-navy/5">
                                    <p className="text-[13px] text-navy/80 leading-relaxed text-justify font-sans">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {/* Dica */}
                        {data.tips && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 shadow-sm items-start">
                                <div className="text-orange-400 shrink-0 mt-0.5"><Sparkles size={14}/></div>
                                <div>
                                    <h5 className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Dica da Nutri</h5>
                                    <p className="text-[11px] text-orange-900/80 italic font-medium leading-relaxed">{data.tips}</p>
                                </div>
                            </div>
                        )}

                        {/* Storage */}
                        {data.storage && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 shadow-sm items-start">
                                <div className="text-blue-400 shrink-0 mt-0.5"><Package size={14}/></div>
                                <div>
                                    <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Armazenamento</h5>
                                    <p className="text-[11px] text-blue-900/80 font-medium leading-relaxed">{data.storage}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nutrição Badges (Compacto) */}
                    <div className="mt-auto pt-4 border-t border-navy/5 flex justify-between items-center gap-2">
                        {Object.entries(data.nutrition || {}).map(([key, val]) => (
                            <div key={key} className="flex flex-col items-center bg-white border border-gray-100 rounded-xl p-2 min-w-[60px] shadow-sm">
                                <span className="text-[14px] font-black text-navy font-playfair">{val}</span>
                                <span className="text-[7px] uppercase text-pastel font-bold tracking-widest">{key === 'cal' ? 'Kcal' : key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};