import React from 'react';
import { SectionPageData } from '@/data/initialData';

interface SectionViewProps {
    data: SectionPageData;
}

export const SectionView: React.FC<SectionViewProps> = ({ data }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-[#FDFDFD] h-full relative font-sans">
            <div className="border-4 border-double border-cream p-12 md:p-24 m-12 rounded-[3rem]">
                <div className="h-2 w-32 bg-accent/20 mx-auto mb-12 rounded-full"></div>
                <h1 className="font-playfair text-6xl font-bold text-navy tracking-widest uppercase mb-6 leading-tight max-w-lg">{data.title}</h1>
                <p className="font-hand text-6xl text-accent/80 transform -rotate-2">{data.subtitle}</p>
            </div>
        </div>
    );
};