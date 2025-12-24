import React from 'react';
import { getTagStyle } from '@/lib/constants';

interface TagListProps {
    tags: string;
}

export const TagList: React.FC<TagListProps> = ({ tags }) => {
    if (!tags) return null;
    const codes = tags.split(',').map(c => c.trim()).filter(Boolean);
    return (
        <div className="flex flex-wrap gap-1 mt-1">
            {codes.map((c, i) => {
                const style = getTagStyle(c);
                return (
                    <span key={i} className={`${style.color} ${style.text} px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm`}>
                        {c}
                    </span>
                );
            })}
        </div>
    );
};