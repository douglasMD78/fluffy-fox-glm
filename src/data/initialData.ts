import { TEMPLATES } from "@/lib/constants";
import { ColumnRatioKey } from "@/lib/constants";
import { z } from "zod";
import originalJson from "./todas-as-receitas-original.json";

// Esquema Zod para validar a saída da IA para receitas
export const recipeSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório."),
    category: z.string().optional(),
    code: z.string().optional(),
    yield: z.string().optional(),
    nutrition: z
      .object({
        cal: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Calorias deve ser um número.")
          .optional(),
        prot: z
          .string()
          .regex(/^\d+(\.\d+)?g?$/, "Proteínas deve ser um número.")
          .optional(),
        carb: z
          .string()
          .regex(/^\d+(\.\d+)?g?$/, "Carboidratos deve ser um número.")
          .optional(),
        fat: z
          .string()
          .regex(/^\d+(\.\d+)?g?$/, "Gorduras deve ser um número.")
          .optional(),
      })
      .optional(),
    macroNote: z.string().optional(),
    ingredientGroups: z
      .array(
        z.object({
          title: z.string().optional(),
          items: z.string().min(1, "Lista de ingredientes não pode ser vazia."),
        })
      )
      .min(1, "Pelo menos um grupo de ingredientes é obrigatório."),
    prepSteps: z.string().min(1, "Modo de preparo é obrigatório."),
    tips: z.string().optional(),
    storage: z.string().optional(),
    image: z.string().optional(),
    videoLink: z.string().optional(),
    layout: z.string().optional(),
    fontSizes: z
      .object({
        title: z.number().optional(),
        ingredients: z.number().optional(),
        prep: z.number().optional(),
      })
      .optional(),
    imageSize: z.number().optional(),
    spacing: z.string().optional(),
    videoDisplayStyle: z.string().optional(),
    objectFit: z.string().optional(),
    objectPosition: z.string().optional(),
    imageZoom: z.number().optional(),
    columnRatio: z.string().optional(),
    tipPlacement: z.string().optional(),
    storagePlacement: z.string().optional(),
    nutritionDisplayStyle: z.string().optional(),
    titleAlignment: z.string().nullable().optional(),
  })
  .partial();

// Esquema Zod para intro e lista de compras
export const introSchema = z.object({
  text: z.string().min(1, "O texto da introdução é obrigatório."),
}).partial();

export const shoppingSchema = z.object({
  hortifruti: z.string().optional(),
  acougue: z.string().optional(),
  laticinios: z.string().optional(),
  padaria: z.string().optional(),
  mercearia: z.string().optional(),
}).partial();

// Dados base
export const INITIAL_DATA = {
  [TEMPLATES.COVER]: {
    title: "Receitinhas",
    subtitle: "FIT",
    author: "@LU.MTSFIT",
    edition: "EDIÇÃO ESPECIAL",
  },
  [TEMPLATES.INTRO]: {
    title: "Um Olá Especial",
    highlight: "para Você!",
    text: "Escreva aqui sua mensagem de boas-vindas...",
  },
  [TEMPLATES.TOC]: { title: "SUMÁRIO", tocPageNumber: 1 },
  [TEMPLATES.LEGEND]: {
    title: "Legendas",
    text:
      "Estas legendas foram criadas para facilitar a sua organização. Identifique rapidamente em qual refeição cada receita se encaixa melhor no seu dia a dia.",
  },
  [TEMPLATES.SECTION]: { title: "NOME DA SEÇÃO", subtitle: "Subtítulo Manuscrito" },
  [TEMPLATES.SHOPPING]: {
    title: "Listinha de Compras",
    hortifruti: "",
    acougue: "",
    laticinios: "",
    padaria: "",
    mercearia: "",
  },
  [TEMPLATES.RECIPE]: {
    title: "TÍTULO DA RECEITA",
    category: "CATEGORIA",
    code: "CM, LT",
    yield: "1 porção",
    nutrition: { cal: "000", prot: "0g", carb: "0g", fat: "0g" },
    macroNote: "Valores referentes a 1 porção.",
    ingredientGroups: [{ title: "Ingredientes", items: "" }],
    prepSteps: "",
    tips: "",
    storage: "",
    image: "",
    videoLink: "",
    layout: "2",
    fontSizes: { title: 3, ingredients: 2, prep: 2 },
    imageSize: 3,
    spacing: "normal",
    videoDisplayStyle: "button",
    objectFit: "cover",
    objectPosition: "center",
    imageZoom: 100,
    columnRatio: "default" as ColumnRatioKey,
    tipPlacement: "footer",
    storagePlacement: "footer",
    nutritionDisplayStyle: "default",
    titleAlignment: null,
  },
};

// Ordem e categorias fornecidas pelo usuário (seções + títulos)
const USER_CATEGORIZED_RECIPES = [
  "ACOMPANHAMENTOS E SALADAS",
  "BATATA PERFEITA",
  "CALDINHO DE ABÓBORA COM FRANGO",
  "CALDINHO DE FRALDINHA",
  "CALDINHO DE LEGUMES",
  "CEBOLA ROXA EM CONSERVA",
  "REQUEIJÃO CREMOSO",
  "SALADA COM MOLHO DE ERVAS",
  "SALADA COM MOLHO DE MOSTARDA E MEL",
  "SALADA DE CHUCHU",
  "SALADA DE GRÃO DE BICO",
  "SALADA REFOGADA PRÁTICA",
  "BOLOS, DOCES & SOBREMESAS",
  "ABACAXI CARAMELIZADO",
  "BOLINHO DE BANANA",
  "BOLINHO DE CENOURA",
  "BOLINHO DE CHOCOLATE",
  "BOLINHO DE CHOCOLATE II",
  "BOLINHO DE COCO",
  "BOLINHO DE MICROONDAS",
  "BOLINHO DE MILHO",
  "BOLO NO POTE",
  "BRIGADEIRO",
  "BRIGADEIRO DE CAFÉ",
  "DANONINHO FIT",
  "DOCINHO DE UVA",
  "FLAN DE CHOCOLATE",
  "MOUSSE DE CAFÉ",
  "MOUSSE DE CHOCOLATE",
  "MOUSSE DE MARACUJÁ",
  "MUFFIN DE CHOCOLATE",
  "PIPOCA DOCE",
  "PRESTÍGIO FIT (SEM WHEY)",
  "PUDIM",
  "PUDIM DE CHIA COM GELATINA E FRUTAS",
  "PÃO DE MEL",
  "SORVETE DE MANGA FIT (2 INGREDIENTES)",
  "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
  "CREPIOCA",
  "CREPIOCA DOCE COM BANANA",
  "OVERNIGHT OATS",
  "PANQUECA FIT",
  "PÃO COM CARNE MOÍDA",
  "SANDUÍCHE NATURAL",
  "TOAST DE ATUM CREMOSO",
  "WAFFLE DOCE",
  "WAFFLE SALGADO",
  "SALGADOS E REFEIÇÕES",
  "ARROZ COM FRALDINHA DESFIADA",
  "COXINHA FIT",
  "CROQUETE DE FRANGO",
  "FRANGO COM CREME DE BATATA",
  "FRANGO CREMOSO COM BRÓCOLIS",
  "FRANGO EMPANADO",
  "HAMBÚRGUER FIT",
  "MACARRÃO CREMOSO COM BRÓCOLIS",
  "MINI PIZZA FIT",
  "PASTELZINHO FIT",
  "TIRAS DE CARNE COM CREME DE BATATA",
  "TORTINHA DE FRANGO FIT",
  "TORTINHA DE FRANGO FIT II",
  "SHAKES E IOGURTES",
  "IOGURTE COM GELEIA DE MORANGO",
  "MILK SHAKE DE CAFÉ",
  "MILKSHAKE PROTEICO",
  "SHAKE LAXATIVO (REGULADOR INTESTINAL)",
];

// Utilitários
type AnyPage = (typeof originalJson)["pages"][number];
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const PDF_LUIZA_DATA = (() => {
  const originalData: AnyPage[] = clone(originalJson.pages);

  // Mapear receitas por título (upper)
  const recipeMap = new Map<string, AnyPage>();
  originalData
    .filter((p) => p.type === TEMPLATES.RECIPE)
    .forEach((p) => recipeMap.set(p.title.toUpperCase(), p));

  // Correções de conteúdo e metadados
  // 1) Troca de conteúdo: SHAKE LAXATIVO ↔ IOGURTE COM GELEIA DE MORANGO
  const shakeTitle = "SHAKE LAXATIVO (REGULADOR INTESTINAL)";
  const iogurteTitle = "IOGURTE COM GELEIA DE MORANGO";
  const shakePage = recipeMap.get(shakeTitle.toUpperCase());
  const iogurtePage = recipeMap.get(iogurteTitle.toUpperCase());
  if (shakePage && iogurtePage) {
    const shakeContent = {
      ingredientGroups: iogurtePage.ingredientGroups,
      prepSteps: iogurtePage.prepSteps,
      tips: iogurtePage.tips,
      storage: iogurtePage.storage,
      code: iogurtePage.code,
      yield: "1 copo",
      category: "SHAKES E IOGURTES",
      layout: shakePage.layout ?? "2",
      fontSizes: shakePage.fontSizes ?? { title: 3, ingredients: 2, prep: 2 },
    };
    const iogurteContent = {
      ingredientGroups: shakePage.ingredientGroups,
      prepSteps: shakePage.prepSteps,
      tips: shakePage.tips,
      storage: shakePage.storage,
      code: shakePage.code,
      yield: "8 potinhos",
      category: "SHAKES E IOGURTES",
      layout: iogurtePage.layout ?? "8",
      fontSizes: iogurtePage.fontSizes ?? { title: 3, ingredients: 2, prep: 2 },
    };
    // Aplicar ajustes
    shakePage.ingredientGroups = shakeContent.ingredientGroups;
    shakePage.prepSteps = shakeContent.prepSteps;
    shakePage.tips = "Protocolo: Consumir \"dia sim, dia não\" para auxiliar na regulação do trânsito intestinal.";
    shakePage.storage =
      "Consumir imediatamente para melhor textura; se guardar, manter refrigerado e agitar antes de beber.";
    shakePage.category = shakeContent.category;
    shakePage.yield = shakeContent.yield;
    shakePage.layout = shakeContent.layout;
    shakePage.fontSizes = shakeContent.fontSizes;

    iogurtePage.ingredientGroups = iogurteContent.ingredientGroups;
    iogurtePage.prepSteps =
      "Aqueça o leite até atingir 40°C (morno ao toque) e dissolva o leite em pó. Adicione o iogurte, misture bem, cubra e deixe firmar em local abafado.\nEm uma panela, cozinhe morangos com suco de limão e adoçante até obter ponto de geleia espessa.\nDistribua a geleia no fundo dos potes e complete com o iogurte firme.";
    iogurtePage.tips = "Se preferir, faça a geleia com pedaços maiores para textura.";
    iogurtePage.storage = "Geladeira: até 7 dias. Congelamento não recomendado (o iogurte pode talhar).";
    iogurtePage.category = iogurteContent.category;
    iogurtePage.yield = iogurteContent.yield;
    iogurtePage.layout = iogurteContent.layout;
    iogurtePage.fontSizes = iogurteContent.fontSizes;
  }

  // 2) Ajustar categorias específicas
  const toast = recipeMap.get("TOAST DE ATUM CREMOSO");
  if (toast) toast.category = "CAFÉ DA MANHÃ E LANCHES RÁPIDOS";
  const crepiocaDoce = recipeMap.get("CREPIOCA DOCE COM BANANA");
  if (crepiocaDoce) crepiocaDoce.category = "CAFÉ DA MANHÃ E LANCHES RÁPIDOS";
  const milkCafe = recipeMap.get("MILK SHAKE DE CAFÉ");
  if (milkCafe) milkCafe.category = "SHAKES E IOGURTES";
  const milkProteico = recipeMap.get("MILKSHAKE PROTEICO");
  if (milkProteico) milkProteico.category = "SHAKES E IOGURTES";

  // 3) Ajustar dados nutricionais do Abacaxi Caramelizado
  const abacaxi = recipeMap.get("ABACAXI CARAMELIZADO");
  if (abacaxi && abacaxi.nutrition) {
    abacaxi.nutrition.prot = "0.5g";
  }

  // 4) Corrigir dica do Macarrão Cremoso com Brócolis
  const macarrao = recipeMap.get("MACARRÃO CREMOSO COM BRÓCOLIS");
  if (macarrao) {
    macarrao.tips =
      "Para um toque especial, cubra com queijo muçarela e leve ao forno ou air fryer para gratinar.";
  }

  // 5) Completar storage dos waffles
  const waffleDoce = recipeMap.get("WAFFLE DOCE");
  if (waffleDoce) {
    waffleDoce.storage =
      "Consumir na hora para melhor textura. Geladeira: até 1 dia, reaquecer na frigideira/air fryer.";
  }
  const waffleSalgado = recipeMap.get("WAFFLE SALGADO");
  if (waffleSalgado) {
    waffleSalgado.storage =
      "Consumir na hora para melhor textura. Geladeira: até 1 dia, reaquecer na frigideira/air fryer.";
  }

  // Construir páginas especiais e receituário
  const specialPages = originalData.filter(
    (p) =>
      p.type === TEMPLATES.COVER ||
      p.type === TEMPLATES.INTRO ||
      p.type === TEMPLATES.LEGEND
  );
  const tocPages = originalData.filter((p) => p.type === TEMPLATES.TOC);
  const recipePages = originalData.filter((p) => p.type === TEMPLATES.RECIPE);

  const recipeTitleMap = new Map<string, AnyPage>();
  recipePages.forEach((r) => recipeTitleMap.set(r.title.toUpperCase(), r));

  // Nova ordem com páginas de seção
  const newRecipeOrder: AnyPage[] = [];
  USER_CATEGORIZED_RECIPES.forEach((itemTitle) => {
    if (itemTitle.endsWith("S") && itemTitle.length > 5) {
      // Categoria => página de seção
      newRecipeOrder.push({
        id: `p_section_${itemTitle.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
        type: TEMPLATES.SECTION,
        title: itemTitle,
        subtitle: "",
      } as AnyPage);
    } else {
      const recipe = recipeTitleMap.get(itemTitle.toUpperCase());
      if (recipe) newRecipeOrder.push(recipe);
    }
  });

  // Reconstruir PDF
  const newPdfLuizaData: AnyPage[] = [];

  // Capa
  const coverPage = specialPages.find((p) => p.type === TEMPLATES.COVER);
  if (coverPage) newPdfLuizaData.push(coverPage);

  // Introdução inicial
  const introPage = specialPages.find((p) => p.type === TEMPLATES.INTRO && p.id === "p_intro");
  if (introPage) newPdfLuizaData.push(introPage);

  // TODAS as páginas de Sumário
  if (tocPages.length) newPdfLuizaData.push(...tocPages);

  // Legendas
  const legendPage = specialPages.find((p) => p.type === TEMPLATES.LEGEND);
  if (legendPage) newPdfLuizaData.push(legendPage);

  // Receitas na ordem nova com seções
  newPdfLuizaData.push(...newRecipeOrder);

  // Introdução final
  const finalIntroPage = specialPages.find((p) => p.type === TEMPLATES.INTRO && p.id === "p_final");
  if (finalIntroPage) newPdfLuizaData.push(finalIntroPage);

  return newPdfLuizaData;
})();

// Tipos
export type PageData = (typeof PDF_LUIZA_DATA)[0];
export type RecipePageData = (typeof INITIAL_DATA)[typeof TEMPLATES.RECIPE];
export type IntroPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.INTRO];
export type CoverPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.COVER];
export type SectionPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.SECTION];
export type ShoppingPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.SHOPPING];
export type TocPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.TOC] & {
  tocPageNumber?: number;
};
export type LegendPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.LEGEND];