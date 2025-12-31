import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { CoverPageData } from '@/data/initialData';
import { Heart, Sparkles } from 'lucide-react';

interface SectionViewProps {
  data: SectionPageData;
  coverData?: CoverPageData;
}

// Utilitário para converter número em romano
const toRoman = (num: number): string => {
  const romanNumerals = [
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  
  let result = '';
  let remaining = num;
  
  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  
  return result;
};

// Componente otimizado para o emblema
const SectionBadge: React.FC<{ roseEnabled: boolean; roseBadge: string }> = ({ 
  roseEnabled, 
  roseBadge 
}) => {
  if (!roseEnabled || roseBadge === 'none') return null;

  return (
    <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200/80 rounded-full shadow-md flex items-center justify-center backdrop-blur-sm">
      {roseBadge === 'heart' ? (
        <Heart className="text-pink-500 drop-shadow-sm" size={14} />
      ) : (
        <Sparkles className="text-pink-500 drop-shadow-sm" size={14} />
      )}
    </div>
  );
};

// Componente para menção à capa
const CoverReference: React.FC<{ coverData?: CoverPageData }> = ({ 
  coverData 
}) => {
  if (!coverData) return null;

  return (
    <div className="absolute top-3 right-4 max-w-[75%] text-right">
      <span className="text-[9px] tracking-[0.3em] uppercase text-rose-700/80 font-light block leading-tight">
        {coverData.title}{coverData.subtitle ? ` ${coverData.subtitle}` : ''}
      </span>
      <span className="text-[8px] tracking-[0.2em] uppercase text-rose-600/60 font-light block">
        {coverData.edition}
      </span>
      <span className="text-[8px] tracking-[0.15em] text-rose-600/50 font-light block">
        {coverData.author}
      </span>
    </div>
  );
};

// Componente para o número do capítulo
const ChapterNumber: React.FC<{ category: string }> = ({ category }) => {
  // Mapear categorias para números
  const categoryMap: Record<string, number> = {
    "ACOMPANHAMENTOS, SALADAS & SOPAS": 1,
    "BOLOS, DOCES & SOBREMESAS": 2,
    "CAFÉ DA MANHÃ & LANCHES RÁPIDOS": 3,
    "SALGADOS E REFEIÇÕES": 4,
    "SHAKES E IOGURTES": 5,
  };

  const chapterNum = categoryMap[category] || 1;
  const romanNum = toRoman(chapterNum);

  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="inline-flex items-center gap-3 mb-3">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
        <span className="text-[13px] font-light text-accent/90 tracking-[0.15em] uppercase">
          CAPÍTULO {romanNum}
        </span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent via-accent/40 to-transparent"></div>
      </div>
      <div className="w-1 h-1 bg-accent/60 rounded-full"></div>
    </div>
  );
};

// Componente para o título principal
const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h1 className="font-playfair font-light text-navy mb-5 leading-tight break-normal whitespace-pre text-center select-none" 
        style={{ 
          fontSize: '36px', 
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          maxWidth: '85%'
        }}>
      {title}
    </h1>
  );
};

// Componente para o subtítulo
const SectionSubtitle: React.FC<{ subtitle: string }> = ({ subtitle }) => {
  return (
    <div className="relative mt-2">
      <p className="font-hand italic mb-4 leading-tight text-center select-none"
         style={{ 
           fontSize: '28px',
           color: 'var(--color-accent, #a67c52)',
           transform: 'rotate(-1deg)',
           maxWidth: '75%',
           margin: '0 auto 1rem auto'
         }}>
        {subtitle}
      </p>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent/20 rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-accent/40 rounded-full"></span>
          <span className="w-1.5 h-1.5 bg-accent/20 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

// Componente para o footer
const SectionFooter: React.FC = () => (
  <div className="mt-8 pt-4 border-t border-accent/15 w-full">
    <div className="flex items-center justify-center gap-3">
      <span className="text-[8px] text-navy/25 uppercase tracking-[0.25em] font-light">
        Receitas selecionadas
      </span>
      <div className="w-1 h-1 bg-accent/25 rounded-full"></div>
      <span className="text-[8px] text-navy/25 uppercase tracking-[0.25em] font-light">
        Para seu dia a dia
      </span>
    </div>
  </div>
);

// Componente para decorações de background
const BackgroundDecorations: React.FC = () => (
  <>
    <div className="absolute top-10 right-10 opacity-6">
      <div className="w-14 h-14 border border-accent/15 rounded-full flex items-center justify-center">
        <div className="w-5 h-5 bg-accent/8 rounded-full"></div>
      </div>
    </div>
    <div className="absolute bottom-10 left-10 opacity-6">
      <div className="w-12 h-12 border border-accent/12 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-accent/6 rounded-full"></div>
      </div>
    </div>
    <div className="absolute top-1/5 left-1/5 opacity-4">
      <div className="w-8 h-8 border border-accent/8 rounded-full"></div>
    </div>
    <div className="absolute bottom-1/5 right-1/5 opacity-4">
      <div className="w-6 h-6 border border-accent/6 rounded-full"></div>
    </div>
  </>
);

export const SectionView: React.FC<SectionViewProps> = ({ data, coverData }) => {
  const {
    title = "NOME DA SEÇÃO",
    subtitle = "Subtítulo Manuscrito",
    roseEnabled = true,
    roseBadge = 'heart',
  } = data as SectionPageData;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/70 h-full relative font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />

      <div className="relative z-10 border-4 border-double border-cream rounded-[2.5rem] w-[82%] max-w-[540px] h-[75%] m-6 shadow-xl overflow-hidden grid grid-rows-[auto_1fr_auto] justify-items-center box-border backdrop-blur-sm bg-white/80"
           style={{ padding: '48px' }}>
        
        <SectionBadge roseEnabled={roseEnabled} roseBadge={roseBadge} />
        <CoverReference coverData={coverData} />
        
        <div className="row-start-1 w-full">
          <ChapterNumber category={title} />
        </div>

        <div className="row-start-2 relative w-full flex flex-col justify-center">
          <SectionTitle title={title} />
          <SectionSubtitle subtitle={subtitle} />
        </div>

        <SectionFooter />
      </div>

      <BackgroundDecorations />
    </div>
  );
};