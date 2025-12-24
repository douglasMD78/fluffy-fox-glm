import React from 'react';
import { RecipePageData } from '@/data/initialData';
import { Brain } from '@/components/icons'; // Usando Brain para representar nutrição

interface NutritionDisplayProps {
    nutrition: RecipePageData['nutrition'];
    displayStyle: RecipePageData['nutritionDisplayStyle'];
    compact?: boolean;
    macroNote?: string; // Adicionando macroNote aqui
}

export const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ nutrition, displayStyle, compact = false, macroNote }) => {
    if (!nutrition || displayStyle === 'hidden') {
        return null;
    }

    const nutritionEntries = Object.entries(nutrition || {});

    // Estilo padrão (como no InfoFooter original)
    if (displayStyle === 'default') {
        return (
            <div className={`p-2 rounded-xl border border-accent/20 bg-cream/30 ${compact ? 'mt-2' : 'mt-3'}`}>
                <div className="flex justify-between items-center text-center">
                    {nutritionEntries.map(([key, val]) => (
                        <div key={key} className="flex-1 border-r border-accent/20 last:border-0 group">
                            <span className="block text-[12px] font-black text-accent leading-none">{val}</span>
                            <span className="block text-[6px] uppercase text-rose-400 font-bold tracking-widest mt-0.5">{key === 'cal' ? 'Kcal' : key === 'fat' ? 'Gord' : key}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Estilo inline-compact (como no Layout 9)
    if (displayStyle === 'inline-compact') {
        return (
            <div className="flex items-center gap-2 text-right mt-1">
                {nutrition.cal && (
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] font-black text-accent leading-none">{nutrition.cal}</span>
                        <span className="text-[6px] uppercase text-rose-400 font-bold tracking-widest">Kcal</span>
                    </div>
                )}
                {nutrition.prot && (
                    <>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-black text-navy leading-none">{nutrition.prot}</span>
                            <span className="text-[6px] uppercase text-navy/40 font-bold tracking-widest">Prot</span>
                        </div>
                    </>
                )}
                {nutrition.carb && (
                    <>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-black text-navy leading-none">{nutrition.carb}</span>
                            <span className="text-[6px] uppercase text-navy/40 font-bold tracking-widest">Carb</span>
                        </div>
                    </>
                )}
                {nutrition.fat && (
                    <>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-black text-navy leading-none">{nutrition.fat}</span>
                            <span className="text-[6px] uppercase text-navy/40 font-bold tracking-widest">Gord</span>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Estilo block-detailed (uma tabela mais tradicional)
    if (displayStyle === 'block-detailed') {
        return (
            <div className={`p-3 rounded-xl border border-navy/10 bg-white shadow-sm ${compact ? 'mt-2' : 'mt-3'}`}>
                <h4 className="text-[10px] font-black text-navy/60 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Brain size={10} className="text-navy/40" /> Valores Nutricionais
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {nutritionEntries.map(([key, val]) => (
                        <div key={key} className="flex justify-between items-baseline border-b border-gray-100 pb-0.5">
                            <span className="font-medium text-navy/80">{key === 'cal' ? 'Calorias' : key === 'prot' ? 'Proteínas' : key === 'carb' ? 'Carboidratos' : key === 'fat' ? 'Gorduras' : key}</span>
                            <span className="font-bold text-navy">{val}</span>
                        </div>
                    ))}
                </div>
                {macroNote && <p className="text-[8px] text-navy/60 italic mt-2">{macroNote}</p>}
            </div>
        );
    }

    return null;
};