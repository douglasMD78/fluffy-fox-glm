import React from 'react';
import { ShoppingPageData } from '@/data/initialData';

interface ShoppingViewProps {
    data: ShoppingPageData;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({ data }) => {
    const cats = [
        { k: 'Hortifruti', v: data.hortifruti, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-100' },
        { k: 'Açougue & Peixaria', v: data.acougue, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-100' },
        { k: 'Laticínios', v: data.laticinios, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-100' },
        { k: 'Padaria & Cereais', v: data.padaria, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-100' },
        { k: 'Mercearia', v: data.mercearia, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-100' }
    ];
    return (
        <div className="flex-1 flex flex-col py-16 px-12 bg-surface font-sans">
            <div className="text-center mb-12">
                <h1 className="font-playfair text-4xl font-bold text-navy uppercase tracking-widest border-b-4 border-accent/20 pb-4 inline-block">{data.title}</h1>
            </div>
            <div className="flex flex-col gap-6">
                {cats.map((c, i) => (
                <div key={i} className={`break-inside-avoid bg-white p-6 rounded-[1.5rem] shadow-soft border ${c.border}`}>
                    <h3 className={`${c.color} font-black text-[11px] tracking-widest flex items-center gap-2 uppercase mb-4`}>
                        <div className={`w-2 h-2 ${c.bg} rounded-full`}/> {c.k}
                    </h3>
                    <ul className="space-y-3">
                        {c.v.split('\n').filter(l => l.trim()).map((it, j) => (
                            <li key={j} className="flex gap-3 text-[14px] text-navy/80 leading-snug items-start font-medium">
                                <div className="w-3 h-3 border border-gray-300 rounded flex-shrink-0 mt-0.5 bg-gray-50" />
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