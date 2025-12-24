import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { PlayCircle, Sparkles, Package } from '@/components/icons';

interface InfoFooterProps {
    data: RecipePageData;
    compact?: boolean;
    hideNutrition?: boolean; // Nova prop
}

export const InfoFooter: React.FC<InfoFooterProps> = ({ data, compact = false, hideNutrition = false }) => (
    <div className={`mt-auto ${compact ? 'pt-2 space-y-2' : 'pt-3 space-y-2'}`}>
        {data.videoLink && (
            <a href={data.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-2 rounded-xl border border-accent/20 text-accent hover:bg-accent hover:text-white transition-colors group mb-1 no-underline" style={{backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)'}}>
                <PlayCircle size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Ver Vídeo da Receita</span>
            </a>
        )}
        <div className={`grid ${compact ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 gap-2'}`}>
            {data.tips && (
                <div className="flex gap-2 items-start p-2 rounded-xl border border-accent/20 bg-cream/50">
                    <div className="text-accent shrink-0 mt-0.5"><Sparkles size={10}/></div>
                    <div>
                        <h5 className="text-[10px] font-hand font-bold text-accent mb-0.5">Dica</h5>
                        <p className="text-[9px] text-navy/80 italic font-medium leading-tight">{data.tips}</p>
                    </div>
                </div>
            )}
            {data.storage && (
                <div className="flex gap-2 items-start p-2 rounded-xl border border-navy/5 bg-surface">
                    <div className="text-navy/40 shrink-0 mt-0.5"><Package size={10}/></div>
                    <div>
                        <h5 className="text-[10px] font-hand font-bold text-navy/60 mb-0.5">Armazenamento</h5>
                        <p className="text-[9px] text-navy/70 font-medium leading-tight">{data.storage}</p>
                    </div>
                </div>
            )}
        </div>
        {!hideNutrition && data.nutrition && ( // Condicionalmente renderiza a nutrição
            <div className="mt-2 p-2 rounded-xl border border-accent/20 bg-cream/30">
                <div className="flex justify-between items-center text-center">
                    {Object.entries(data.nutrition || {}).map(([key, val]) => (
                        <div key={key} className="flex-1 border-r border-accent/20 last:border-0 group">
                            <span className="block text-[12px] font-black text-accent leading-none">{val}</span>
                            <span className="block text-[6px] uppercase text-rose-400 font-bold tracking-widest mt-0.5">{key === 'cal' ? 'Kcal' : key === 'fat' ? 'Gord' : key}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);