import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { CoverPageData } from '@/data/initialData';
import { Heart, Sparkles } from 'lucide-react';

interface SectionViewProps {
  data: SectionPageData;
  coverData?: CoverPageData;
}

// Função para gerar número romano automaticamente
const getRomanNumber = (index: number): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romanNumerals[index] || 'I';
};

// Componente do emblema rosé
const SectionBadge: React.FC<{ roseEnabled: boolean; roseBadge: string; roseGlowIntensity: number }> = ({ 
  roseEnabled, 
  roseBadge, 
  roseGlowIntensity 
}) => {
  if (!roseEnabled || roseBadge === 'none') return null;

  const glowStyle = roseEnabled && roseGlowIntensity > 0 ? {
    boxShadow: `0 0 ${roseGlowIntensity / 5}px rgba(236, 72, 153, 0.3)`,
  } : {};

  return (
    <div 
      className="absolute top-2 left-2 w-7 h-7 bg-pink-100/70 border border-pink-300/60 rounded-full shadow-sm flex items-center justify-center"
      style={glowStyle}
    >
      {roseBadge === 'heart' ? (
        <Heart className="text-pink-500" size={12} />
      ) : (
        <Sparkles className="text-pink-500" size={12} />
      )}
    </div>
  );
};

// Componente da menção à capa
const CoverReference: React.FC<{ coverData?: CoverPageData; roseMentionEnabled: boolean }> = ({ 
  coverData, 
  roseMentionEnabled 
}) => {
  if (!roseMentionEnabled || !coverData) return null;

  return (
    <div className="absolute top-3 right-4 max-w-[70%]">
      <span className="text-[9px] tracking-[0.25em] uppercase text-rose-700/70 truncate">
        {coverData.title}{coverData.subtitle ? ` ${coverData.subtitle}` : ''} • {coverData.edition} • {coverData.author}
      </span>
    </div>
  );
};

// Componente do cabeçalho com número do capítulo
const SectionHeader: React.FC<{ chapterNumber: string }> = ({ chapterNumber }) => (
  <div className="mb-4 row-start-1">
    <span className="inline-block text-[10px] font-light text-accent/40 uppercase tracking-[0.3em] mb-3">
      Capítulo {chapterNumber}
    </span>
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
      <div className="h-px w-12 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
    </div>
  </div>
);

// Componente do título principal
const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="font-playfair font-light text-navy mb-4 leading-tight text-[34px] tracking-[0.12em] uppercase text-center max-w-[84%] mx-auto select-none">
    {title}
  </h1>
);

// Componente do subtítulo
const SectionSubtitle: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <div className="relative select-none text-center">
    <p className="font-hand italic mb-6 leading-tight text-[30px] text-accent mx-auto max-w-[80%] rotate-[-2deg]">
      {subtitle}
    </p>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
      <div className="flex items-center gap-1">
        <span className="w-1 h-1 bg-accent/20 rounded-full"></span>
        <span className="w-1 h-1 bg-accent/40 rounded-full"></span>
        <span className="w-1 h-1 bg-accent/20 rounded-full"></span>
      </div>
    </div>
  </div>
);

// Componente do rodapé
const SectionFooter: React.FC = () => (
  <div className="row-start-3 mt-6 pt-4 border-t border-accent/10 w-full">
    <div className="flex items-center justify-center gap-2">
      <span className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-light">
        Receitas selecionadas
      </span>
      <div className="w-1 h-1 bg-accent/30 rounded-full"></div>
      <span className="text-[8px] text-navy/30 uppercase tracking-[0.2em] font-light">
        Para seu dia a dia
      </span>
    </div>
  </div>
);

// Componente das decorações de fundo
const BackgroundDecorations: React.FC = () => (
  <>
    <div className="absolute top-8 right-8 opacity-8">
      <div className="w-12 h-12 border-2 border-accent/20 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-accent/10 rounded-full"></div>
      </div>
    </div>
    <div className="absolute bottom-8 left-8 opacity-8">
      <div className="w-10 h-10 border-2 border-accent/15 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 bg-accent/8 rounded-full"></div>
      </div>
    </div>
    <div className="absolute top-1/4 left-1/4 opacity-3">
      <div className="w-6 h-6 border border-accent/10 rounded-full"></div>
    </div>
    <div className="absolute bottom-1/4 right-1/4 opacity-3">
      <div className="w-4 h-4 border border-accent/8 rounded-full"></div>
    </div>
  </>
);

export const SectionView: React.FC<SectionViewProps> = ({ data, coverData }) => {
  const {
    title = "NOME DA SEÇÃO",
    subtitle = "Subtítulo Manuscrito",
    roseEnabled = true,
    roseGlowIntensity = 30,
    roseBadge = 'heart',
    roseMentionEnabled = true,
  } = data as SectionPageData;

  // Gerar número do capítulo automaticamente baseado no título
  const chapterNumber = React.useMemo(() => {
    const categories = [
      "ACOMPANHAMENTOS, SALADAS & SOPAS",
      "BOLOS, DOCES & SOBREMESAS", 
      "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
      "SALGADOS E REFEIÇÕES",
      "SHAKES E IOGURTES"
    ];
    const index = categories.indexOf(title);
    return getRomanNumber(index + 1);
  }, [title]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/60 h-full relative font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div
        className="relative z-10 border-4 border-double border-cream rounded-[2rem] w-[80%] max-w-[520px] h-[78%] m-4 shadow-lg overflow-hidden grid grid-rows-[auto_1fr_auto] justify-items-center box-border"
        style={{ 
          left: '-6px', 
          top: '0px', 
          padding: '44px'
        }}
      >
        <SectionBadge 
          roseEnabled={roseEnabled} 
          roseBadge={roseBadge} 
          roseGlowIntensity={roseGlowIntensity} 
        />

        <CoverReference 
          coverData={coverData} 
          roseMentionEnabled={roseMentionEnabled} 
        />

        <SectionHeader chapterNumber={chapterNumber} />

        <div className="row-start-2 relative w-full">
          <SectionTitle title={title} />
          <SectionSubtitle subtitle={subtitle} />
        </div>

        <SectionFooter />
      </div>

      <BackgroundDecorations />
    </div>
  );
};