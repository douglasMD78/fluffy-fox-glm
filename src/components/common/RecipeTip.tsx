import React from 'react';
import { Sparkles } from '@/components/icons';
import { renderMarkdownText } from '@/utils/markdown';

interface RecipeTipProps {
    tip: string;
    compact?: boolean;
}

export const RecipeTip: React.FC<RecipeTipProps> = ({ tip, compact = false }) => {
    if (!tip) return null;

    return (
        <div className={`flex gap-2 items-start p-2 rounded-xl border border-accent/20 bg-cream/50 ${compact ? 'text-[9px]' : 'text-xs'}`}>
            <div className="text-accent shrink-0 mt-0.5"><Sparkles size={compact ? 10 : 12}/></div>
            <div>
                <h5 className={`font-hand font-bold text-accent mb-0.5 ${compact ? 'text-[10px]' : 'text-sm'}`}>Dica</h5>
                <p className={`text-navy/80 italic font-medium leading-tight ${compact ? 'text-[9px]' : 'text-xs'}`}>{renderMarkdownText(tip)}</p>
            </div>
        </div>
    );
};