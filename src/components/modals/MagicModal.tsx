"use client";

import React from 'react';
import { Sparkles, RefreshCw, MagicStick } from '@/components/icons';

interface MagicModalProps {
    magicModal: { isOpen: boolean; type: string; title: string; description: string; placeholder: string; prompt: string; };
    setMagicModal: (modalState: { isOpen: boolean; type: string; title: string; description: string; placeholder: string; prompt: string; }) => void;
    isMagicGenerating: boolean;
    handleMagicSubmit: () => Promise<void>;
}

export const MagicModal: React.FC<MagicModalProps> = ({
    magicModal,
    setMagicModal,
    isMagicGenerating,
    handleMagicSubmit,
}) => {
    if (!magicModal.isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm flex items-center justify-center p-4 modal-overlay">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-lg shadow-glass border border-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-pastel to-orange-300"></div>
                <h3 className="text-2xl font-serif italic mb-2 flex items-center gap-2 text-navy"><Sparkles className="text-accent animate-pulse"/> {magicModal.title}</h3>
                <p className="text-sm text-navy/60 mb-6">{magicModal.description}</p>
                <textarea 
                    className="w-full h-32 bg-surface border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-accent/20 outline-none text-navy" 
                    placeholder={magicModal.placeholder} 
                    value={magicModal.prompt} 
                    onChange={e => setMagicModal({...magicModal, prompt: e.target.value})} 
                    disabled={isMagicGenerating}
                />
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setMagicModal({...magicModal, isOpen: false})} className="px-5 py-3 text-xs font-bold uppercase hover:bg-surface rounded-xl text-navy/60 transition-colors">Cancelar</button>
                    <button 
                        onClick={handleMagicSubmit} 
                        disabled={isMagicGenerating || !magicModal.prompt.trim()} 
                        className="px-6 py-3 rounded-xl text-xs font-black uppercase flex items-center gap-2 bg-gradient-to-r from-accent to-rose-500 text-white shadow-lg shadow-accent/30 hover:scale-105 transition-transform"
                    >
                        {isMagicGenerating ? <><RefreshCw className="animate-spin" size={14}/> Criando...</> : <><MagicStick size={14}/> ✨ Criar</>}
                    </button>
                </div>
            </div>
        </div>
    );
};