import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { PlayCircle } from '@/components/icons';

interface InfoFooterProps {
    data: RecipePageData;
    compact?: boolean;
    hideNutrition?: boolean; 
}

export const InfoFooter: React.FC<InfoFooterProps> = ({ data, compact = false, hideNutrition = false }) => (
    <div className={`mt-auto ${compact ? 'pt-2 space-y-2' : 'pt-3 space-y-2'}`}>
        {data.videoLink && data.videoDisplayStyle === 'button' && ( // Renderiza o botão apenas se o estilo for 'button'
            <a href={data.videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full p-2 rounded-xl border border-accent/20 text-accent hover:bg-accent hover:text-white transition-colors group mb-1 no-underline" style={{backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', borderColor: 'var(--color-accent)'}}>
                <PlayCircle size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Ver Vídeo da Receita</span>
            </a>
        )}
        {/* Dica e Armazenamento foram movidos para RecipeView */}
        {!hideNutrition && data.nutrition && ( 
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