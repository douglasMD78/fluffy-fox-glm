import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { CoverPageData } from '@/data/initialData';
import { Heart, Sparkles } from 'lucide-react';

interface SectionViewProps {
  data: SectionPageData;
  coverData?: CoverPageData;
  pageNumber?: number;
}

const getRomanNumber = (index: number): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return romanNumerals[index - 1] || 'I';
};

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

const CoverReference: React.FC<{ coverData?: CoverPageData; roseMentionEnabled: boolean; center?: boolean }> = ({ 
  coverData, 
  roseMentionEnabled,
  center = false,
}) => {
  if (!roseMentionEnabled || !coverData) return null;

  return (
    <div className={`absolute top-3 ${center ? 'left-1/2 -translate-x-1/2' : 'right-4'} max-w-[70%]`}>
      <span className="text-[9px] tracking-[0.25em] uppercase text-rose-700/70 truncate">
        {coverData.title}{coverData.subtitle ? ` ${coverData.subtitle}` : ''} • {coverData.edition} • {coverData.author}
      </span>
    </div>
  );
};

const SectionHeader: React.FC<{ chapterNumber: string; center?: boolean }> = ({ chapterNumber, center = true }) => (
  <div className={`mb-4 row-start-1 ${center ? 'text-center' : ''}`}>
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

const SectionTitle: React.FC<{ title: string; sizePx: number; trackingEm: number; maxWidthPct: number }> = ({ title, sizePx, trackingEm, maxWidthPct }) => (
  <h1
    className="font-playfair font-light text-navy mb-4 leading-tight uppercase text-center text-balance break-words mx-auto select-none"
    style={{ fontSize: `${sizePx}px`, letterSpacing: `${trackingEm}em`, maxWidth: `${maxWidthPct}%`, hyphens: 'auto' as any }}
  >
    {title}
  </h1>
);

const SectionSubtitle: React.FC<{ subtitle: string; sizePx: number }> = ({ subtitle, sizePx }) => (
  <div className="relative select-none text-center">
    <p
      className="font-hand italic mb-6 leading-tight text-accent mx-auto max-w-[80%]"
      style={{ fontSize: `${sizePx}px`, transform: 'rotate(-2deg)' }}
    >
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

export const SectionView: React.FC<SectionViewProps> = ({ data, coverData, pageNumber }) => {
  const {
    title = "NOME DA SEÇÃO",
    subtitle = "Subtítulo Manuscrito",
    roseEnabled = true,
    roseGlowIntensity = 30,
    roseBadge = 'heart',
    roseMentionEnabled = true,
  } = data as SectionPageData;

  // Ajustes automáticos para palavras longas: centralização e equilíbrio visual
  const longestWordLen = Math.max(...title.split(/\s+/).map(w => w.length));
  const isVeryLong = longestWordLen >= 14;
  const isLong = longestWordLen >= 11;

  const baseTitleSize = 34;
  const titleSize = isVeryLong ? 30 : isLong ? 32 : baseTitleSize;
  const trackingEm = isVeryLong ? 0.05 : isLong ? 0.08 : 0.12;
  const titleMaxWidthPct = isVeryLong ? 90 : isLong ? 88 : 84;

  const subtitleSize = isVeryLong ? 28 : 30;

  // Menção à capa centralizada quando título for longo para evitar peso à direita
  const centerMention = isLong;

  const frameStyle: React.CSSProperties = { left: '0px', top: '0px', padding: '44px' };

  // Número do capítulo baseado em categorias conhecidas
  const categories = [
    "ACOMPANHAMENTOS, SALADAS & SOPAS",
    "BOLOS, DOCES & SOBREMESAS", 
    "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
    "SALGADOS E REFEIÇÕES",
    "SHAKES E IOGURTES"
  ];
  const chapterNumber = getRomanNumber(Math.max(1, categories.indexOf(title) + 1));

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/60 h-full relative font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div
        className="relative z-10 border-4 border-double border-cream rounded-[2rem] w-[80%] max-w-[520px] h-[78%] m-4 mx-auto shadow-lg overflow-hidden grid grid-rows-[auto_1fr_auto] justify-items-center box-border"
        style={frameStyle}
      >
        <SectionBadge 
          roseEnabled={roseEnabled} 
          roseBadge={roseBadge} 
          roseGlowIntensity={roseGlowIntensity} 
        />

        <CoverReference 
          coverData={coverData} 
          roseMentionEnabled={roseMentionEnabled} 
          center={centerMention}
        />

        <SectionHeader chapterNumber={chapterNumber} center />

        <div className="row-start-2 relative w-full">
          <SectionTitle title={title} sizePx={titleSize} trackingEm={trackingEm} maxWidthPct={titleMaxWidthPct} />
          <SectionSubtitle subtitle={subtitle} sizePx={subtitleSize} />
        </div>

        <SectionFooter />
      </div>

      <BackgroundDecorations />
    </div>
  );
};