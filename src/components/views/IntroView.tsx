import React from 'react';
import { IntroPageData } from '@/data/initialData';

interface IntroViewProps {
    data: IntroPageData;
}

export const IntroView: React.FC<IntroViewProps> = ({ data }) => {
    return (
        <div className="flex-1 flex flex-col justify-center py-10 px-6 relative font-sans">
            <div className="w-full text-center">
                <h3 className="font-playfair text-xl text-navy mb-2">{data.title}</h3>
                <span className="text-accent font-playfair italic text-3xl mb-6 block leading-snug">{data.highlight}</span>
                <div className="h-px w-10 bg-pastel mx-auto mb-8 opacity-50"></div>
                <div className="text-navy/90 text-[14px] leading-loose text-left font-medium whitespace-pre-wrap">
                    {data.text}
                </div>
                <div className="mt-10 flex flex-col items-center">
                    <span className="font-hand text-2xl text-accent transform -rotate-3 opacity-90">Com carinho, Luiza</span>
                </div>
            </div>
        </div>
    );
};