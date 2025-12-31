import React from 'react';
import { CoverPageData } from '@/data/initialData';

interface CoverEditorProps {
    activePage: CoverPageData;
    updatePage: (newData: Partial<CoverPageData>) => void;
}

export const CoverEditor: React.FC<CoverEditorProps> = ({ activePage, updatePage }) => {
    return (
        <div className="space-y-4">
            <input placeholder="Subtítulo" className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none" value={activePage.subtitle} onChange={e => updatePage({subtitle: e.target.value})} />
            <input placeholder="Edição" className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none" value={activePage.edition} onChange={e => updatePage({edition: e.target.value})} />
            <input placeholder="Autor" className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none" value={activePage.author} onChange={e => updatePage({author: e.target.value})} />
        </div>
    );
};