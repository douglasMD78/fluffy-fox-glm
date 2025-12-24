import React from 'react';

interface ThemeStylesProps {
    theme: { bg: string; text: string; accent: string; };
}

export const ThemeStyles: React.FC<ThemeStylesProps> = ({ theme }) => {
    return (
        <style>{`
            .mobile-page { 
                width: 148mm; 
                height: 210mm; 
                color: ${theme.text}; 
                position: relative; 
                display: flex; 
                flex-direction: column; 
                padding: 0; 
                box-sizing: border-box; 
                overflow: hidden; 
                box-shadow: 0 10px 40px -10px rgba(74, 74, 74, 0.15); 
                border-radius: 2px; 
            }
            .safe-print-area {
                width: 100%;
                height: 100%;
                padding: 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                position: relative;
                z-index: 2;
            }
            .a4-page-texture { 
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E"); 
                pointer-events: none; z-index: 1; 
            }
        `}</style>
    );
};