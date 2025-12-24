export enum TEMPLATES {
    COVER = 'cover',
    INTRO = 'intro',
    TOC = 'toc',
    LEGEND = 'legend',
    RECIPE = 'recipe',
    SECTION = 'section',
    SHOPPING = 'shopping'
}

export const TAG_DEFS = [
    { code: 'CM', label: 'Café da Manhã', color: 'bg-tag-cm', text: 'text-white' },
    { code: 'LM', label: 'Lanche da Manhã', color: 'bg-tag-lm', text: 'text-navy' },
    { code: 'A',  label: 'Almoço', color: 'bg-tag-a', text: 'text-white' },
    { code: 'LT', label: 'Lanche da Tarde', color: 'bg-tag-lt', text: 'text-white' },
    { code: 'J',  label: 'Jantar', color: 'bg-tag-j', text: 'text-white' },
    { code: 'S',  label: 'Sobremesa', color: 'bg-tag-s', text: 'text-white' },
    { code: 'AC', label: 'Acompanhamento', color: 'bg-tag-ac', text: 'text-white' },
    { code: 'B',  label: 'Base', color: 'bg-tag-b', text: 'text-white' }
];

export const TAG_MAP = TAG_DEFS.reduce((acc, tag) => ({ ...acc, [tag.code]: tag }), {});
export const DEFAULT_TAG = { label: 'Tag', color: 'bg-gray-200', text: 'text-navy' };

export const getTagStyle = (code: string) => {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    return TAG_MAP[cleanCode] || { ...DEFAULT_TAG, label: cleanCode };
};

export const FONT_SIZES = {
    title: { 1: 'text-[20px]', 2: 'text-[24px]', 3: 'text-[28px]', 4: 'text-[34px]', 5: 'text-[40px]' },
    ingredients: { 1: 'text-[9px] leading-tight', 2: 'text-[10px] leading-snug', 3: 'text-[11px] leading-snug', 4: 'text-[12px] leading-normal', 5: 'text-[13px] leading-relaxed' }, // Ajustado para melhor legibilidade
    prep: { 1: 'text-[11px] leading-snug', 2: 'text-[12px] leading-relaxed', 3: 'text-[13px] leading-relaxed', 4: 'text-[14px] leading-loose', 5: 'text-[15px] leading-loose' } // Ajustado para melhor legibilidade
};

export const IMG_SIZES = {
    side: { 1: 'w-20', 2: 'w-24', 3: 'w-32', 4: 'w-40', 5: 'w-48' }, 
    z:    { 1: 'w-1/4', 2: 'w-[29%]', 3: 'w-1/3', 4: 'w-[37%]', 5: 'w-[45%]' },
    center: { 1: 'w-12 h-12', 2: 'w-14 h-14', 3: 'w-16 h-16', 4: 'w-20 h-20', 5: 'w-24 h-24' }
};

export const SPACING_MAP = {
    compact: 'p-4',
    normal: 'p-8',
    airy: 'p-12'
};