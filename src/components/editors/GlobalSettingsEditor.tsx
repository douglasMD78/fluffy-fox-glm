import React from 'react';
import { Palette } from '@/components/icons';

interface GlobalSettingsEditorProps {
    theme: { bg: string; text: string; accent: string; };
    updateTheme: (newTheme: { bg: string; text: string; accent: string; }) => void;
    onClose: () => void;
}

export const GlobalSettingsEditor: React.FC<GlobalSettingsEditorProps> = ({ theme, updateTheme, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-[2rem] w-full max-w-sm shadow-2xl border border-white">
                <h3 className="text-xl font-serif font-bold text-navy mb-4 flex items-center gap-2"><Palette className="text-accent"/> Tema Global</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Cor de Fundo (Papel)</label>
                        <div className="flex gap-2">
                            <input type="color" value={theme.bg} onChange={e => updateTheme({...theme, bg: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                            <input type="text" value={theme.bg} onChange={e => updateTheme({...theme, bg: e.target.value})} className="flex-1 bg-surface border border-gray-200 rounded-lg px-2 text-xs font-mono text-navy uppercase" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Cor do Texto (Principal)</label>
                        <div className="flex gap-2">
                            <input type="color" value={theme.text} onChange={e => updateTheme({...theme, text: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                            <input type="text" value={theme.text} onChange={e => updateTheme({...theme, text: e.target.value})} className="flex-1 bg-surface border border-gray-200 rounded-lg px-2 text-xs font-mono text-navy uppercase" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Cor de Destaque (Accent)</label>
                        <div className="flex gap-2">
                            <input type="color" value={theme.accent} onChange={e => updateTheme({...theme, accent: e.target.value})} className="h-8 w-8 rounded cursor-pointer border-0 p-0" />
                            <input type="text" value={theme.accent} onChange={e => updateTheme({...theme, accent: e.target.value})} className="flex-1 bg-surface border border-gray-200 rounded-lg px-2 text-xs font-mono text-navy uppercase" />
                        </div>
                    </div>
                </div>

                 <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-navy text-white rounded-xl text-xs font-bold uppercase shadow-lg">Concluir</button>
                </div>
            </div>
        </div>
    )
}