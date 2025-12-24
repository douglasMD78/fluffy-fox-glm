import { TEMPLATES } from "@/lib/constants";

export const INITIAL_DATA = {
    [TEMPLATES.COVER]: { title: "Receitinhas", subtitle: "FIT", author: "@LU.MTSFIT", edition: "EDIÇÃO ESPECIAL" },
    [TEMPLATES.INTRO]: { title: "Um Olá Especial", highlight: "para Você!", text: "Escreva aqui sua mensagem de boas-vindas..." },
    [TEMPLATES.TOC]: { title: "SUMÁRIO" },
    [TEMPLATES.LEGEND]: { title: "Legendas", text: "Estas legendas foram criadas para facilitar a sua organização. Identifique rapidamente em qual refeição cada receita se encaixa melhor no seu dia a dia." },
    [TEMPLATES.SECTION]: { title: "NOME DA SEÇÃO", subtitle: "Subtítulo Manuscrito" },
    [TEMPLATES.SHOPPING]: { title: "Listinha de Compras", hortifruti: "", acougue: "", laticinios: "", padaria: "", mercearia: "" },
    [TEMPLATES.RECIPE]: {
        title: "TÍTULO DA RECEITA", category: "CATEGORIA", code: "CM, LT", yield: "1 porção",
        nutrition: { cal: "000", prot: "0g", carb: "0g", fat: "0g" },
        macroNote: "Valores referentes a 1 porção.",
        ingredientGroups: [{ title: "Ingredientes", items: "" }],
        prepSteps: "", tips: "", storage: "", image: "", videoLink: "",
        layout: '2', // Default layout
        fontSizes: { title: 3, ingredients: 2, prep: 2 }, // Default font sizes (mapped to FONT_SIZES)
        imageSize: 3, // Default image size (mapped to IMG_SIZES)
        spacing: 'normal', // Default spacing (mapped to SPACING_MAP)
        videoDisplayStyle: 'button' // New: Default video display style
    }
};

export const PDF_LUIZA_DATA = [
    { 
        id: 'p_cover', 
        type: TEMPLATES.COVER, 
        title: "Receitinhas", 
        subtitle: "FIT", 
        author: "@LU.MTSFIT", 
        edition: "EDIÇÃO ESPECIAL" 
    },
    { 
        id: 'p_intro', 
        type: TEMPLATES.INTRO, 
        title: "Um Olá Especial", 
        highlight: "para Você!", 
        text: "Seja muito bem-vindo(a) a este espaço que preparei com tanto carinho!\n\nEste e-book nasceu do desejo de trazer ainda mais praticidade para o seu dia a dia na busca por uma alimentação equilibrada. Sei que a rotina pode ser desafiadora, e foi pensando exatamente nisso que reuni aqui as minhas melhores receitas.\n\nCom carinho, Luiza\nNUTRIÇÃO & LIFESTYLE" 
    },
    { 
        id: 'p_toc', 
        type: TEMPLATES.TOC, 
        title: "SUMÁRIO" 
    },
    {
        id: 'p_legend',
        type: TEMPLATES.LEGEND,
        title: "LEGENDAS",
        text: "Estas legendas foram criadas para facilitar a sua organização. Identifique rapidamente em qual refeição cada receita se encaixa melhor no seu dia a dia."
    },
    { 
        id: 'p_receita_01', 
        type: TEMPLATES.RECIPE, 
        title: "PANQUECA FIT", 
        category: "CAFÉ DA MANHÃ E LANCHES RÁPIDOS", 
        code: "CM, LT, J", 
        yield: "2 PANQUECAS", 
        nutrition: { cal: "110", prot: "5g", carb: "7g", fat: "5g" }, 
        macroNote: "Por porção", 
        ingredientGroups: [
            { 
                title: "Massa", 
                items: "2 ovos (ou 1, se preferir)\n30g de farinha de aveia\n2 colheres de sopa de leite\n1 colher de chá de queijo parmesão ralado\nSal a gosto" 
            }
        ], 
        prepSteps: "01 Prepare a massa: Bata os ovos, farinha de aveia, leite, queijo parmesão e sal no liquidificador ou misture bem até formar uma massa homogênea.\n\n02 Despeje a massa em uma frigideira quente e antiaderente. Quando a massa mudar de cor, vire para dourar do outro lado.\n\n03 Monte e sirva: Recheie as panquecas com frango, carne moída ou sardinha.", 
        tips: "Faça o molho em maior quantidade para usar em outras receitas.", 
        storage: "Geladeira: 5 dias em potes bem fechados.", 
        image: "", videoLink: "",
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button' // New: Default video display style
    },
     { 
        id: 'p_final', 
        type: TEMPLATES.INTRO, 
        title: "Bom Apetite!", 
        highlight: "Transformação Deliciosa", 
        text: "Que este guia seja o início de uma transformação deliciosa na sua vida.\n\nwww.lumts.com" 
    }
];

export type PageData = typeof PDF_LUIZA_DATA[0];
export type RecipePageData = typeof INITIAL_DATA[TEMPLATES.RECIPE];
export type IntroPageData = typeof INITIAL_DATA[TEMPLATES.INTRO];
export type CoverPageData = typeof INITIAL_DATA[TEMPLATES.COVER];
export type SectionPageData = typeof INITIAL_DATA[TEMPLATES.SECTION];
export type ShoppingPageData = typeof INITIAL_DATA[TEMPLATES.SHOPPING];
export type TocPageData = typeof INITIAL_DATA[TEMPLATES.TOC];
export type LegendPageData = typeof INITIAL_DATA[TEMPLATES.LEGEND];