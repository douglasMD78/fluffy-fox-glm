"use client";

import React from 'react';
import { FileUp, RefreshCw, Brain } from '@/components/icons';

interface ImporterModalProps {
    showImporter: boolean;
    setShowImporter: (show: boolean) => void;
    importText: string;
    setImportText: (text: string) => void;
    isImporting: boolean;
    organizeRecipeWithAI: () => Promise<void>;
}

export const ImporterModal: React.FC<ImporterModalProps> = ({
    showImporter,
    setShowImporter,
    importText,
    setImportText,
    isImporting,
    organizeRecipeWithAI,
}) => {
    if (!showImporter) return null;

    return (
        <div className="fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
            <div className="bg-white p-6 rounded-[2rem] w-full max-w-lg shadow-2xl border border-white">
                <h3 className="text-xl font-serif font-bold text-navy mb-2 flex items-center gap-2"><FileUp className="text-accent"/> Importação Inteligente</h3>
                <p className="text-sm text-navy/60 mb-4">Cole o texto de uma receita desorganizada aqui e a IA irá estruturá-la automaticamente para você.</p>
                <textarea 
                    className="w-full h-64 bg-surface border border-gray-100 rounded-xl p-4 text-xs font-mono mb-4 focus:ring-1 focus:ring-accent focus:outline-none text-navy" 
                    value={importText} 
                    onChange={e => setImportText(e.target.value)} 
                    placeholder="Cole o texto bagunçado da receita aqui..."
                    disabled={isImporting}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowImporter(false)} className="px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 rounded-xl text-navy/60">Cancelar</button>
                    <button 
                        onClick={organizeRecipeWithAI} 
                        disabled={isImporting || !importText.trim()} 
                        className="px-4 py-2 bg-gradient-to-r from-accent to-rose-500 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-accent/30"
                    >
                        {isImporting ? <RefreshCw className="animate-spin" size={12}/> : <Brain size={12}/>} {isImporting ? "Organizando..." : "Organizar com IA"}
                    </button>
                </div>
            </div>
        </div>
    );
};