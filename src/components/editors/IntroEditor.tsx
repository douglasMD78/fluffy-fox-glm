import React from 'react';
import { IntroPageData } from '@/data/initialData';
import { Sparkles } from '@/components/icons';
import { MarkdownTextarea } from '@/components/common/MarkdownTextarea';

interface IntroEditorProps {
  data: IntroPageData;
  onUpdate: (data: Partial<IntroPageData>) => void;
  onAiRequest: () => void;
}

export const IntroEditor: React.FC<IntroEditorProps> = ({ data, onUpdate, onAiRequest }) => {
  return (
    <div className="space-y-4">
      <input placeholder="Destaque" className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none" value={data.highlight} onChange={e => onUpdate({highlight: e.target.value})} />
      <button onClick={onAiRequest} className="w-full py-2 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"><Sparkles size={12}/> ✨ Escrever Intro com IA</button>
      <MarkdownTextarea 
        placeholder="Texto" 
        rows={15} 
        value={data.text} 
        onChange={value => onUpdate({text: value})} 
      />
    </div>
  );
};