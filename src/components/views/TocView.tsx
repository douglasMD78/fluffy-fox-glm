import React from 'react';
import { PageData, TocPageData } from '@/data/initialData';
import { TEMPLATES } from '@/lib/constants';

interface TocViewProps {
    pages: PageData[];
    data: TocPageData;
}

export const TocView: React.FC<TocViewProps> = ({ pages, data }) => {
    const items = pages.filter(p => [TEMPLATES.RECIPE, TEMPLATES.SECTION].includes(p.type));
    return (
        <div className="flex-1 flex flex-col py-10 px-6 font-sans">
            <div className="text-center mb-6">
                <h1 className="font-playfair text-2xl font-bold tracking-widest text-navy">{data.title}</h1>
                <div className="w-8 h-1 bg-accent mx-auto mt-3 rounded-full opacity-50"></div>
            </div>
            <div className="space-y-2 w-full">
                {items.map((item, idx) => {
                const isSection = item.type === TEMPLATES.SECTION;
                const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                return (
                    <div key={idx} className={`flex items-end justify-between ${isSection ? 'mt-4 mb-1' : 'border-b border-navy/5 pb-1.5'}`}>
                        <span className={`uppercase tracking-widest ${isSection ? 'text-accent font-black text-xs' : 'text-navy/90 font-bold text-[11px]'}`}>{item.title}</span>
                        {!isSection && <div className="flex-1 border-b border-dotted border-navy/20 mx-2 mb-1 opacity-50"></div>}
                        {!isSection && <span className="text-navy font-bold text-[10px] bg-cream px-1 rounded-md">{String(pageNum).padStart(2, '0')}</span>}
                    </div>
                );
                })}
            </div>
        </div>
    );
};