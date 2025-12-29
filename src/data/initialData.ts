import { TEMPLATES } from "@/lib/constants";
import { ColumnRatioKey } from "@/lib/constants";
import { z } from "zod";
import originalJson from "./todas-as-receitas-original.json";
import { TOC_CATEGORIES, normalizeCategory } from "@/lib/toc-categories";

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
  [TEMPLATES.TOC]: { 
    title: "SUMÁRIO", 
    tocPageNumber: 1,
    numberingStyle: 'absolute' // 'absolute' (array index) ou 'editorial' (exclui capa/intro/TOC)
  },
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
type AnyPage = typeof originalJson.pages[number];
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const PDF_LUIZA_DATA = (() => {
  const originalData: AnyPage[] = clone(originalJson.pages);

  // construir mapas
  const recipePages = originalData.filter((p) => p.type === TEMPLATES.RECIPE);
  const recipeMap = new Map<string, AnyPage>();
  recipePages.forEach((r) => recipeMap.set(r.title.toUpperCase(), r));

  // 1) Troca de conteúdo: SHAKE LAXATIVO ↔ IOGURTE COM GELEIA DE MORANGO
  const shakeTitle = "SHAKE LAXATIVO (REGULADOR INTESTINAL)";
  const iogTitle = "IOGURTE COM GELEIA DE MORANGO";
  const shakePage = recipeMap.get(shakeTitle.toUpperCase());
  const iogPage = recipeMap.get(iogTitle.toUpperCase());
  if (shakePage && iogPage) {
    const tmpIngredients = shakePage.ingredientGroups;
    const tmpPrep = shakePage.prepSteps;
    const tmpTips = shakePage.tips;
    const tmpStorage = shakePage.storage;

    // IOGURTE passa a ser iogurte caseiro + geleia
    iogPage.ingredientGroups = tmpIngredients;
    iogPage.prepSteps =
      "Aqueça o leite até atingir 40°C (morno ao toque) e dissolva o leite em pó. Adicione o iogurte, misture bem, cubra e deixe firmar em local abafado.\nEm uma panela, cozinhe morangos com suco de limão e adoçante até obter ponto de geleia espessa.\nDistribua a geleia no fundo dos potes e complete com o iogurte firme.";
    iogPage.tips = "Se preferir, faça a geleia com pedaços maiores para textura.";
    iogPage.storage = "Geladeira: até 7 dias. Congelamento não recomendado (o iogurte pode talhar).";
    iogPage.category = "SHAKES E IOGURTES";
    iogPage.yield = "8 potinhos";

    // SHAKE passa a ser o shake regulador de fibras
    shakePage.ingredientGroups = iogPage.ingredientGroups;
    shakePage.prepSteps =
      "Em recipientes separados, coloque as ameixas e a chia de molho em um pouco de água por 10 a 15 minutos.\nA água onde a ameixa ficou de molho contém sorbitol (laxante natural) e deve ser usada na receita. A chia formará um \"gel\" que também será usado integralmente.\nNo liquidificador, coloque o líquido de sua escolha, a linhaça, o mamão, as ameixas com a água do molho, o gel de chia, o psyllium e o adoçante.\nBata até que a mistura fique homogênea e com uma cor mais escura.";
    shakePage.tips = 'Protocolo: Consumir "dia sim, dia não" para auxiliar na regulação do trânsito intestinal.';
    shakePage.storage = "Consumir imediatamente para melhor textura; se guardar, manter refrigerado e agitar antes de beber.";
    shakePage.category = "SHAKES E IOGURTES";
    shakePage.yield = "1 copo";
  }

  // 2) Categorias específicas
  const toast = recipeMap.get("TOAST DE ATUM CREMOSO");
  if (toast) toast.category = "CAFÉ DA MANHÃ E LANCHES RÁPIDOS";
  const crepiocaDoce = recipeMap.get("CREPIOCA DOCE COM BANANA");
  if (crepiocaDoce) crepiocaDoce.category = "CAFÉ DA MANHÃ E LANCHES RÁPIDOS";
  const milkCafe = recipeMap.get("MILK SHAKE DE CAFÉ");
  if (milkCafe) milkCafe.category = "SHAKES E IOGURTES";
  const milkProteico = recipeMap.get("MILKSHAKE PROTEICO");
  if (milkProteico) milkProteico.category = "SHAKES E IOGURTES";

  // 3) Ajustar proteína do Abacaxi Caramelizado
  const abacaxi = recipeMap.get("ABACAXI CARAMELIZADO");
  if (abacaxi?.nutrition) abacaxi.nutrition.prot = "0.5g";

  // 4) Corrigir dica do Macarrão Cremoso com Brócolis
  const macarrao = recipeMap.get("MACARRÃO CREMOSO COM BRÓCOLIS");
  if (macarrao) {
    macarrao.tips = "Para um toque especial, cubra com queijo muçarela e leve ao forno ou air fryer para gratinar.";
  }

  // 5) Completar storage dos waffles
  const waffleDoce = recipeMap.get("WAFFLE DOCE");
  if (waffleDoce) {
    waffleDoce.storage = "Consumir na hora para melhor textura. Geladeira: até 1 dia; reaquecer na frigideira/air fryer.";
  }
  const waffleSalgado = recipeMap.get("WAFFLE SALGADO");
  if (waffleSalgado) {
    waffleSalgado.storage = "Consumir na hora para melhor textura. Geladeira: até 1 dia; reaquecer na frigideira/air fryer.";
  }

  // Páginas especiais e sumário
  const specialPages = originalData.filter(
    (p) => p.type === TEMPLATES.COVER || p.type === TEMPLATES.INTRO || p.type === TEMPLATES.LEGEND
  );
  const tocPages = originalData.filter((p) => p.type === TEMPLATES.TOC);

  // Construir nova ordem com seções conforme USER_CATEGORIZED_RECIPES
  const titleMap = new Map<string, AnyPage>();
  recipePages.forEach((r) => titleMap.set(r.title.toUpperCase(), r));

  const normalizedCategorySet = new Set(TOC_CATEGORIES.map(normalizeCategory));

  const newRecipeOrder: AnyPage[] = [];
  USER_CATEGORIZED_RECIPES.forEach((itemTitle) => {
    const normalized = normalizeCategory(itemTitle);

    // SEÇÃO somente se o item está na lista oficial de categorias
    if (normalizedCategorySet.has(normalized)) {
      newRecipeOrder.push({
        id: `p_section_${itemTitle.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
        type: TEMPLATES.SECTION,
        title: itemTitle,
        subtitle: "",
      } as AnyPage);
      return;
    }

    // Caso contrário, é uma RECEITA (busca pelo título exato)
    const r = titleMap.get(itemTitle.toUpperCase());
    if (r) newRecipeOrder.push(r);
  });

  // Remontar PDF
  const newPdf: AnyPage[] = [];
  const cover = specialPages.find((p) => p.type === TEMPLATES.COVER);
  if (cover) newPdf.push(cover);
  const introStart = specialPages.find((p) => p.type === TEMPLATES.INTRO && p.id === "p_intro");
  if (introStart) newPdf.push(introStart);
  if (tocPages.length) newPdf.push(...tocPages);
  const legend = specialPages.find((p) => p.type === TEMPLATES.LEGEND);
  if (legend) newPdf.push(legend);
  newPdf.push(...newRecipeOrder);
  const introEnd = specialPages.find((p) => p.type === TEMPLATES.INTRO && p.id === "p_final");
  if (introEnd) newPdf.push(introEnd);

  return newPdf;
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
  numberingStyle?: 'absolute' | 'editorial';
};
export type LegendPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.LEGEND];