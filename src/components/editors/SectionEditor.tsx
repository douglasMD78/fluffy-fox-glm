import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface SectionEditorProps {
  activePage: SectionPageData;
  updatePage: (newData: Partial<SectionPageData>) => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ activePage, updatePage }) => {
  const set = (key: keyof SectionPageData) => (value: any) => updatePage({ [key]: value });

  return (
    <div className="space-y-4">
      {/* Novo campo para Título com quebra manual */}
      <Textarea
        placeholder="Título da seção (use Enter para quebrar linhas manualmente)"
        className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none"
        value={activePage.title || ''}
        onChange={e => updatePage({ title: e.target.value })}
      />

      {/* Subtítulo com quebra manual */}
      <Textarea
        placeholder="Subtítulo (use Enter para quebrar linhas manualmente)"
        className="w-full bg-white border border-gray-200 p-4 rounded-xl text-sm text-navy focus:border-accent outline-none"
        value={activePage.subtitle || ''}
        onChange={e => updatePage({ subtitle: e.target.value })}
      />
    </div>
  );
};