import React from 'react';
import { Package } from '@/components/icons';
import { renderMarkdownText } from '@/utils/markdown';

interface RecipeStorageProps {
    storage: string;
    compact?: boolean;
}

export const RecipeStorage: React.FC<RecipeStorageProps> = ({ storage, compact = false }) => {
    if (!storage) return null;

    return (
        <div className={`flex gap-2 items-start p-2 rounded-xl border border-navy/5 bg-surface ${compact ? 'text-[9px]' : 'text-xs'}`}>
            <div className="text-navy/40 shrink-0 mt-0.5"><Package size={compact ? 10 : 12}/></div>
            <div>
                <h5 className={`font-hand font-bold text-navy/60 mb-0.5 ${compact ? 'text-[10px]' : 'text-sm'}`}>Armazenamento</h5>
                <p className={`text-navy/70 font-medium leading-tight ${compact ? 'text-[9px]' : 'text-xs'}`}>{renderMarkdownText(storage)}</p>
            </div>
        </div>
    );
};