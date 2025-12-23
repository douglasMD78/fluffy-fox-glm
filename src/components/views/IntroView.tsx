import React from 'react';
import { IntroPageData } from '@/data/initialData';

interface IntroViewProps {
    data: IntroPageData;
}

export const IntroView: React.FC<IntroViewProps> = ({ data }) => {
    return (
        <div className="flex-1 flex flex-col justify-center py-20 px-16 relative font-sans">
            <div className="max-w-2xl mx-auto text-center">
                <h3 className="font-playfair text-4xl text-navy mb-2">{data.title}</h3>
                <span className="text-accent font-playfair italic text-6xl mb-12 block leading-snug">{data.highlight}</span>
                <div className="h-px w-20 bg-pastel mx-auto mb-16 opacity-50"></div>
                <div className="text-navy/70 text-[18px] leading-loose text-justify font-medium whitespace-pre-wrap columns-1 px-4">
                    <span className="font-playfair text-7xl float-left mr-4 mt-[-10px] text-pastel">"</span>
                    {data.text}
                </div>
                <div className="mt-20 flex flex-col items-center">
                    <span className="font-hand text-5xl text-accent transform -rotate-3 opacity-90">Com carinho, Luiza</span>
                </div>
            </div>
        </div>
    );
};