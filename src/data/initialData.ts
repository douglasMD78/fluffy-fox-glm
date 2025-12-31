// ... existing code ...
export type CoverPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.COVER] & {
  // Controles de alinhamento
  titleAlign?: "left" | "center" | "right";
  subtitleAlign?: "left" | "center" | "right";
  
  // Controles de posicionamento
  titleOffsetX?: number;
  titleOffsetY?: number;
  subtitleOffsetX?: number;
  subtitleOffsetY?: number;
  
  // Controles de tipografia
  titleFontSize?: number;
  subtitleFontSize?: number;
  titleTracking?: number;
  titleUppercase?: boolean;
  subtitleItalic?: boolean;
  titleMaxWidthPct?: number;
  subtitleRotate?: number;
  
  // Controles do quadro
  frameOffsetX?: number;
  frameOffsetY?: number;
  contentPadding?: number;
  
  // Tema rosé
  roseEnabled?: boolean;
  roseGlowIntensity?: number;
  roseBadge?: "heart" | "sparkles" | "none";
};
// ... existing code ...