"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TocPageData } from '@/data/initialData';

interface TocEditorProps {
  data: TocPageData;
  onUpdate: (data: Partial<TocPageData>) => void;
}

export const TocEditor: React.FC<TocEditorProps> = ({ data, onUpdate }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleNumberingStyleChange = (value: string) => {
    onUpdate({ numberingStyle: value as 'absolute' | 'editorial' });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="toc-title" className="text-sm font-medium text-navy/70">
          Título do Sumário
        </Label>
        <Input
          id="toc-title"
          value={data.title || ''}
          onChange={handleTitleChange}
          placeholder="SUMÁRIO"
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-navy/70 mb-3 block">
          Estilo de Numeração
        </Label>
        <RadioGroup
          value={data.numberingStyle || 'absolute'}
          onValueChange={handleNumberingStyleChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="absolute" id="absolute" />
            <Label htmlFor="absolute" className="text-sm">
              Absoluta (1, 2, 3...) - Inclui capa e introdução
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="editorial" id="editorial" />
            <Label htmlFor="editorial" className="text-sm">
              Editorial (1, 2, 3...) - Apenas páginas de conteúdo
            </Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-navy/50 mt-2">
          A numeração editorial é mais comum em livros, onde as páginas iniciais (capa, introdução) não são contadas.
        </p>
      </div>
    </div>
  );
};

export default TocEditor;