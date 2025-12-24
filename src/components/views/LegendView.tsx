import React from 'react';
import { LegendPageData } from '@/data/initialData';
import { TAG_DEFS } from '@/lib/constants';

interface LegendViewProps {
    data: LegendPageData;
}

export const LegendView: React.FC<LegendViewProps> = ({ data }) => {
    const codes = TAG_DEFS;
    return (
        <div className="flex-1 flex flex-col py-10 items-center justify-center bg-white font-sans">
            <div className="text-center mb-8 px-6">
                <h1 className="font-playfair text-3xl font-bold text-navy uppercase tracking-widest mb-4">{data.title}</h1>
                <div className="w-12 h-1 bg-accent mx-auto mb-6 rounded-full opacity-50"></div>
                <p className="text-navy/70 text-[13px] leading-relaxed italic max-w-sm mx-auto">{data.text}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-xs px-6">
                {codes.map(i => (
                <div key={i.code} className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-gray-100 shadow-sm print:border-gray-200">
                    <span className={`${i.color} ${i.text} font-black text-[9px] w-8 h-8 flex items-center justify-center rounded-lg shadow-sm shrink-0 print-color-adjust`}>{i.code}</span>
                    <span className="text-navy font-bold text-[11px] uppercase tracking-widest">{i.label}</span>
                </div>
                ))}
            </div>
        </div>
    );
};