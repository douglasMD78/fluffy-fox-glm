import { TEMPLATES } from "@/lib/constants";
import { ColumnRatioKey } from "@/lib/constants";
import { z } from "zod";
import originalJson from "./todas-as-receitas-original.json";
import { normalizeCodes, getRecommendedTags } from "@/utils/tagging";

// Categorias definidas diretamente aqui
const TOC_CATEGORIES = [
  "ACOMPANHAMENTOS, SALADAS & SOPAS",
  "BOLOS, DOCES & SOBREMESAS",
  "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
  "SALGADOS E REFEIÇÕES",
  "SHAKES E IOGURTES",
];

// Esquema Zod para validar a saída da IA para receitas
export const recipeSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório."),
    category: z.string().optional(),
    code: z.string().optional(),
    time: z.string().optional(),
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
  [TEMPLATES.TOC]: {
    title: "Sumário",
    part: 1,
    fontScale: 1,
  },
  [TEMPLATES.INTRO]: {
    title: "Um Olá Especial",
    highlight: "para Você!",
    text: "Escreva aqui sua mensagem de boas-vindas...",
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
    time: "10 min",
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
  "ACOMPANHAMENTOS, SALADAS & SOPAS",
  "BOLOS, DOCES & SOBREMESAS",
  "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
  "SALGADOS E REFEIÇÕES",
  "SHAKES E IOGURTES",
];

// Utilitários
type AnyPage = typeof originalJson.pages[number];
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// NOVO: Calibrar rendimento por padrões de título (apenas se o campo estiver vazio após limpeza)
function calibrateYieldByTitle(title: string, currentYield: string, category: string): string {
  if (currentYield && String(currentYield).trim()) {
    // Se já tem valor preenchido, mantém
    return String(currentYield).trim();
  }

  const titleU = title.toUpperCase();
  const cat = canonicalCategory(category);

  // Padrões específicos de título, retornam yield natural quando detectados
  if (titleU.includes("HAMBÚRGUER")) return "6 hambúrgueres";
  if (titleU.includes("MINI PIZZA") || titleU.includes("PIZZA") || titleU.includes("DISQUINHOS")) return "12 disquinhos";
  if (titleU.includes("TOAST")) return "8 toasts";
  if (titleU.includes("COXINHA")) return "9 coxinhas";
  if (titleU.includes("PASTELZINHO") || titleU.includes("PASTEIZINHO")) return "6 pasteizinhos";
  if (titleU.includes("BOLINHO DE CHOCOLATE")) return "6 bolinhos";
  if (titleU.includes("MUFFIN")) return "4 muffins";
  if (titleU.includes("BOLINHO DE MICROONDAS")) return "1 bolinho";
  if (titleU.includes("PÃO DE MEL")) return "6 unidades";
  if (titleU.includes("SORVETE")) return "1 porção (conforme o tamanho da porção)";
  if (titleU.includes("PRESTÍGIO FIT") || titleU.includes("BOLO NO POTE") || titleU.includes("DANONINHO FIT") || titleU.includes("FLAN") || titleU.includes("MOUSSE") || titleU.includes("PUDDING")) {
    return "1 potinho";
  }
  // Heurísticas já existentes (shakes/iogurtes)
  if (cat === "SHAKES E IOGURTES") {
    if (titleU.includes("IOGURTE")) return "1 potinho";
    if (titleU.includes("SHAKE")) return "1 copo";
    return "1 porção";
  }
  // Padrões por categoria (genérico)
  if (cat === "ACOMPANHAMENTOS, SALADAS & SOPAS") return "4 porções";
  if (cat === "BOLOS, DOCES & SOBREMESAS") return "1 porção";
  if (cat === "CAFÉ DA MANHÃ & LANCHES RÁPIDOS") return "1 porção";
  if (cat === "SALGADOS E REFEIÇÕES") return "1 porção";

  return "1 porção";
}

// Correção de tags (code) e limpeza do rendimento (yield)
const TAG_CODES = ["CM", "LM", "A", "LT", "J", "S", "AC", "B"];

function extractCodesFromString(s?: string): string[] {
  const text = String(s || "").toUpperCase();
  const matches = text.match(/\b(CM|LM|A|LT|J|S|AC|B)\b/g) || [];
  // remove duplicatas preservando ordem
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of matches) {
    if (!seen.has(m)) { seen.add(m); out.push(m); }
  }
  return out;
}

function cleanYield(y?: string): string {
  if (!y) return "";
  let val = String(y);

  // Remover parênteses que contenham códigos de tag
  val = val.replace(/\([^)]*\)/g, (group) => {
    const hasCode = TAG_CODES.some((code) => group.toUpperCase().includes(code));
    return hasCode ? "" : group;
  });

  // Remover códigos soltos fora de parênteses
  val = val.replace(/\b(CM|LM|A|LT|J|S|AC|B)\b/g, "").replace(/\s+,/g, ",").replace(/,\s+/g, ", ").trim();

  // Se depois da limpeza sobrou vazio, deixa vazio (melhor do que mostrar tags no lugar do rendimento)
  return val.trim();
}

// Função de refatoração exportada
export function refatorarDadosIniciais(): AnyPage[] {
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
    // Guardar ingredientes originais de cada página ANTES de sobrescrever
    const shakeIngredientsFromJSON = shakePage.ingredientGroups;
    const iogIngredientsFromJSON = iogPage.ingredientGroups;

    // IOGURTE passa a ser iogurte caseiro + geleia (usa ingredientes que estavam originalmente no shake)
    iogPage.ingredientGroups = shakeIngredientsFromJSON;
    iogPage.prepSteps =
      "Aqueça o leite até atingir 40°C (morno ao toque) e dissolva o leite em pó. Adicione o iogurte, misture bem, cubra e deixe firmar em local abafado.\nEm uma panela, cozinhe morangos com suco de limão e adoçante até obter ponto de geleia espessa.\nDistribua a geleia no fundo dos potes e complete com o iogurte firme.";
    iogPage.tips = "Se preferir, faça a geleia com pedaços maiores para textura.";
    iogPage.storage = "Geladeira: até 7 dias. Congelamento não recomendado (o iogurte pode talhar).";
    iogPage.category = "SHAKES E IOGURTES";
    iogPage.yield = "8 potinhos";

    // SHAKE passa a ser o shake regulador de fibras (usa ingredientes que estavam originalmente no iogurte)
    shakePage.ingredientGroups = iogIngredientsFromJSON;
    shakePage.prepSteps =
      "Em recipientes separados, coloque as ameixas e a chia de molho em um pouco de água por 10 a 15 minutos.\nA água onde a ameixa ficou de molho contém sorbitol (laxante natural) e deve ser usada na receita. A chia formará um \"gel\" que também será usado integralmente.\nNo liquidificador, coloque o líquido de sua escolha, a linhaça, o mamão, as ameixas com a água do molho, o gel de chia, o psyllium e o adoçante.\nBata até que a mistura fique homogênea e com uma cor mais escura.";
    shakePage.tips = 'Protocolo: Consumir "dia sim, dia não" para auxiliar na regulação do trânsito intestinal.';
    shakePage.storage = "Consumir imediatamente para melhor textura; se guardar, manter refrigerado e agitar antes de beber.";
    shakePage.category = "SHAKES E IOGURTES";
    shakePage.yield = "1 copo";
  }

  // 2) Categorias específicas
  const toast = recipeMap.get("TOAST DE ATUM CREMOSO");
  if (toast) toast.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const crepiocaDoce = recipeMap.get("CREPIOCA DOCE COM BANANA");
  if (crepiocaDoce) crepiocaDoce.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const milkCafe = recipeMap.get("MILK SHAKE DE CAFÉ");
  if (milkCafe) milkCafe.category = "SHAKES E IOGURTES";
  const milkProteico = recipeMap.get("MILKSHAKE PROTEICO");
  if (milkProteico) milkProteico.category = "SHAKES E IOGURTES";

  // 2.1) Tags faltantes de Café da Manhã / Lanches Rápidos (CM/LM)
  const panquecaFit = recipeMap.get("PANQUECA FIT");
  if (panquecaFit) panquecaFit.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const overnightOats = recipeMap.get("OVERNIGHT OATS");
  if (overnightOats) overnightOats.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const waffleDoce = recipeMap.get("WAFFLE DOCE");
  if (waffleDoce) waffleDoce.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const waffleSalgado = recipeMap.get("WAFFLE SALGADO");
  if (waffleSalgado) waffleSalgado.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const paoCarneMoida = recipeMap.get("PÃO COM CARNE MOÍDA");
  if (paoCarneMoida) paoCarneMoida.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const sanduicheNatural = recipeMap.get("SANDUÍCHE NATURAL");
  if (sanduicheNatural) sanduicheNatural.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  const crepioca = recipeMap.get("CREPIOCA");
  if (crepioca) crepioca.category = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";

  // 2.2) Tags faltantes de Shakes / Iogurtes (B/LM/LT/CM)
  const iogurteNatural = recipeMap.get("IOGURTE NATURAL INFINITO");
  if (iogurteNatural) iogurteNatural.category = "SHAKES E IOGURTES";
  const iogurteGeleiaMorango = recipeMap.get("IOGURTE COM GELEIA DE MORANGO");
  if (iogurteGeleiaMorango) iogurteGeleiaMorango.category = "SHAKES E IOGURTES";
  const milkshakeCafe = recipeMap.get("MILK SHAKE DE CAFÉ");
  if (milkshakeCafe) milkshakeCafe.category = "SHAKES E IOGURTES";
  const milkshakeProteico = recipeMap.get("MILKSHAKE PROTEICO");
  if (milkshakeProteico) milkshakeProteico.category = "SHAKES E IOGURTES";

  // 3) Ajustar proteína do Abacaxi Caramelizado
  const abacaxi = recipeMap.get("ABACAXI CARAMELIZADO");
  if (abacaxi?.nutrition) abacaxi.nutrition.prot = "0.5g";

  // 4) Corrigir dica do Macarrão Cremoso com Brócolis
  const macarrao = recipeMap.get("MACARRÃO CREMOSO COM BRÓCOLIS");
  if (macarrao) {
    macarrao.tips = "Para um toque especial, cubra com queijo muçarela e leve ao forno ou air fryer para gratinar.";
  }

  // 5) Completar storage dos waffles
  (function updateWaffleStorage() {
    const wDoce = recipeMap.get("WAFFLE DOCE");
    if (wDoce) {
      wDoce.storage = "Consumir na hora para melhor textura. Geladeira: até 1 dia; reaquecer na frigideira/air fryer.";
    }
    const wSalgado = recipeMap.get("WAFFLE SALGADO");
    if (wSalgado) {
      wSalgado.storage = "Consumir na hora para melhor textura. Geladeira: até 1 dia; reaquecer na frigideira/air fryer.";
    }
  })();

  // NOVO: Padronizar categorias para os nomes canônicos
  function canonicalCategory(name?: string) {
    const s = String(name || "").toUpperCase().trim();
    if (s.includes("SOPAS") || s.includes("CALDOS") || s.includes("ACOMPANHAMENTOS") || s.includes("SALADAS")) {
      return "ACOMPANHAMENTOS, SALADAS & SOPAS";
    }
    if (s.includes("BOLOS") || s.includes("SOBREMESAS") || s.includes("DOCES")) {
      return "BOLOS, DOCES & SOBREMESAS";
    }
    if (s.includes("LANCHES") || s.includes("CAFÉ")) {
      return "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
    }
    if (s.includes("SALGADOS") || s.includes("REFEIÇÕES")) {
      return "SALGADOS E REFEIÇÕES";
    }
    if (s.includes("SHAKES") || s.includes("IOGURTES")) {
      return "SHAKES E IOGURTES";
    }
    return name || "";
  }

  recipePages.forEach((p) => {
    (p as any).category = canonicalCategory((p as any).category);
  });

  // NOVO: Substituição inteligente de tags por categoria, preservando edições manuais
  function smartTagsForRecipe(title: string, category: string, currentCodeRaw: string): { tags: string[]; isManual: boolean } {
    const titleU = title.toUpperCase();
    const cat = canonicalCategory(category);
    const currentCodes = normalizeCodes(currentCodeRaw);

    // Flag simples: se o usuário editou tags diretamente via código no JSON, marcamos como manual
    // Aqui usamos heurística: se as tags atuais divergem totalmente do recomendado para a categoria, consideramos manual
    const recommendedCat = getRecommendedTags(title, cat);
    const isManual = currentCodes.length > 0 && !recommendedCat.some(t => currentCodes.includes(t));

    if (isManual) {
      // Preservar manualmente: retorna o que está, sem alterar
      return { tags: currentCodes, isManual: true };
    }

    // Substituição inteligente baseada na categoria canônica
    let smart: string[] = [];
    if (cat === "CAFÉ DA MANHÃ & LANCHES RÁPIDOS") {
      smart = ["CM", "LM"];
    } else if (cat === "BOLOS, DOCES & SOBREMESAS") {
      smart = ["S"];
    } else if (cat === "SALGADOS E REFEIÇÕES") {
      smart = ["A", "J"];
    } else if (cat === "ACOMPANHAMENTOS, SALADAS & SOPAS") {
      if (titleU.includes("CALDINHO") || titleU.includes("SOPA")) {
        smart = ["A", "J"];
      } else {
        smart = ["AC"];
      }
    } else if (cat === "SHAKES E IOGURTES") {
      if (titleU.includes("IOGURTE NATURAL INFINITO") || titleU.includes("SHAKE LAXATIVO")) {
        smart = ["B", "LM"];
      } else {
        smart = ["LM"];
      }
    } else {
      // Fallback: usa recomendado atual
      smart = recommendedCat;
    }

    // Ajuste fino para bases conhecidas (ex.: Requeijão)
    if (titleU.includes("REQUEIJÃO")) {
      if (!smart.includes("B")) smart.push("B");
    }

    return { tags: smart, isManual: false };
  }

  recipePages.forEach((p) => {
    const page: any = p;
    const { tags: smartTags, isManual } = smartTagsForRecipe(String(page.title || ""), String(page.category || ""), String(page.code || ""));

    // Ordenar por prioridade
    const order = ["B", "CM", "LM", "LT", "A", "J", "AC", "S"];
    smartTags.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    page.code = smartTags.join(", ");

    // Atualiza campo de controle manual (para uso futuro no editor, se quiser persistir)
    page._tagsLocked = isManual;
  });

  // Calibrar rendimento por padrões de título
  recipePages.forEach((p) => {
    const page: any = p;

    // 1) Extrair códigos do yield (já feito acima) e limpar yield
    page.yield = cleanYield(page.yield);

    // 2) Calibrar por título, só se estiver vazio
    page.yield = calibrateYieldByTitle(String(page.title || ""), String(page.yield || ""), String(page.category || ""));

    // 3) Se ainda vazio, atribuir padrão por categoria (reutilizar a função anterior para consistência)
    if (!page.yield || !String(page.yield).trim()) {
      const cat = String(page.category || "");
      const t = String(page.title || "").toUpperCase();

      function defaultYieldByCategory() {
        if (cat === "ACOMPANHAMENTOS, SALADAS & SOPAS") return "4 porções";
        if (cat === "BOLOS, DOCES & SOBREMESAS") return "1 porção";
        if (cat === "CAFÉ DA MANHÃ & LANCHES RÁPIDOS") return "1 porção";
        if (cat === "SALGADOS E REFEIÇÕES") return "1 porção";
        if (cat === "SHAKES E IOGURTES") {
          if (t.includes("IOGURTE")) return "1 potinho";
          if (t.includes("SHAKE")) return "1 copo";
          return "1 porção";
        }
        return "1 porção";
      }

      page.yield = defaultYieldByCategory();
    }
  });

  recipePages.forEach((p) => {
    const page: any = p;

    // 1) Juntar tags vindas de code atual + yield + recomendações (categoria/título)
    const currentCodes = normalizeCodes(page.code).map(String);
    const yieldCodes = extractCodesFromString(page.yield);
    const recommended = getRecommendedTags(page.title, page.category).map(String);

    // Ajuste específico para Bases conhecidas (Requeijão, Iogurte Natural Infinito)
    const titleU = String(page.title || "").toUpperCase();
    const baseExtras: string[] = [];
    if (titleU.includes("REQUEIJÃO")) baseExtras.push("B");

    // Consolida conjunto de tags e remove duplicatas
    const allCodesSet = new Set<string>([...currentCodes, ...yieldCodes, ...recommended, ...baseExtras]);
    const finalCodes = Array.from(allCodesSet);

    // 2) Aplicar tags consolidadas de volta no campo code (ordenar por uma ordem estável)
    const order = ["B", "CM", "LM", "LT", "A", "J", "AC", "S"];
    finalCodes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    page.code = finalCodes.join(", ");

    // 3) Limpar rendimento, removendo tags indevidas
    page.yield = cleanYield(page.yield);

    // 4) Preencher rendimento padrão se ficou vazio
    if (!page.yield || !String(page.yield).trim()) {
      const cat = String(page.category || "");
      const t = String(page.title || "").toUpperCase();

      function defaultYieldByCategory() {
        if (cat === "ACOMPANHAMENTOS, SALADAS & SOPAS") return "4 porções";
        if (cat === "BOLOS, DOCES & SOBREMESAS") return "1 porção";
        if (cat === "CAFÉ DA MANHÃ & LANCHES RÁPIDOS") return "1 porção";
        if (cat === "SALGADOS E REFEIÇÕES") return "1 porção";
        if (cat === "SHAKES E IOGURTES") {
          // Pequena heurística: se for iogurte com geleia ou iogurte natural, prefere "1 potinho"
          if (t.includes("IOGURTE")) return "1 potinho";
          if (t.includes("SHAKE")) return "1 copo";
          return "1 porção";
        }
        return "1 porção";
      }

      page.yield = defaultYieldByCategory();
    }
  });

  // Páginas especiais sem TOC
  const specialPages = originalData.filter(
    (p) => p.type === TEMPLATES.COVER || p.type === TEMPLATES.INTRO || p.type === TEMPLATES.LEGEND
  );

  // Páginas de sumário (manter as existentes)
  const tocPages = originalData.filter(
    (p) => p.type === TEMPLATES.TOC
  );

  // Agrupar receitas por categoria canônica, inserindo capa de seção antes de cada grupo
  function buildGroupedOrder(recipes: AnyPage[]): AnyPage[] {
    // Mapa categoria -> receitas
    const byCat = new Map<string, AnyPage[]>();
    recipes.forEach((r) => {
      const cat = String((r as any).category || "").trim();
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat)!.push(r);
    });

    const grouped: AnyPage[] = [];
    const usedCats = new Set<string>();

    // 1) Grupos na ordem de TOC_CATEGORIES (com capa antes)
    for (const cat of TOC_CATEGORIES) {
      const catRecipes = byCat.get(cat);
      if (catRecipes && catRecipes.length > 0) {
        usedCats.add(cat);
        // Inserir capa da seção antes das receitas
        grouped.push({
          id: `p_section_${cat.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
          type: TEMPLATES.SECTION,
          title: cat,
          subtitle: "",
        } as AnyPage);
        // Adicionar receitas da categoria (mantém ordem original delas)
        grouped.push(...catRecipes);
      }
    }

    // 2) Categorias fora da lista padrão: inserir com capa ao final
    for (const [cat, catRecipes] of byCat.entries()) {
      if (!usedCats.has(cat) && catRecipes.length > 0) {
        grouped.push({
          id: `p_section_${cat.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
          type: TEMPLATES.SECTION,
          title: cat,
          subtitle: "",
        } as AnyPage);
        grouped.push(...catRecipes);
      }
    }

    return grouped;
  }

  const newRecipeOrder = buildGroupedOrder(recipePages);

  // Remontar PDF COM TOC (incluindo as 5 páginas de sumário existentes)
  const newPdf: AnyPage[] = [];
  const cover = specialPages.find((p) => p.type === TEMPLATES.COVER);
  if (cover) newPdf.push(cover);
  const introStart = specialPages.find((p) => p.type === TEMPLATES.INTRO && p.id === "p_intro");
  if (introStart) newPdf.push(introStart);
  
  // Incluir todas as páginas de sumário existentes
  newPdf.push(...tocPages);
  
  const legend = specialPages.find((p) => p.type === TEMPLATES.LEGEND);
  if (legend) newPdf.push(legend);
  newPdf.push(...newRecipeOrder);
  const introEnd = specialPages.find((p) => p.type === TEMPLATES.INTRO && p.id === "p_final");
  if (introEnd) newPdf.push(introEnd);

  // QA FINAL: Validação e correções residuais (consistência entre categoria, tags e yield)
  function qaConsistency(recipes: AnyPage[]) {
    const issues: { title: string; issue: string }[] = [];

    recipes.forEach((r) => {
      const p = r as any;
      const title = String(p.title || "").trim();
      const cat = canonicalCategory(String(p.category || ""));
      const tags = normalizeCodes(p.code);
      const yieldRaw = String(p.yield || "").trim();
      const titleU = title.toUpperCase();

      // 1) Categoria vs Tags: garantir que não há mistura inadequada
      if (cat === "BOLOS, DOCES & SOBREMESAS") {
        const undesired = tags.filter(t => ["CM", "LM", "LT", "A", "J", "AC", "B"].includes(t));
        if (undesired.length > 0) {
          issues.push({ title, issue: `Doces/Sobremesas com tags indevidas: ${undesired.join(", ")}` });
          p.code = "S";
        }
      }

      if (cat === "SALGADOS E REFEIÇÕES") {
        const undesired = tags.filter(t => ["CM", "LM", "LT", "S", "AC", "B"].includes(t));
        if (undesired.length > 0) {
          issues.push({ title, issue: `Salgados/Refeições com tags indevidas: ${undesired.join(", ")}` });
          p.code = "A, J";
        }
      }

      if (cat === "CAFÉ DA MANHÃ & LANCHES RÁPIDOS") {
        const undesired = tags.filter(t => ["A", "J", "S", "AC", "B"].includes(t));
        if (undesired.length > 0) {
          issues.push({ title, issue: `Café/Lanches com tags indevidas: ${undesired.join(", ")}` });
          p.code = "CM, LM";
        }
      }

      if (cat === "ACOMPANHAMENTOS, SALADAS & SOPAS") {
        const isSoup = titleU.includes("CALDINHO") || titleU.includes("SOPA");
        const expected = isSoup ? ["A", "J"] : ["AC"];
        const undesired = tags.filter(t => !expected.includes(t));
        if (undesired.length > 0) {
          issues.push({ title, issue: `Acomp/Saladas/Sopas com tags indevidas: ${undesired.join(", ")}` });
          p.code = expected.join(", ");
        }
      }

      if (cat === "SHAKES E IOGURTES") {
        const isBase = titleU.includes("IOGURTE NATURAL INFINITO") || titleU.includes("SHAKE LAXATIVO");
        const expected = isBase ? ["B", "LM"] : ["LM"];
        const undesired = tags.filter(t => !expected.includes(t));
        if (undesired.length > 0) {
          issues.push({ title, issue: `Shakes/Iogurtes com tags indevidas: ${undesired.join(", ")}` });
          p.code = expected.join(", ");
        }
      }

      // 2) Yield vazio ou só números: garantir que haja texto útil
      if (!yieldRaw || /^\d+$/.test(yieldRaw)) {
        // Deixa a calibragem anterior já lidar, só registra se vazio
        if (!yieldRaw) {
          issues.push({ title, issue: "Yield ficou vazio após calibragem" });
        }
      }

      // 3) Categoria vazia ou desconhecida: usar canônica por heurística de título
      if (!cat) {
        let inferred = "";
        if (titleU.includes("SHAKE") || titleU.includes("IOGURTE")) {
          inferred = "SHAKES E IOGURTES";
        } else if (titleU.includes("BOLO") || titleU.includes("DOC") || titleU.includes("SOBREMESA") || titleU.includes("BRIGADEIRO") || titleU.includes("MOUSSE")) {
          inferred = "BOLOS, DOCES & SOBREMESAS";
        } else if (titleU.includes("HAMBÚRGUER") || titleU.includes("FRANGO") || titleU.includes("CARNE") || titleU.includes("ARROZ") || titleU.includes("MACARRÃO") || titleU.includes("PIZZA") || titleU.includes("COXINHA") || titleU.includes("PASTEL") || titleU.includes("CROQUETE") || titleU.includes("TORTINHA")) {
          inferred = "SALGADOS E REFEIÇÕES";
        } else if (titleU.includes("CALDINHO") || titleU.includes("SOPA") || titleU.includes("SALADA") || titleU.includes("BATATA") || titleU.includes("REQUEIJÃO")) {
          inferred = "ACOMPANHAMENTOS, SALADAS & SOPAS";
        } else if (titleU.includes("PANQUECA") || titleU.includes("WAFFLE") || titleU.includes("OVERNIGHT") || titleU.includes("TOAST") || titleU.includes("PÃO") || titleU.includes("SANDUÍCHE") || titleU.includes("CREPIOCA")) {
          inferred = "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
        }
        if (inferred) {
          issues.push({ title, issue: `Categoria vazia/inferida: ${inferred}` });
          p.category = inferred;
        }
      }
    });

    // Log para inspeção (pode remover ou comentar em prod)
    if (issues.length > 0) {
      console.group("🔍 QA Consistência Final");
      issues.forEach(({ title, issue }) => console.warn(`- ${title}: ${issue}`));
      console.groupEnd();
    } else {
      console.info("✅ QA Consistência: Nenhum problema encontrado.");
    }

    return issues;
  }

  // Rodar QA nas receitas finais
  qaConsistency(recipePages);

  return newPdf;
}

export const PDF_LUIZA_DATA = (() => {
  return refatorarDadosIniciais();
})();

// Tipos
export type PageData = {
  id: string;
  type: TEMPLATES;
  title?: string;
  [key: string]: any;
};

export type TocPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.TOC];
export type RecipePageData = (typeof INITIAL_DATA)[typeof TEMPLATES.RECIPE];
export type IntroPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.INTRO];
export type CoverPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.COVER];
export type SectionPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.SECTION];
export type ShoppingPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.SHOPPING];
export type LegendPageData = (typeof INITIAL_DATA)[typeof TEMPLATES.LEGEND];

// NOVO: Padronizar categorias para os nomes canônicos
function canonicalCategory(name?: string) {
  const s = String(name || "").toUpperCase().trim();
  if (s.includes("SOPAS") || s.includes("CALDOS") || s.includes("ACOMPANHAMENTOS") || s.includes("SALADAS")) {
    return "ACOMPANHAMENTOS, SALADAS & SOPAS";
  }
  if (s.includes("BOLOS") || s.includes("SOBREMESAS") || s.includes("DOCES")) {
    return "BOLOS, DOCES & SOBREMESAS";
  }
  if (s.includes("LANCHES") || s.includes("CAFÉ")) {
    return "CAFÉ DA MANHÃ & LANCHES RÁPIDOS";
  }
  if (s.includes("SALGADOS") || s.includes("REFEIÇÕES")) {
    return "SALGADOS E REFEIÇÕES";
  }
  if (s.includes("SHAKES") || s.includes("IOGURTES")) {
    return "SHAKES E IOGURTES";
  }
  return name || "";
}