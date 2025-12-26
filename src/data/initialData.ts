import { TEMPLATES } from "@/lib/constants";
import { ColumnRatioKey } from "@/lib/constants";
import { z } from "zod"; // Importar Zod
// import { HAMBURGUER_FIT_RECIPE } from "./recipes/hamburguer-fit"; // Removendo importação

// Esquema Zod para validar a saída da IA para receitas
export const recipeSchema = z.object({
    title: z.string().min(1, "Título é obrigatório."),
    category: z.string().optional(),
    code: z.string().optional(),
    yield: z.string().optional(),
    nutrition: z.object({
        cal: z.string().regex(/^\d+(\.\d+)?$/, "Calorias deve ser um número.").optional(), // Alterado para permitir decimais
        prot: z.string().regex(/^\d+(\.\d+)?g?$/, "Proteínas deve ser um número.").optional(),
        carb: z.string().regex(/^\d+(\.\d+)?g?$/, "Carboidratos deve ser um número.").optional(),
        fat: z.string().regex(/^\d+(\.\d+)?g?$/, "Gorduras deve ser um número.").optional(),
    }).optional(),
    macroNote: z.string().optional(),
    ingredientGroups: z.array(z.object({
        title: z.string().optional(),
        items: z.string().min(1, "Lista de ingredientes não pode ser vazia."),
    })).min(1, "Pelo menos um grupo de ingredientes é obrigatório."),
    prepSteps: z.string().min(1, "Modo de preparo é obrigatório."),
    tips: z.string().optional(),
    storage: z.string().optional(),
    image: z.string().optional(),
    videoLink: z.string().optional(),
    layout: z.string().optional(),
    fontSizes: z.object({
        title: z.number().optional(),
        ingredients: z.number().optional(),
        prep: z.number().optional(),
    }).optional(),
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
}).partial(); // Usar .partial() para permitir que a IA não retorne todos os campos

// Esquema Zod para validar a saída da IA para intro
export const introSchema = z.object({
    text: z.string().min(1, "O texto da introdução é obrigatório."),
}).partial();

// Esquema Zod para validar a saída da IA para shopping
export const shoppingSchema = z.object({
    hortifruti: z.string().optional(),
    acougue: z.string().optional(),
    laticinios: z.string().optional(),
    padaria: z.string().optional(),
    mercearia: z.string().optional(),
}).partial();


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
        videoDisplayStyle: 'button', // New: Default video display style
        objectFit: 'cover', // Novo: 'cover' ou 'contain'
        objectPosition: 'center', // Novo: 'top', 'center', 'bottom', 'left', 'right', '50% 50%', etc.
        imageZoom: 100, // Novo: 100 (sem zoom), 120 (20% zoom), etc.
        columnRatio: 'default' as ColumnRatioKey, // Nova propriedade para proporção de colunas
        tipPlacement: 'footer', // 'footer', 'ingredients', 'prep', 'hidden'
        storagePlacement: 'footer', // 'footer', 'ingredients', 'prep', 'hidden'
        nutritionDisplayStyle: 'default', // 'default', 'inline-compact', 'block-detailed', 'hidden'
        titleAlignment: null, // Nova propriedade para alinhamento do título
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
        videoDisplayStyle: 'button', // New: Default video display style
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
    },
    {
        id: 'p_shake_laxativo',
        type: TEMPLATES.RECIPE,
        title: "SHAKE LAXATIVO",
        category: "Bolos e Bolinhos",
        code: "LM, LT",
        yield: "8 potinhos",
        nutrition: { cal: "216", prot: "10.6g", carb: "19.8g", fat: "10.3g" },
        macroNote: "Os valores da tabela correspondem a 1 potinho😊",
        ingredientGroups: [
            {
                title: "Para o iogurte:",
                items: "2 litros de leite integral\n1 pote de iogurte natural (como \"isca\")\n4 colheres de sopa de leite em pó (opcional, para consistência)"
            },
            {
                title: "Para a geleia:",
                items: "500g de morangos congelados\n1/2 limão espremido (suco)\n6 colheres de sopa de adoçante culinário (sugestão: Forno e Fogão)"
            }
        ],
        prepSteps: "Prepare o iogurte: Aqueça o leite até atingir 40°C (morno ao toque). Dissolva o leite em pó nesta etapa para garantir cremosidade. Adicione o iogurte natural e misture bem. Cubra o recipiente com plástico filme e um pano de prato. Deixe descansar em um local abafado e sem corrente de ar (como dentro do forno desligado) até firmar.\n\nPrepare a geleia: Em uma panela, coloque os morangos, o suco de limão e o adoçante. Leve ao fogo médio. Não adicione água, deixe o morango soltar o próprio líquido.\n\nDê o ponto: Mexa e amasse levemente os morangos conforme amolecem, mantendo pedaços para textura. Cozinhe até obter uma calda grossa e brilhante.\n\nMonte: Distribua a geleia no fundo de 8 potes e complete com o iogurte firme.",
        tips: "", // No specific tips mentioned in the image
        storage: "**Geladeira:** Mantenha refrigerado e consuma em até 7 dias.\n**Congelamento:** Não recomendado (o iogurte pode talhar ao descongelar)",
        image: "", // Placeholder for image
        videoLink: "", // No video link provided in the image
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button',
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
    },
    {
        id: 'p_iogurte_geleia_morango',
        type: TEMPLATES.RECIPE,
        title: "IOGURTE COM GELEIA DE MORANGO",
        category: "Bolos e Bolinhos",
        code: "LM, LT",
        yield: "1 copo",
        nutrition: { cal: "359", prot: "11.4g", carb: "54.8g", fat: "13.0g" },
        macroNote: "Tabela nutricional aproximada por porção (1 copo), calculada com leite integral e mel😊",
        ingredientGroups: [
            {
                title: "Ingredientes",
                items: "4 unidades de ameixa seca (sem caroço)\n1 colher de sopa de chia\n200 ml de água, leite sem lactose ou leite vegetal\n1 colher de sopa de linhaça (dourada ou marrom)\n1 fatia grande de mamão formosa (ou 1/2 mamão papaya bem maduro)\n1 colher de sopa de psyllium (ou mix de fibras)\nAdoçante stevia ou mel a gosto"
            }
        ],
        prepSteps: "Hidrate: Em recipientes separados, coloque as ameixas e a chia de molho em um pouco de água por 10 a 15 minutos. Isso é essencial para liberar a mucilagem da chia e ativar as fibras da ameixa.\n\nNão descarte a água: A água onde a ameixa ficou de molho contém sorbitol (laxante natural) e deve ser usada na receita. A chia formará um \"gel\" que também será usado integralmente.\n\nBata tudo: No liquidificador, coloque os 200ml de leite, a linhaça, o mamão, as ameixas com a água do molho, o gel de chia, o psyllium e o adoçante.\n\nTriture bem: Bata até que a mistura fique homogênea e com uma cor mais escura, garantindo que todas as sementes e fibras foram bem processadas.",
        tips: "Protocolo: Consumir \"dia sim, dia não\" para auxiliar na regulação do trânsito intestinal.\nDica: Se desejar reduzir as calorias, substitua o leite integral por água ou leite desnatado e use adoçante em vez de mel",
        storage: "", // No specific storage mentioned in the image
        image: "", // Placeholder for image
        videoLink: "", // No video link provided in the image
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button',
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
    },
    {
        id: 'p_toast_atum_cremoso',
        type: TEMPLATES.RECIPE,
        title: "TOAST DE ATUM CREMOSO",
        category: "Bolos e Bolinhos",
        code: "LM, LT",
        yield: "8 toasts",
        nutrition: { cal: "216", prot: "10.6g", carb: "19.8g", fat: "10.3g" },
        macroNote: "Tabela nutricional por unidade (1 toast)😊",
        ingredientGroups: [
            {
                title: "Ingredientes",
                items: "8 fatias de pão de forma\n2 latas de atum sólido (escorrido)\n1/2 cebola roxa picada\n1/2 tomate picado\nCebolinha picada a gosto (opcional)\n2 colheres de sopa (bem cheias) de requeijão cremoso light\n8 fatias de queijo mussarela\nSal a gosto"
            }
        ],
        prepSteps: "Prepare o recheio: Em um bowl, misture o atum, a cebola, o tomate, a cebolinha e o requeijão. Tempere com sal e mexa até obter um creme homogêneo.\n\nPrepare o pão: Pressione levemente o centro de cada fatia de pão com uma colher, criando uma pequena cavidade para acomodar o recheio sem vazar.\n\nMonte: Distribua o creme de atum sobre as fatias de pão e cubra cada um com uma fatia de queijo mussarela.\n\nAsse: Leve ao forno ou Air Fryer até o queijo derreter e gratinar (se for consumir na hora)",
        tips: "",
        storage: "Como embalar: Envolva cada toast (ainda cru/sem assar o queijo) individualmente em plástico filme, fechando bem.\nValidade: Pode ser mantido no congelador por até 3 meses.\nPara consumir: Retire do congelador e leve direto ao forno ou Air Fryer até aquecer e o queijo derreter.",
        image: "",
        videoLink: "",
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button',
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
    },
    {
        id: 'p_crepioca_doce',
        type: TEMPLATES.RECIPE,
        title: "CREPIOCA DOCE COM BANANA",
        category: "Bolos e Bolinhos",
        code: "LT, S",
        yield: "1 unidade",
        nutrition: { cal: "350", prot: "15g", carb: "35g", fat: "15g" },
        macroNote: "Tabela nutricional por porção (1 unidade).",
        ingredientGroups: [
            {
                title: "Ingredientes",
                items: "1 ovo\n2 colheres de sopa de goma de tapioca\n50g de queijo mussarela (aprox. 2 fatias)\n1 banana (cortada em rodelas)\n1 pitada de sal\nMel e Canela a gosto (para finalizar)"
            }
        ],
        prepSteps: "Base de Queijo: Em uma frigideira antiaderente fria, distribua o queijo mussarela no fundo.\n\nCamada de Banana: Coloque as rodelas de banana sobre o queijo.\n\nMassa: Em uma tigela separada, bata o ovo com a tapioca e o sal até ficar homogêneo. Despeje essa mistura na frigideira, cobrindo as bananas e o queijo.\n\nCozimento: Tampe a frigideira e leve ao fogo baixo. Quando ouvir o queijo \"estalando\", significa que a crosta dourada se formou.\n\nFinalização: Vire para cozinhar o outro lado brevemente. Sirva com um fio de mel e canela polvilhada por cima.",
        tips: "O segredo da crosta crocante é começar com a frigideira fria e deixar o queijo dourar bem antes de virar. Use uma boa frigideira antiaderente para não precisar adicionar óleo.",
        storage: "Consumo imediato: A textura é melhor na hora.",
        image: "",
        videoLink: "",
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button',
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
    },
    {
        id: 'p_pudim_chia_frutas',
        type: TEMPLATES.RECIPE,
        title: "PUDIM DE CHIA COM GELATINA E FRUTAS",
        category: "Bolos e Bolinhos",
        code: "LT, S",
        yield: "4 unidades",
        nutrition: { cal: "165", prot: "8.5g", carb: "20.5g", fat: "4.6g" },
        macroNote: "Tabela nutricional estimada por pote (considerando rendimento de 4 unidades e uso de iogurte desnatado).",
        ingredientGroups: [
            {
                title: "Base",
                items: "2 pacotes de gelatina diet (sabor morango)\nÁgua (conforme instrução da embalagem)"
            },
            {
                title: "Creme de Chia",
                items: "400 ml de iogurte natural\n4 colheres de sopa de chia\n4 colheres de sopa de aveia em flocos\nAdoçante a gosto (Sugestão: 5 a 6 dosadores de stevia)"
            },
            {
                title: "Cobertura",
                items: "Morangos picados\nKiwi picado\n(Ou frutas de sua preferência)"
            }
        ],
        prepSteps: "Prepare a gelatina: Dissolva a gelatina diet conforme as instruções do fabricante. Distribua em potes de vidro e leve à geladeira até firmar completamente.\n\nPrepare o creme: Em uma tigela, misture o iogurte natural, a chia, a aveia e o adoçante. Mexa bem até integrar.\n\nMonte: Retire os potes da geladeira. Adicione uma camada generosa do creme de chia sobre a gelatina já firme.\n\nFinalize: Cubra com os pedaços de morango e kiwi.",
        tips: "",
        storage: "Geladeira: Mantenha os potes bem fechados na geladeira por até 3 a 4 dias.\nDica: Se for consumir depois de muitos dias, prefira colocar as frutas picadas apenas na hora de comer para que elas não soltem muita água ou oxidem.\nCongelamento: Não recomendado. A gelatina cristaliza e perde a textura gelatinosa ao descongelar, e o iogurte pode talhar ou separar o soro",
        image: "",
        videoLink: "",
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button',
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
    },
    {
        id: 'p_sorvete_manga_fit',
        type: TEMPLATES.RECIPE,
        title: "SORVETE DE MANGA FIT (2 INGREDIENTES)",
        category: "Bolos e Bolinhos",
        code: "LM, LT",
        yield: "1 porção",
        nutrition: { cal: "410", prot: "13.2g", carb: "67.7g", fat: "12.2g" },
        macroNote: "Tabela nutricional referente à receita completa (1 manga grande + leite em pó integral).",
        ingredientGroups: [
            {
                title: "Ingredientes",
                items: "Manga picada e congelada (quantidade a gosto, sugestão: 1 a 2 mangas grandes)\n4 colheres de sopa de leite em pó (ou Whey Protein sabor baunilha/neutro)"
            }
        ],
        prepSteps: "Congelamento: Descasque e corte a manga (tipos Tommy ou Palmer são melhores por terem menos fiapos) em cubos. Leve ao congelador por aproximadamente 6 horas ou até que esteja bem dura.\n\nProcessamento: Coloque a manga congelada em um recipiente resistente. Adicione o leite em pó (ou Whey Protein) por cima.\n\nBata: Utilize um Mixer para processar a fruta com o pó. Pressione o mixer contra a fruta aos poucos até obter uma textura cremosa e homogênea.\n\nCuidado: Evite usar liquidificador comum sem água, pois a manga congelada é muito dura e pode danificar o aparelho. O mixer é o mais indicado.\n\nSirva: O resultado é imediato, um creme espesso estilo sorvete de massa.",
        tips: "Proteína Extra: Substitua o leite em pó por Whey Protein para transformar esse sorvete em um pós-treino refrescante e proteico.",
        storage: "Congelador: Pode ser armazenado no congelador em pote fechado. Se endurecer muito, retire alguns minutos antes de consumir para voltar à cremosidade.",
        image: "",
        videoLink: "",
        layout: '2',
        fontSizes: { title: 3, ingredients: 2, prep: 2 },
        imageSize: 3,
        spacing: 'normal',
        videoDisplayStyle: 'button',
        objectFit: 'cover',
        objectPosition: 'center',
        imageZoom: 100,
        columnRatio: 'default' as ColumnRatioKey,
        tipPlacement: 'footer',
        storagePlacement: 'footer',
        nutritionDisplayStyle: 'default',
        titleAlignment: null,
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