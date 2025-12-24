import React from 'react';
import { ShoppingPageData } from '@/data/initialData';

interface ShoppingViewProps {
    data: ShoppingPageData;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ data }) => {
    const cats = [
        { k: 'Hortifruti', v: data.hortifruti, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
        { k: 'Açougue & Peixaria', v: data.acougue, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
        { k: 'Laticínios', v: data.laticinios, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
        { k: 'Padaria & Cereais', v: data.padaria, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        { k: 'Mercearia', v: data.mercearia, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' }
    ];
    return (
        <div className="flex-1 flex flex-col py-8 px-4 bg-surface font-sans print:bg-white">
            <div className="text-center mb-6">
                <h1 className="font-playfair text-xl font-bold text-navy uppercase tracking-widest border-b-4 border-accent/20 pb-1.5 inline-block">{data.title}</h1>
            </div>
            <div className="flex flex-col gap-2">
                {cats.map((c, i) => (
                <div key={i} className={`break-inside-avoid bg-white p-3 rounded-xl shadow-sm border ${c.border} print:border-gray-300`}>
                    <h3 className={`${c.color} font-black text-[9px] tracking-widest flex items-center gap-2 uppercase mb-1.5`}>
                        <div className={`w-2 h-2 ${c.bg} rounded-full border ${c.border}`}/> {c.k}
                    </h3>
                    <ul className="space-y-1">
                        {c.v.split('\n').filter(l => l.trim()).map((it, j) => (
                            <li key={j} className="flex gap-1.5 text-[11px] text-navy/90 leading-snug items-start font-medium">
                                <div className="w-2 h-2 border border-gray-400 rounded-sm flex-shrink-0 mt-0.5 bg-white" />
                                {it}
                            </li>
                        ))}
                    </ul>
                </div>
                ))}
            </div>
        </div>
    );
};