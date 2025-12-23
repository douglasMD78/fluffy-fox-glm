import React from 'react';
import { SectionPageData } from '@/data/initialData';

interface SectionEditorProps {
    activePage: SectionPageData;
    updatePage: (newData: Partial<SectionPageData>) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ activePage, updatePage }) => {
    return (
        <div className="space-y-4">
            <input placeholder="Subtítulo" className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none" value={activePage.subtitle} onChange={e => updatePage({subtitle: e.target.value})} />
        </div>
    );
};