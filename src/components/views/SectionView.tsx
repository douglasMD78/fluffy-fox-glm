import React from 'react';
import { SectionPageData } from '@/data/initialData';

interface SectionViewProps {
    data: SectionPageData;
}

export const SectionView: React.FC<SectionViewProps> = ({ data }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center bg-[#FDFDFD] h-full relative font-sans">
            <div className="border-4 border-double border-cream p-6 m-4 rounded-[2rem] w-4/5">
                <div className="h-1.5 w-12 bg-accent/20 mx-auto mb-6 rounded-full"></div>
                <h1 className="font-playfair text-3xl font-bold text-navy tracking-widest uppercase mb-3 leading-tight">{data.title}</h1>
                <p className="font-hand text-3xl text-accent/80 transform -rotate-2">{data.subtitle}</p>
            </div>
        </div>
    );
};