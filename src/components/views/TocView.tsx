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
        <div className="flex-1 flex flex-col py-20 px-16 font-sans">
            <div className="text-center mb-16">
                <h1 className="font-playfair text-5xl font-bold tracking-widest text-navy">{data.title}</h1>
                <div className="w-12 h-1.5 bg-accent mx-auto mt-6 rounded-full opacity-50"></div>
            </div>
            <div className="space-y-6 max-w-3xl mx-auto w-full">
                {items.map((item, idx) => {
                const isSection = item.type === TEMPLATES.SECTION;
                const pageNum = pages.findIndex(p => p.id === item.id) + 1;
                return (
                    <div key={idx} className={`flex items-end justify-between ${isSection ? 'mt-10 mb-2' : 'border-b border-navy/5 pb-3'}`}>
                        <span className={`uppercase tracking-widest ${isSection ? 'text-accent font-black text-xl' : 'text-navy/80 font-bold text-sm'}`}>{item.title}</span>
                        {!isSection && <div className="flex-1 border-b border-dotted border-navy/20 mx-4 mb-1.5 opacity-50"></div>}
                        {!isSection && <span className="text-navy font-bold text-sm bg-cream px-2 rounded-md">{String(pageNum).padStart(2, '0')}</span>}
                    </div>
                );
                })}
            </div>
        </div>
    );
};