import React from 'react';
import { SectionPageData } from '@/data/initialData';
import { CoverPageData } from '@/data/initialData';
import { Heart, Sparkles } from 'lucide-react';

interface SectionViewProps {
  data: SectionPageData;
  coverData?: CoverPageData;
}

// Componentes reutilizáveis para melhor manutenção
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

const SectionHeader: React.FC = () => (
  <div className="mb-4 row-start-1">
    <span className="inline-block text-[10px] font-light text-accent/40 uppercase tracking-[0.3em] mb-3">
      Capítulo de Receitas
    </span>
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <div className="w-2 h-2 bg-accent rounded-full shadow-sm"></div>
      <div className="h-px w-12 bg-gradient-to-l from-transparent via-accent/30 to-transparent"></div>
    </div>
  </div>
);

const SectionTitle: React.FC<{
  title: string;
  titleAlign: string;
  titleOffsetX: number;
  titleOffsetY: number;
  titleFontSize: number;
  titleTracking: number;
  titleUppercase: boolean;
  titleMaxWidthPct: number;
}> = ({ 
  title, 
  titleAlign, 
  titleOffsetX, 
  titleOffsetY, 
  titleFontSize, 
  titleTracking, 
  titleUppercase, 
  titleMaxWidthPct 
}) => {
  const textAlignStyle = (align: string): React.CSSProperties => {
    if (align === 'left') return { textAlign: 'left' };
    if (align === 'right') return { textAlign: 'right' };
    return { textAlign: 'center' };
  };

  return (
    <h1
      className="font-playfair font-light text-navy mb-4 leading-tight break-normal whitespace-pre mx-auto select-none"
      style={{
        ...textAlignStyle(titleAlign),
        fontSize: `${titleFontSize}px`,
        letterSpacing: `${titleTracking}em`,
        textTransform: titleUppercase ? 'uppercase' : 'none',
        maxWidth: `${titleMaxWidthPct}%`,
        transform: `translate(${titleOffsetX}px, ${titleOffsetY}px)`,
      }}
    >
      {title}
    </h1>
  );
};

const SectionSubtitle: React.FC<{
  subtitle: string;
  subtitleAlign: string;
  subtitleOffsetX: number;
  subtitleOffsetY: number;
  subtitleFontSize: number;
  subtitleRotate: number;
  subtitleItalic: boolean;
}> = ({ 
  subtitle, 
  subtitleAlign, 
  subtitleOffsetX, 
  subtitleOffsetY, 
  subtitleFontSize, 
  subtitleRotate, 
  subtitleItalic 
}) => {
  const textAlignStyle = (align: string): React.CSSProperties => {
    if (align === 'left') return { textAlign: 'left' };
    if (align === 'right') return { textAlign: 'right' };
    return { textAlign: 'center' };
  };

  return (
    <div
      className="relative select-none"
      style={{
        transform: `translate(${subtitleOffsetX}px, ${subtitleOffsetY}px)`,
        ...textAlignStyle(subtitleAlign),
      }}
    >
      <p
        className={`font-hand ${subtitleItalic ? 'italic' : ''} mb-6 mx-auto leading-tight`}
        style={{
          fontSize: `${subtitleFontSize}px`,
          color: 'var(--color-accent, #a67c52)',
          transform: `rotate(${subtitleRotate}deg)`,
          maxWidth: '80%',
        }}
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
};

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

export const SectionView: React.FC<SectionViewProps> = ({ data, coverData }) => {
  const {
    title = "NOME DA SEÇÃO",
    subtitle = "Subtítulo Manuscrito",
    titleAlign = 'center',
    subtitleAlign = 'center',
    titleOffsetX = 0,
    titleOffsetY = 0,
    subtitleOffsetX = 0,
    subtitleOffsetY = 6,
    titleFontSize = 34,
    subtitleFontSize = 30,
    subtitleRotate = -2,
    titleTracking = 0.12,
    titleUppercase = true,
    titleMaxWidthPct = 84,
    frameOffsetX = -6,
    frameOffsetY = 0,
    contentPadding = 44,
    subtitleItalic = true,
    roseEnabled = true,
    roseGlowIntensity = 30,
    roseBadge = 'heart',
    roseMentionEnabled = true,
  } = data as SectionPageData;

  const frameStyle = {
    left: `${frameOffsetX}px`, 
    top: `${frameOffsetY}px`, 
    padding: `${contentPadding}px`
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/60 h-full relative font-sans">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div
        className="relative z-10 border-4 border-double border-cream rounded-[2rem] w-[80%] max-w-[520px] h-[78%] m-4 shadow-lg overflow-hidden grid grid-rows-[auto_1fr_auto] justify-items-center box-border"
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
        />

        <SectionHeader />

        <div className="row-start-2 relative w-full">
          <SectionTitle
            title={title}
            titleAlign={titleAlign}
            titleOffsetX={titleOffsetX}
            titleOffsetY={titleOffsetY}
            titleFontSize={titleFontSize}
            titleTracking={titleTracking}
            titleUppercase={titleUppercase}
            titleMaxWidthPct={titleMaxWidthPct}
          />

          <SectionSubtitle
            subtitle={subtitle}
            subtitleAlign={subtitleAlign}
            subtitleOffsetX={subtitleOffsetX}
            subtitleOffsetY={subtitleOffsetY}
            subtitleFontSize={subtitleFontSize}
            subtitleRotate={subtitleRotate}
            subtitleItalic={subtitleItalic}
          />
        </div>

        <SectionFooter />
      </div>

      <BackgroundDecorations />
    </div>
  );
};