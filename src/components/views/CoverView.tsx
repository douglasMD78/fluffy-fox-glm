import React from 'react';
import { CoverPageData } from '@/data/initialData';
import { IconBase } from '@/components/icons';

interface CoverViewProps {
    data: CoverPageData;
}

export const CoverView: React.FC<CoverViewProps> = ({ data }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-between py-20 text-navy bg-cream h-full relative overflow-hidden font-sans">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-20" />
            <div className="absolute right-6 top-0 bottom-0 w-px bg-black/5 z-20" />
            
            <div className="text-center pt-24 relative z-10 opacity-70">
                <div className="text-rose-900 mb-2"><IconBase size={24} className="fill-current"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></IconBase></div>
                <p className="text-rose-900 text-xs font-bold tracking-[0.4em] uppercase">{data.edition}</p>
            </div>

            <div className="text-center relative z-10">
                <h1 className="font-playfair text-[90px] italic leading-none text-[#5d4037] mb-4">{data.title}</h1>
                <div className="w-12 h-px bg-[#8d6e63] mx-auto opacity-50 mb-4"></div>
                <h2 className="text-5xl font-light tracking-[0.5em] text-[#5d4037] uppercase font-lato scale-90">{data.subtitle}</h2>
            </div>

            <div className="border border-[#5d4037]/20 px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-24 shadow-sm relative z-10">
                <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#5d4037]">{data.author}</span>
            </div>
        </div>
    );
};