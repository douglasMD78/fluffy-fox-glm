import { TEMPLATES } from '@/lib/constants';

interface Theme {
    bg: string;
    text: string;
    accent: string;
    surface?: string; 
}

export const getPageBackgroundColor = (pageType: TEMPLATES, theme: Theme): string => {
    if (pageType === TEMPLATES.COVER) return theme.bg;
    if (pageType === TEMPLATES.LEGEND) return 'white';
    if (pageType === TEMPLATES.TOC) return 'white';
    if (pageType === TEMPLATES.SHOPPING) return 'white';
    return 'white';
};