import { TEMPLATES } from "@/lib/constants";
import { ColumnRatioKey } from "@/lib/constants";
import { z } from "zod"; // Importar Zod

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
    [TEMPLATES.TOC]: { title: "SUMÁRIO", tocPageNumber: 1 }, // Adicionado tocPageNumber
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
      "id": "p_cover",
      "type": "cover",
      "title": "Receitinhas",
      "subtitle": "FIT",
      "author": "@LU.MTSFIT",
      "edition": "EDIÇÃO ESPECIAL"
    },
    {
      "id": "p_intro",
      "type": "intro",
      "title": "Um Olá Especial",
      "highlight": "para Você!",
      "text": "Seja muito bem-vindo(a) a este espaço que preparei com tanto carinho!\n\nEste e-book nasceu do desejo de trazer ainda mais praticidade para o seu dia a dia na busca por uma alimentação equilibrada. Sei que a rotina pode ser desafiadora, e foi pensando exatamente nisso que reuni aqui as minhas melhores receitas.\n\nCom carinho, Luiza\nNUTRIÇÃO & LIFESTYLE"
    },
    {
      "id": "p_toc",
      "type": "toc",
      "title": "SUMÁRIO",
      "tocPageNumber": 1
    },
    {
      "id": "p_toc_1767026692975_2",
      "type": "toc",
      "title": "SUMÁRIO",
      "tocPageNumber": 2
    },
    {
      "id": "p_toc_1767026692975_3",
      "type": "toc",
      "title": "SUMÁRIO",
      "tocPageNumber": 3
    },
    {
      "id": "p_toc_1767026692975_4",
      "type": "toc",
      "title": "SUMÁRIO",
      "tocPageNumber": 4
    },
    {
      "id": "p_toc_1767026692975_5",
      "type": "toc",
      "title": "SUMÁRIO",
      "tocPageNumber": 5
    },
    {
      "id": "p_legend",
      "type": "legend",
      "title": "LEGENDAS",
      "text": "Estas legendas foram criadas para facilitar a sua organização. Identifique rapidamente em qual refeição cada receita se encaixa melhor no seu dia a dia."
    },
    {
      "id": "p_final",
      "type": "intro",
      "title": "Bom Apetite!",
      "highlight": "Transformação Deliciosa",
      "text": "Que este guia seja o início de uma transformação deliciosa na sua vida.\n\nwww.lumts.com"
    },
    {
      "id": "p_1766761716873",
      "type": "recipe",
      "title": "PANQUECA FIT",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "2 PANQUECAS",
      "nutrition": {
        "cal": "110",
        "prot": "5g",
        "carb": "7g",
        "fat": "5g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Massa",
          "items": "2 ovos (ou 1, se preferir)\n30g de farinha de aveia\n2 colheres de sopa de leite (ou substitua por água ou leite vegetal)\n1 colher de chá de queijo parmesão ralado (opcional)\nSal a gosto"
        },
        {
          "title": "Molho",
          "items": "1 tomate\n1/4 de cebola\nÁgua (quanto baste para bater o molho)\n1 colher de sopa de extrato de tomate (ou passata)\nSal, cebola em pó, alho, salsa e páprica defumada (a gosto)"
        }
      ],
      "prepSteps": "Prepare a massa: Bata os ovos, farinha de aveia, leite, queijo parmesão (se for usar) e sal no liquidificador ou misture bem até formar uma massa homogênea.\nDespeje a massa em uma frigideira quente e antiaderente. Quando a massa mudar de cor, vire para dourar do outro lado.\nPrepare o molho: Bata o tomate, a cebola e a água no liquidificador.\nTransfira para uma panela, adicione o extrato de tomate e tempere com sal, cebola em pó, alho, salsa e páprica defumada.\nCozinhe até o molho engrossar.\nMonte e sirva: Recheie as panquecas com frango, carne moída, sardinha ou até doce de leite, se preferir uma versão doce.\nSirva com o molho por cima.",
      "tips": "Faça o molho em maior quantidade para usar em pizza fit, lasanha fit ou outros pratos durante a semana. Armazene no congelador.",
      "storage": "Geladeira: Pode ser armazenado por até **5 dias** em potes bem fechados.\nEvite congelar: A textura pode ser alterada.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "prep-heavy",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766762058162",
      "type": "recipe",
      "title": "OVERNIGHT OATS",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "1 PORÇÃO",
      "nutrition": {
        "cal": "173",
        "prot": "8.5g",
        "carb": "21.6g",
        "fat": "7.2g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes Principais",
          "items": "1 colher de sopa de aveia (por pote)\n1 colher de sopa de chia (por pote)\n4 a 6 colheres de sopa de iogurte natural (por pote)\nAdoçante a gosto (mel, leite condensado ou estévia)\nFrutas para finalizar (veja sugestões abaixo)\nLeite (Opcional: se desejar complementar a textura)"
        }
      ],
      "prepSteps": "Prepare a base: Distribua a aveia e a chia nos potinhos individuais.\nAdicione o iogurte e o leite (se necessário): Coloque 4 colheres de sopa de iogurte natural em cada pote. Se preferir uma consistência mais líquida, adicione até 2 colheres de sopa de leite.\nAdoce a gosto: Use adoçante, mel ou leite condensado, conforme sua preferência. Se usar estévia, 2 gotas são suficientes para adoçar 180ml de líquido.\nEscolha as frutas e finalize Opções de combinação: Abacaxi com coco ralado - Mamão -Banana com canela\nArmazene e consuma: Leve à geladeira de um dia para o outro antes de consumir. Pode ser armazenado por até 7 dias, garantindo um lanche saudável para toda a semana.",
      "tips": "Esses valores são para a base do Overnight Oats. Caso adicione frutas, os valores podem variar conforme a escolha.",
      "storage": "Geladeira: Pode ser armazenado por até **7 dias** em potes bem fechados.\nEvite congelar: A textura pode ser alterada devido à presença do iogurte e das frutas.",
      "image": "",
      "videoLink": "",
      "layout": "4",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "prep-heavy",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766762211688",
      "type": "recipe",
      "title": "WAFFLE DOCE",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "1 PORÇÃO",
      "nutrition": {
        "cal": "294",
        "prot": "10.7g",
        "carb": "44g",
        "fat": "9.8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 banana madura amassada\n1 ovo\n2 colheres de sopa de farelo ou farinha de aveia\n(Opcional) Gotas de chocolate 70%"
        }
      ],
      "prepSteps": "Misture os ingredientes: Amasse bem a banana e misture com o ovo até formar um creme homogêneo.\nAdicione a aveia: Acrescente a farinha ou farelo de aveia e misture bem.\n(Opcional) Adicione chocolate: Se desejar, adicione algumas gotas de chocolate para um toque extra de sabor.\nAsse na maquininha de waffle: Despeje a massa na máquina e asse por cerca de 3 minutos, até dourar.\nAlternativa na frigideira: Caso não tenha a máquina, despeje a massa em uma frigideira antiaderente e cozinhe em fogo baixo até dourar. Lembre-se de virar o lado do waffle para assar os dois lados por igual.",
      "tips": "Os valores da tabela correspondem a **1 waffle**. 😉",
      "storage": "",
      "image": "",
      "videoLink": "",
      "layout": "9",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "prep-heavy",
      "tipPlacement": "hidden",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766763177033",
      "type": "recipe",
      "title": "WAFFLE SALGADO",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "1 WAFFLE",
      "nutrition": {
        "cal": "306",
        "prot": "12g",
        "carb": "41g",
        "fat": "11g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 ovo\n3 colheres de sopa de tapioca ou polvilho azedo\n1 fatia de queijo muçarela\nSal a gosto"
        }
      ],
      "prepSteps": "Misture os ingredientes: Em uma tigela, misture o ovo com a tapioca (ou polvilho) até obter uma massa homogênea, sem grumos.\nAdicione o queijo: Pique ou rasgue a fatia de muçarela e misture na massa.\nAsse na maquininha de waffle: Despeje a massa na máquina de waffles, sem encher muito, pois ela incha ao assar. Feche e aguarde aproximadamente 3 minutos.\nAlternativa na frigideira: Caso não tenha a máquina de waffle, despeje a massa em uma frigideira antiaderente e cozinhe em fogo baixo até dourar os dois lados.",
      "tips": "Não encha demais a máquina de waffle, pois a massa **incha** ao assar.",
      "storage": "",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766763742478",
      "type": "recipe",
      "title": "MILKSHAKE PROTEICO",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS (LM, LT)",
      "code": "CM, LT",
      "yield": "1 Porção",
      "nutrition": {
        "cal": "160",
        "prot": "28g",
        "carb": "10g",
        "fat": "2g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 litro de iogurte natural (caseiro ou industrializado)\n180g de whey protein sem sabor (30g por porção)\n200g de morangos (ou outra fruta de sua preferência, como geleia ou maracujá)\n2 colheres de sopa de xilitol (ou outro adoçante da sua preferência)\n½ pacote de gelatina diet sem sabor (opcional, para dar mais cremosidade)"
        }
      ],
      "prepSteps": "Em um recipiente grande, misture o iogurte natural com o whey protein até obter uma textura homogênea.\nAdicione os morangos e o xilitol, e bata tudo com um mixer ou no liquidificador até ficar bem cremoso.\nSe quiser uma textura mais consistente, acrescente a gelatina diet dissolvida conforme as instruções da embalagem. Misture bem e distribua em potinhos individuais.",
      "tips": "",
      "storage": "Geladeira: Até **3 dias**.\nCongelador: Até **30 dias**. Agite antes de consumir.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766763904041",
      "type": "recipe",
      "title": "MILK SHAKE DE CAFÉ",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "1 PORÇÃO",
      "nutrition": {
        "cal": "147",
        "prot": "6g",
        "carb": "8g",
        "fat": "6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "6 cubos de café congelado (café extra forte previamente congelado em forminhas de gelo)\n200ml de leite (integral, desnatado ou vegetal)\n2 colheres de sopa de cacau em pó ou achocolatado com baixo teor de açúcar\nAdoçante a gosto (se usar cacau puro)"
        }
      ],
      "prepSteps": "Congele o café extra forte em cubinhos de gelo para garantir uma bebida mais cremosa.\nNo liquidificador, adicione os cubos de café, o leite e o cacau em pó.\nBata bem até obter um milkshake espesso e homogêneo.\nSe quiser uma textura ainda mais cremosa, leve ao congelador por mais 20 a 30 minutos antes de consumir.",
      "tips": "Os valores da tabela correspondem a **1 milk shake**😉",
      "storage": "O milkshake deve ser consumido na hora para manter a textura cremosa. Caso sobre, pode ser armazenado no congelador, mas precisará ser batido **novamente** antes de beber.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766763973890",
      "type": "recipe",
      "title": "PÃO COM CARNE MOÍDA",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "1 PORÇÃO",
      "nutrition": {
        "cal": "340",
        "prot": "30g",
        "carb": "29g",
        "fat": "11g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Para o lanche",
          "items": "1 pão francês (aprox. 150 kcal)\n100g de carne moída\nSal e pimenta-do-reino a gosto\nFio de azeite de oliva"
        },
        {
          "title": "Para o molho cremoso",
          "items": "1 colher de sopa de requeijão cremoso light\n1 colher de chá de mostarda\n1 colher de chá de ketchup (opcional)"
        }
      ],
      "prepSteps": "Prepare a carne: Tempere a carne moída com sal e pimenta-do-reino. Misture bem.\nLeve uma frigideira ao fogo com um fio de azeite e adicione a carne já espalhada no formato do pão.\nPrepare o pão: Corte o pão ao meio e leve à frigideira para dourar levemente, com o lado interno virado para baixo.\nFaça o molho: Misture o requeijão, a mostarda e o ketchup até formar um creme homogêneo. Ajuste a quantidade conforme seu gosto.\nMonte o lanche: Quando a carne estiver dourada e o pão tostado, monte o sanduíche com a carne e o molho. Sirva quente.",
      "tips": "",
      "storage": "Geladeira: Até 2 dias, com os ingredientes armazenados separadamente.\nFreezer: **Não recomendado** para o pão francês (pode perder a textura ao descongelar).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764053982",
      "type": "recipe",
      "title": "CREPIOCA",
      "category": "CAFÉ DA MANHÃ E LANCHES RÁPIDOS",
      "code": "CM, LT",
      "yield": "1 porção",
      "nutrition": {
        "cal": "200",
        "prot": "8g",
        "carb": "15g",
        "fat": "9g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "INGREDIENTES",
          "items": "1 ovo\n2 colheres de sopa de tapioca\n½ colher de sopa de requeijão cremoso light (opcional, mas dá um toque especial)\nSal a gosto"
        }
      ],
      "prepSteps": "Misture os ingredientes: Em um bowl, adicione o ovo, a tapioca, o requeijão e o sal. Misture tudo até ficar homogêneo.\nAqueça a frigideira: Use uma frigideira antiaderente (sem necessidade de óleo). Deixe em fogo baixo.\nCozinhe a crepioca: Despeje a mistura na frigideira e deixe cozinhar até firmar e mudar de cor. Vire com uma espátula para dourar o outro lado.\nRecheie a gosto (ou não): Você pode comer pura ou rechear com frango, queijo, doce de leite fit, pasta de amendoim ou o que quiser.",
      "tips": "Informações nutricionais para uma crepioca.",
      "storage": "Geladeira: Até **1 dia**, em pote fechado (sem recheio).\nCongelamento: Não recomendado — melhor sempre fazer na hora para manter a textura.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764114103",
      "type": "recipe",
      "title": "SANDUÍCHE NATURAL",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "1 Sanduíche",
      "nutrition": {
        "cal": "237",
        "prot": "18.2g",
        "carb": "23g",
        "fat": "5.8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "INGREDIENTES",
          "items": "40g Frango desfiado (cozido)\n20g Requeijão cremoso light\n2 fatias de Pão integral\nMilho verde (opcional)"
        }
      ],
      "prepSteps": "Em um recipiente misture todos os ingredientes e adicione no pão.\nEnrole o sanduíche com plástico filme.",
      "tips": "",
      "storage": "No congelador por até **3 meses**.\nNa geladeira por até **6 dias** (se preocupar em manter na parte mais fria possível).\nPara congelar não pode colocar a salada.\nPara descongelar, deixar descongelando na geladeira inicialmente e retira da geladeira alguns minutinhos antes de comer (eu não esquento).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764421953",
      "type": "recipe",
      "title": "MINI PIZZA FIT",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "12 disquinhos",
      "nutrition": {
        "cal": "30",
        "prot": "1.5g",
        "carb": "4g",
        "fat": "0.8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "INGREDIENTES",
          "items": "90g de farinha de aveia\n80g de iogurte natural\nUma pitadinha de sal\nRecheio de sua preferência (sugestão: molho caseiro, queijo muçarela, frango desfiado e orégano)"
        }
      ],
      "prepSteps": "Prepare a massa: Misture a farinha de aveia, o iogurte natural e uma pitada de sal em uma tigela. Misture bem até obter uma massa que possa ser modelada com as mãos. Se a massa estiver seca, adicione mais um pouquinho de iogurte até atingir o ponto certo.\nModele a massa: Trabalhe a massa até que fique lisa e uniforme. Abra a massa em uma superfície lisa e corte os disquinhos com um objeto circular (como um copo). Modele com as mãos para que fiquem bem fininhos, assim a massa ficará mais crocante.\nPré-asse: Leve os disquinhos ao forno pré-aquecido a 180°C por 8 minutos.\nRecheie: Passe o molho caseiro sobre os disquinhos pré-assados. Adicione o queijo muçarela e o recheio de sua preferência (sugestão: frango desfiado). Finalize com orégano por cima.\nAsse novamente: Leve as mini pizzas ao forno a 200°C por 20 minutos, ou até o queijo derreter e a massa ficar crocante.",
      "tips": "Faça o molho em maior quantidade para usar em pizza fit, lasanha fit ou outros pratos durante a semana. \"**Façam, que eu tenho certeza que vocês vão amar!**\" 😉",
      "storage": "Geladeira: Pode ser armazenado por até **5 dias** em potes bem fechados.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "prep-heavy",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764546540",
      "type": "recipe",
      "title": "TORTINHA DE FRANGO FIT",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "5-6 tortinhas",
      "nutrition": {
        "cal": "120",
        "prot": "10g",
        "carb": "5g",
        "fat": "6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "INGREDIENTES",
          "items": "2 ovos (bata bem para evitar sabor forte ou peneire as gemas)\n2 colheres de sopa de farinha de aveia (ou farelo de aveia)\nFrango Desfiado 150g\n1 colher de sopa de requeijão cremoso light (opcional, para dar cremosidade)\n1 colher de chá de fermento em pó\nSal a gosto\nQueijo muçarela (opcional, para finalizar)"
        }
      ],
      "prepSteps": "Prepare a massa: Bata os ovos em uma tigela, adicione a farinha de aveia e misture. Acrescente o recheio frango desfiado e o requeijão, se desejar. Misture até ficar homogêneo. Adicione o fermento, sal e misture delicadamente.\nPrepare as forminhas: Use forminhas de silicone ou outro recipiente que possa ir ao forno. Se não for de silicone, unte e enfarinhe.\nAsse: Forno pré-aquecido a 180°C por 25 minutos ou air fryer a 200°C por 15 minutos.",
      "tips": "Adicione queijo muçarela por cima antes de assar, se quiser, para um toque especial.😉",
      "storage": "Geladeira: Até **3 dias**, em pote fechado.\nFreezer: Até **30 dias**, armazenadas em potes ou saquinhos zip. Para consumir, descongele na geladeira e reaqueça na airfryer.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764610209",
      "type": "recipe",
      "title": "TORTINHA DE FRANGO FIT II",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "5-6 tortinhas",
      "nutrition": {
        "cal": "120",
        "prot": "10g",
        "carb": "5g",
        "fat": "6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "INGREDIENTES",
          "items": "2 ovos\n2 colheres de sopa de tapioca\n150g de frango desfiado (ou sardinha, ou carne moída)\n1 colher de sopa de requeijão cremoso light\n1 colher de chá de fermento em pó\nSal a gosto\nQueijo muçarela (opcional, para gratinar)\nOrégano a gosto (opcional)"
        }
      ],
      "prepSteps": "Prepare a base: Em um bowl, quebre os ovos e bata bem com um garfo ou fouet para tirar o sabor forte.\nMisture os ingredientes: Adicione a tapioca, o frango desfiado, o requeijão, o sal, o fermento e misture tudo até formar uma massa cremosa.\nMonte as tortinhas: Distribua a massa em forminhas de silicone ou outro recipiente que possa ir ao forno/airfryer (unte se necessário).\nFinalize: Se quiser, adicione queijo muçarela por cima e salpique orégano.\nAsse: Leve ao forno( ou airfry) preaquecido a 180°C por 25 minutos ou até dourar.",
      "tips": "",
      "storage": "Geladeira: Até **3 dias**, em pote fechado.\nFreezer: Até **30 dias**, armazenadas em potes ou saquinhos zip. Para consumir, descongele na geladeira e reaqueça na airfryer.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764672419",
      "type": "recipe",
      "title": "FRANGO EMPANADO",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "202",
        "prot": "25g",
        "carb": "12g",
        "fat": "5.6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "INGREDIENTES",
          "items": "3 ovos\nFlocão de milho (para empanar)\n2 filés de frango cortados mais grossinhos\n1 pitada de sal\n1 colher de chá de páprica defumada\n1 pitada de pimenta-do-reino (ou lemon pepper)\n1 colher de sopa de azeite (para pincelar)"
        }
      ],
      "prepSteps": "Prepare os ingredientes: Bata os ovos em uma tigela até ficarem bem misturados. Em outra tigela, adicione o flocão de milho e tempere com sal, páprica e pimenta-do-reino.\nEmpane o frango: Tempere os filés de frango, passe-os nos ovos batidos e, em seguida, no flocão de milho. Para obter uma casquinha crocante, repita esse processo mais uma vez.\nAsse na Airfryer: Pincele azeite em ambos os lados do frango para garantir crocância. Asse a 180°C por 12 minutos, vire os filés e asse por mais 12 minutos até dourar.\nSirva: Esse frango combina perfeitamente com sanduíches, saladas ou até mesmo em uma versão saudável de frango à parmegiana.",
      "tips": "Pode ser assado no **forno** também! Basta assar a 180°C por 25 minutos, virando na metade do tempo.",
      "storage": "",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766764764802",
      "type": "recipe",
      "title": "FRANGO CREMOSO COM BRÓCOLIS",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "226",
        "prot": "15g",
        "carb": "17.4g",
        "fat": "8.2g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Para o frango",
          "items": "1 dente de alho grande picado\n½ cebola média picada\n500g de frango em cubos\nPimenta-do-reino a gosto\nSal a gosto\n200g de brócolis pré-cozido (ou fresco)"
        },
        {
          "title": "Para o creme de batata",
          "items": "4 batatas grandes cozidas\n200g de requeijão cremoso light"
        }
      ],
      "prepSteps": "Em uma panela, refogue o alho e a cebola até dourarem.\nAdicione o frango cortado em cubos, tempere com sal e pimenta-do-reino e cozinhe com a tampa fechada até soltar água.\nRetire a tampa e deixe dourar até o caldo secar.\nAcrescente o brócolis pré-cozido e misture bem.\nBata as batatas cozidas com o requeijão no liquidificador ou mixer até obter um creme homogêneo.\nMisture o creme de batata ao frango com brócolis ou sirva separadamente.",
      "tips": "Para um toque extra, adicione queijo por cima e leve à **Air Fryer** ou ao **forno** para gratinar.",
      "storage": "Geladeira: Pode ser armazenado por até **3 dias** em potes fechados.\nCongelador: Até **30 dias**, porém a textura do creme pode ser levemente alterada após o descongelamento.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": "center"
    },
    {
      "id": "p_1766764944847",
      "type": "recipe",
      "title": "FRANGO COM CREME DE BATATA",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "95",
        "prot": "9.8g",
        "carb": "15.3g",
        "fat": "4.2g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Para o frango:",
          "items": "500g de frango em cubos (ou desfiado)\n3 dentes de alho picados\n1 cebola média picada\n1 colher de chá de pimenta-do-reino\n1 colher de chá de páprica defumada\n1 colher de chá de chimichurri\nSal a gosto\n100ml de molho de tomate caseiro (ou extrato de tomate)\nÁgua suficiente para cobrir o frango\n1 punhado de coentro (ou cebolinha)"
        },
        {
          "title": "Para o creme de batata:",
          "items": "1kg de batata inglesa\n100ml da água do cozimento das batatas\n2 colheres de sopa de requeijão cremoso light (ou caseiro)\n2 colheres de sopa de queijo parmesão ralado\nSal a gosto"
        }
      ],
      "prepSteps": "Cozinhe as batatas: Cozinhe as batatas até ficarem bem macias. Reserve um pouco da água do cozimento.\nPrepare o frango: Em outra panela, refogue o alho e a cebola. Adicione os temperos (pimenta-do-reino, páprica, chimichurri e sal). Acrescente o frango em cubos e misture bem.\nCozinhe o frango: Adicione o molho de tomate e misture. Cubra com água e cozinhe até o frango ficar macio. Se preferir desfiado, corte os cubos maiores e desfie após o cozimento. Finalize com coentro ou cebolinha.\nFaça o creme de batata: No liquidificador, bata as batatas cozidas com a água reservada até formar um creme liso.\nFinalize o creme: Transfira para a panela, adicione o requeijão, o queijo parmesão e ajuste o sal. Cozinhe até engrossar.\nMonte e sirva: Sirva o frango com o creme de batata por cima. Para um toque especial, coloque queijo ralado por cima e leve ao forno para gratinar.",
      "tips": "Para deixar o creme mais saboroso, substitua parte da água do cozimento por **leite**.\nPara uma versão mais fit, use requeijão **caseiro ou iogurte natural** no creme de batata.",
      "storage": "Pode ser armazenado na geladeira por até **3 dias** em recipiente hermético.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766765390435",
      "type": "recipe",
      "title": "TIRAS DE CARNE COM CREME DE BATATA",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "298",
        "prot": "27g",
        "carb": "26g",
        "fat": "10g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Para o Creme de Batata:",
          "items": "4 batatas médias descascadas e cortadas\n150g de requeijão cremoso light\n100ml da água do cozimento (ou leite)\nSal a gosto"
        },
        {
          "title": "Para a Carne:",
          "items": "500g de carne em tiras (corte macio)\n1 colher de chá de pimenta-do-reino\n1 colher de chá de colorau\nSal a gosto\n2 dentes de alho picados\n1 cebola média cortada em tiras"
        },
        {
          "title": "Para Gratinar:",
          "items": "4 fatias de queijo muçarela"
        }
      ],
      "prepSteps": "Prepare o Creme de Batata: Cozinhe as batatas até ficarem bem macias. Bata no liquidificador com a água do cozimento até obter um creme liso. Se preferir, use leite líquido no lugar da água. Acrescente o requeijão, ajuste o sal e misture até começar a borbulhar.\nPrepare a Carne: Tempere a carne com pimenta-do-reino, colorau, alho e sal. Leve para fritar em fogo médio, mexendo sempre, até dourar e secar o caldo que se formar. Acrescente a cebola em tiras e refogue até ficar macia.\nMonte e Gratine: Disponha a carne em uma travessa ou divida diretamente nas marmitas. Cubra com o creme de batata e finalize com as fatias de muçarela. Leve ao forno pré-aquecido a 200°C por 10 minutos ou até gratinar.",
      "tips": "",
      "storage": "Geladeira: até **4 dias** em potes herméticos.\nCongelador: até **3 meses** (preferencialmente sem o queijo gratinado).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766766226694",
      "type": "recipe",
      "title": "HAMBÚRGUER FIT",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "6 hambúrgueres",
      "nutrition": {
        "cal": "297",
        "prot": "28g",
        "carb": "24g",
        "fat": "9g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "900g de patinho moído (rende 6 hambúrgueres)\n2 dentes de alho picados\n1 colher de chá de pimenta-do-reino\nSal a gosto\n1 colher de sopa de água (para dar suculência na carne ao fritar)"
        }
      ],
      "prepSteps": "Modele os Hambúrgueres: Tempere a carne moída com alho, pimenta-do-reino e sal. Misture bem para distribuir os temperos.\nDivida a carne em 6 porções de 150g e pese cada uma com o auxílio de uma balança coberta com plástico filme. Modele os hambúrgueres manualmente ou utilizando um modelador.\nResfrie para Firmar: Coloque os hambúrgueres no congelador por alguns minutos antes de fritar. Isso ajuda a manter o formato e evitar que desmanchem na frigideira.\nGrelhe os Hambúrgueres: Aqueça uma frigideira antiaderente e adicione um pouco de água para manter a carne suculenta. Grelhe cada hambúrguer em fogo médio-alto até dourar bem dos dois lados.",
      "tips": "Informações Nutricionais considerando a **Montagem de um Hambúrguer Completo** (um blend de 150g de carne, pão e complementos)",
      "storage": "**Geladeira**: Até 3 dias em recipiente fechado.\n**Congelador**: Até 3 meses, embalados individualmente em plástico filme ou saquinhos próprios.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766766510231",
      "type": "recipe",
      "title": "CROQUETE DE FRANGO",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "12 unidades",
      "nutrition": {
        "cal": "67.8",
        "prot": "6g",
        "carb": "4.8g",
        "fat": "1.9g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Massa e Recheio",
          "items": "300g de batata cozida e amassada\n250g de frango cozido e desfiado\nQueijo muçarela para rechear (opcional)"
        }
      ],
      "prepSteps": "misturar a batata cozida e amassada com o frango cozido e desfiado até formar uma massa homogênea\nabrir a massa, rechear com o pedacinho de queijo (opcional) e modelar o croquete\n[Método Forno] Pré-aqueça a 200°C e asse por 25 a 30 minutos, virando na metade do tempo para dourar por igual\n[Método Airfryer] Pré-aqueça a 200°C e asse por 12 a 15 minutos, virando os croquetes na metade do tempo para garantir crocância uniforme",
      "tips": "Para deixar o croquete ainda mais douradinho e crocante, pincele uma camada fina de **azeite** ou **gema de ovo batida** por cima antes de levar ao forno ou airfryer.",
      "storage": "**Geladeira**: até 4 dias em pote hermético.\n**Congelador**: até 1 mês (pode congelar cru ou assado).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766766585292",
      "type": "recipe",
      "title": "MACARRÃO CREMOSO COM BRÓCOLIS",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "100g",
      "nutrition": {
        "cal": "104.3",
        "prot": "8.2g",
        "carb": "9.8g",
        "fat": "4.3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Frango e molho",
          "items": "1kg de peito de frango em cubos\n1 cebola média picada\n2 dentes de alho picados\n1 colher de chá de pimenta-do-reino\n1 colher de chá de páprica defumada\n1 colher de chá de tempero seco (cebola, alho e salsa)\n120g de requeijão cremoso light\n100ml de água do cozimento do macarrão\n½ caixinha de creme de leite\nSal a gosto"
        },
        {
          "title": "Macarrão e brócolis",
          "items": "300g de macarrão penne cozido\n1 brócolis médio cozido no vapor e picado"
        }
      ],
      "prepSteps": "Refogue a cebola e o alho até dourar, depois acrescente os temperos e misture bem.\nAdicione o frango em cubos e deixe cozinhar até ficar bem dourado.\nAcrescente o brócolis picado, o requeijão cremoso e o creme de leite, misturando até formar um molho cremoso.\nPor fim, adicione um pouco da água do cozimento do macarrão para ajustar a consistência.\nSe for pesar as porções para sua dieta, pese o macarrão e o frango separadamente antes de misturar. Depois, misture tudo ou armazene separadamente nas marmitinhas.\nPara um toque especial, cubra com queijo muçarela e leve ao forno ou air fryer até gratinar. Agora é só aproveitar!",
      "tips": "Para deixar o croquete ainda mais **douradinho e crocante**, pincele uma camada fina de azeite ou gema de ovo batida por cima antes de levar ao forno ou airfryer.",
      "storage": "Geladeira: Armazene por até **7 dias** na parte mais fria.\nCongelamento: **Não recomendado** devido à mudança de textura.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766766714955",
      "type": "recipe",
      "title": "ARROZ COM FRALDINHA DESFIADA",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "200g",
      "nutrition": {
        "cal": "285",
        "prot": "21g",
        "carb": "32g",
        "fat": "7g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "500g de fraldinha\n1 cebola média picada\n1 tomate picado\n½ pimentão vermelho picado\n2 xícaras de chá de arroz cru\n½ xícara de chá de passata, extrato ou molho de tomate\n1 colher de chá de pimenta-do-reino\n1 colher de chá de páprica defumada\n1 colher de chá de tempero seco de cebola, alho e salsa\nSal a gosto\nÁgua suficiente para cobrir a carne\nCoentro e cebolinha a gosto (opcional)"
        }
      ],
      "prepSteps": "Prepare a carne: Aqueça uma panela de pressão e sele a fraldinha dos dois lados até dourar bem. Em seguida, adicione a cebola, o tomate e o pimentão. Tempere com pimenta-do-reino, páprica defumada e tempero seco de cebola, alho e salsa. Acrescente água até cobrir completamente a carne, adicione sal e tampe a panela. Cozinhe na pressão por 1 hora.\nDesfie a carne: Após o tempo de cozimento, retire a pressão e desfie a carne. Se estiver usando uma panela de pressão tradicional, tampe novamente e sacuda a panela para desfiar mais rápido.\nFinalize com o arroz: Volte a carne desfiada para a panela junto com o caldo do cozimento. Adicione a passata ou molho de tomate e misture bem. Acrescente o arroz, misture novamente e tampe a panela. Cozinhe na pressão por 10 minutos. Se estiver usando uma panela de pressão tradicional, cozinhe de 5 em 5 minutos, verificando o ponto do arroz para evitar que passe do ponto.",
      "tips": "",
      "storage": "Geladeira: Armazene em **potes herméticos** por até **5 dias**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766767201805",
      "type": "recipe",
      "title": "COXINHA FIT",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "Essa receita rende aproximadamente 9 coxinhas",
      "nutrition": {
        "cal": "55",
        "prot": "5g",
        "carb": "6.6g",
        "fat": "1.3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "300g de batata inglesa (cozida e amassada)\n150g de frango desfiado\nColorau (opcional, para dar cor)\nQueijo (a gosto, para recheio)"
        }
      ],
      "prepSteps": "Cozinhe e amasse bem as batatas até formar um purê.\nAdicione o frango desfiado à batata e misture bem até obter uma massa homogênea.\n(Opcional) Acrescente um pouco de colorau para dar um toque de cor.\nDivida a massa em porções de 50g e modele bolinhas:\nAbra cada bolinha no formato de um disco e adicione um pouco de queijo no centro.\nFeche bem cada bolinha e repita o processo até usar toda a massa.\nDisponha os bolinhos em uma assadeira.\nLeve ao forno pré-aquecido a 180°C por 20 minutos, ou asse na air fryer a 200°C por 15-20 minutos.\nRetire do forno e aproveite! 🥰",
      "tips": "LT, J (PETISCO/ENTRADA)",
      "storage": "Geladeira: Até **3 dias** em pote bem fechado.\nCongelador: Até **30 dias**, já assadas ou ainda cruas (recomendo congelar sem queijo para melhor textura).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766767275612",
      "type": "recipe",
      "title": "PASTELZINHO FIT",
      "category": "Salgados e Refeições",
      "code": "CM, LT",
      "yield": "Aproximadamente 6 pasteizinhos",
      "nutrition": {
        "cal": "150",
        "prot": "10g",
        "carb": "15g",
        "fat": "4g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Massa",
          "items": "500g de batata-doce (cozida e amassada)\n3 colheres de sopa (30g) de farinha de aveia\n1 colher de sopa (10g) de manteiga\n1 colher de chá de sal\n1 colher de sopa de requeijão cremoso (opcional, se a massa estiver seca)"
        },
        {
          "title": "Recheio e Finalização",
          "items": "1 gema de ovo (para pincelar)\n30g de frango desfiado (cozido e temperado a gosto)\n10-15g de queijo muçarela (ralado ou em pedacinhos)"
        }
      ],
      "prepSteps": "Cozinhe a batata-doce até que fique macia e amasse bem, formando um purê.\nAdicione a manteiga e misture até incorporar. Acrescente a farinha de aveia e o sal, mexendo até a massa ficar homogênea e atingir o ponto em que seja possível abri-la. Se necessário, adicione o requeijão cremoso para dar mais liga.\nForre um prato ou bancada com plástico filme e abra a massa sem deixá-la muito fina.\nUse um bowl ou cortador circular para fazer discos da massa.\nColoque 30g de frango desfiado e 10-15g de queijo muçarela no centro de cada disco de massa. Feche bem as bordas para evitar que o queijo vaze ao assar.\nPincele cada pastelzinho com a gema de ovo para dar brilho.\nLeve ao forno pré-aquecido a 180°C por 20 a 25 minutos, ou até os pastéis ficarem dourados. Se preferir, use a air fryer pelo mesmo tempo.",
      "tips": "",
      "storage": "Geladeira: Até 3 dias em pote hermético, preferencialmente sem recheio de queijo (para evitar umidade excessiva).\nCongelador: Até 30 dias, montados e crus (**melhor textura ao assar na hora**).",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766767365801",
      "type": "recipe",
      "title": "CALDINHO DE ABÓBORA COM FRANGO",
      "category": "Sopas e Caldos",
      "code": "CM, LT",
      "yield": "A, J",
      "nutrition": {
        "cal": "270",
        "prot": "34g",
        "carb": "20g",
        "fat": "5.8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes Principais",
          "items": "1 kg de abóbora\n500g de batata\n200 ml de água do cozimento dos legumes\n1 cebola inteira\n40g de bacon (opcional)\n4 colheres de sopa de extrato de tomate\nTempero a gosto: pimenta vermelha, sal, coentro, páprica defumada, chimichurri\n400 ml de água adicional para o caldo\n100g de frango cozido por porção"
        }
      ],
      "prepSteps": "Cozinhe a abóbora e a batata até ficarem macias. Leve ao liquidificador com 200 ml da água do cozimento para formar um creme homogêneo.\nEm uma panela, refogue a cebola e o bacon (se utilizar). Adicione o creme de abóbora e batata à panela.\nAcrescente o extrato de tomate e tempere a gosto com pimenta vermelha, sal, coentro, páprica defumada e chimichurri.\nAdicione 400 ml de água e cozinhe por alguns minutos. Ajuste o sal e temperos, se necessário.\nSirva separando 300g do caldo e adicionando 100g de frango cozido em cada porção para garantir a quantidade certa de proteínas.",
      "tips": "",
      "storage": "**Geladeira:** até 6 dias em pote fechado.\n**Congelador:** até 3 meses.",
      "image": "",
      "videoLink": "",
      "layout": "7",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766767483134",
      "type": "recipe",
      "title": "CALDINHO DE LEGUMES",
      "category": "Sopas e Caldos",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "202",
        "prot": "25g",
        "carb": "12g",
        "fat": "5.6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "800g de batata inglesa\n500g de chuchu\n200g de cenoura\n500g de carne moída\n3 dentes de alho picados\n1 cebola média picada\nPimenta-do-reino, páprica defumada a gosto\nSal a gosto\n1 punhado de coentro (ou outra erva de sua preferência)\nÁgua suficiente para cozinhar os legumes"
        }
      ],
      "prepSteps": "Cozinhe os legumes: Em uma panela grande, cozinhe as batatas, o chuchu e a cenoura até ficarem bem macios.\nPrepare o refogado: Em outra panela, refogue a cebola e o alho até dourarem. Acrescente a carne moída, tempere com pimenta-do-reino, páprica defumada e sal. Cozinhe bem.\nBata os legumes: Após o cozimento, reserve um pouco da água do cozimento e bata os legumes no liquidificador até formar um creme homogêneo.\nFinalize: Misture o caldo batido com a carne moída refogada. Ajuste os temperos, acrescente o coentro e, se necessário, adicione um pouco da água do cozimento para obter a consistência desejada.",
      "tips": "",
      "storage": "Geladeira: até **6 dias** em pote fechado.\nCongelador: até **3 meses**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769135250",
      "type": "recipe",
      "title": "CALDINHO DE FRALDINHA",
      "category": "Sopas e Caldos",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "201",
        "prot": "12.2g",
        "carb": "19.9g",
        "fat": "8.6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "500g de fraldinha sem gordura\n2 a 3 dentes de alho picados\n2 tomates picados\n2 cebolas médias picadas\n1,5kg de abóbora\n2 batatas inglesas pequenas\nPáprica defumada, pimenta-do-reino e tempero misto de cebola, alho e salsa a gosto\nÁgua suficiente para cozinhar"
        }
      ],
      "prepSteps": "Prepare a carne: Refogue o alho em uma panela de pressão e sele a fraldinha dos dois lados até dourar. Adicione os tomates, cebolas e os temperos. Cubra com água e cozinhe sob pressão por 30 minutos até a carne ficar macia. Reserve a carne e o caldo do cozimento.\nPrepare o caldo: No caldo reservado, cozinhe a abóbora e as batatas sob pressão por 15 minutos. Bata tudo no liquidificador até formar um creme homogêneo.\nMonte o caldinho: Desfie a carne e misture ao creme de abóbora. Acrescente o caldo do cozimento aos poucos até atingir a consistência desejada. Ajuste os temperos e finalize com coentro. Deixe cozinhar por mais alguns minutos e está pronto!",
      "tips": "",
      "storage": "Geladeira: até **6 dias** em pote fechado.\nCongelador: até **3 meses**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769196446",
      "type": "recipe",
      "title": "SALADA DE GRÃO DE BICO",
      "category": "Acompanhamentos e Saladas",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "145",
        "prot": "10.5g",
        "carb": "13g",
        "fat": "13g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "150g de grão de bico cozido\n50g de cebola roxa\n100g de tomate cereja\n30g de azeitona\n1 lata de atum (120g)\n30g de suco de limão\n1 colher de sopa de azeite de oliva\n10g de cebolinha picada\npimenta calabresa (a gosto)\nsal (a gosto)"
        }
      ],
      "prepSteps": "Prepare o grão de bico: Deixe o grão de bico de molho por 2 horas. Depois, cozinhe na panela de pressão por 15 minutos até ficar bem macio.\nMisture os ingredientes: Em uma tigela grande, adicione o grão de bico cozido, a cebola roxa, o tomate cereja, as azeitonas e o atum.\nTempere: Regue com o suco de limão e o azeite. Acrescente a cebolinha, a pimenta calabresa (ou do reino) e o sal.\nFinalize: Misture bem para que o grão de bico absorva todos os sabores. Sirva imediatamente ou leve à geladeira para realçar ainda mais o sabor.",
      "tips": "Essa salada fica ainda mais gostosa depois de algumas horas na **geladeira**, pois os temperos se intensificam!",
      "storage": "Geladeira: Até 3 dias em pote **hermético**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769270973",
      "type": "recipe",
      "title": "SALADA COM MOLHO DE MOSTARDA E MEL",
      "category": "Acompanhamentos e Saladas",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "52",
        "prot": "3.3g",
        "carb": "15.3g",
        "fat": "2.0g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes Molho",
          "items": "150ml de iogurte natural (pode ser caseiro)\n1 colher de sopa de mostarda\n1 colher de sopa de mel\nSuco de meio limão\nSal a gosto"
        },
        {
          "title": "Base da Salada",
          "items": "2 colheres de sopa de milho verde (~30g)\n1/4 de xícara de cenoura ralada (~25g)\n1/2 xícara de repolho fatiado (~40g)\nFolhas de alface ou outra folha verde de sua preferência (opcional)"
        },
        {
          "title": "Camada superior",
          "items": "1 colher de sopa de cebola roxa picada (~15g)\n3 unidades de tomate cereja cortadas ao meio (~50g)"
        }
      ],
      "prepSteps": "Misture bem todos os ingredientes do molho até obter um molho homogêneo.\nPara a montagem da Salada para conservação, siga a sequência da base para a camada superior (Base da Salada, Camada Superior).",
      "tips": "**Importante:** Os ingredientes devem estar bem secos, sem excesso de água.",
      "storage": "Geladeira: Até **6 dias** em pote hermético.\nMolho: Até **5 dias** refrigerado.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769328109",
      "type": "recipe",
      "title": "SALADA COM MOLHO DE ERVAS",
      "category": "Acompanhamentos e Saladas",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "65",
        "prot": "4.3g",
        "carb": "5.2g",
        "fat": "4.3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes Molho",
          "items": "150ml de iogurte natural (pode ser caseiro)\n½ dente de alho triturado ou bem picado\n1 colher de chá de salsa picada\n½ colher de chá de orégano\nSuco de meio limão\nSal a gosto\n(Opcional: 1 colher de chá de azeite)"
        },
        {
          "title": "Base da Salada",
          "items": "2 colheres de sopa de milho verde (~30g)\n1/4 de xícara de cenoura ralada (~25g)\n1/2 xícara de repolho fatiado (~40g)\nFolhas de alface ou outra folha verde de sua preferência (opcional)"
        },
        {
          "title": "Camada superior",
          "items": "1 colher de sopa de cebola roxa picada (~15g)\n3 unidades de tomate cereja cortadas ao meio (~50g)"
        }
      ],
      "prepSteps": "Misture bem todos os ingredientes do Molho até obter um molho homogêneo.\nPara a Montagem da Salada, siga a sequência (Base para Armazenamento):\nAdicione a Base da Salada.\nAdicione a Camada superior.",
      "tips": "Os ingredientes devem estar **bem secos**, sem excesso de água, para garantir a conservação.\nOs valores nutricionais correspondem a 100g de salada + 25g de molho.",
      "storage": "Salada montada: Até **6 dias** em pote hermético na geladeira.\nMolho: Até **5 dias** refrigerado.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769405077",
      "type": "recipe",
      "title": "BATATA PERFEITA",
      "category": "Acompanhamentos e Saladas",
      "code": "CM, LT",
      "yield": "4 porções",
      "nutrition": {
        "cal": "135",
        "prot": "2.5g",
        "carb": "28g",
        "fat": "3.5g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 batatas médias (ou quantidade desejada)\n1 colher de chá de páprica defumada\nSal a gosto\n1 colher de chá de azeite de oliva extra virgem"
        }
      ],
      "prepSteps": "Prepare as batatas: Descasque as batatas (ou higienize bem para usar com casca). Corte em cubos ou tiras finas – quanto menores, mais crocantes ficarão.\nTempere: Coloque as batatas em um recipiente, adicione a páprica, o sal e o azeite. Tampe e sacuda bem para distribuir o tempero uniformemente.\nAsse na AirFryer: Coloque as batatas na AirFryer e cozinhe por 10 minutos a 150°C. Depois, aumente para a temperatura máxima e asse por mais 20 minutos, sacudindo a cada 5 minutos para dourar uniformemente.\nSirva: Retire e aproveite essa batata crocante por fora e macia por dentro!",
      "tips": "",
      "storage": "Geladeira: Armazene em pote hermético por até **2 dias** para manter a crocância. Para reaquecer, leve novamente à AirFryer por **5 minutos a 200°C**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769503401",
      "type": "recipe",
      "title": "REQUEIJÃO CREMOSO",
      "category": "Acompanhamentos e Saladas",
      "code": "CM, LT",
      "yield": "B (para CM, LM, A, LT, J)",
      "nutrition": {
        "cal": "214",
        "prot": "9.1g",
        "carb": "13.7g",
        "fat": "12.6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 litro de leite (reserve um pouco antes de ferver)\n3 colheres de sopa de vinagre sem sabor ou suco de limão\n1 colher de sopa de margarina ou manteiga\nSal a gosto\n(Opcional) Ervas finas, orégano ou temperos para saborizar"
        }
      ],
      "prepSteps": "Ferva o leite: Aqueça 1 litro de leite até começar a ferver. Antes disso, reserve um pouco do leite para usar depois.\nFaça a coagulação: Adicione o vinagre (ou limão) e mexa até o leite talhar, separando o soro da massa. Assim que o soro subir, desligue o fogo.\nCoe a mistura: Use uma escumadeira ou peneira fina para separar a parte sólida do soro. O soro não será usado nesta receita, mas pode ser aproveitado em outras preparações.\nBata para dar cremosidade: No liquidificador, adicione a massa coada, 1 colher de sopa de manteiga ou margarina e bata até ficar homogêneo.\nAjuste a textura: Acrescente o leite reservado aos poucos, junto com o sal e os temperos opcionais, e continue batendo até atingir a cremosidade desejada.\nArmazene e sirva: Coloque o requeijão em um recipiente fechado e leve à geladeira. Ele ficará mais pastoso depois de refrigerado.",
      "tips": "",
      "storage": "O requeijão pode ser guardado na geladeira por até **7 dias**.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "prep-heavy",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": "center"
    },
    {
      "id": "p_1766769647811",
      "type": "recipe",
      "title": "BRIGADEIRO",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "LT, S",
      "nutrition": {
        "cal": "190",
        "prot": "9g",
        "carb": "26g",
        "fat": "7g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 colheres de sopa de leite em pó\n2 colheres de sopa de chocolate 50% cacau\n1 colher de chá de xilitol (ajuste conforme seu gosto)\nÁgua (adicione aos poucos até atingir uma textura cremosa)"
        }
      ],
      "prepSteps": "Misture os ingredientes: Em uma tigela, adicione o leite em pó, o chocolate 50% e o xilitol.\nAjuste a textura: Adicione água aos poucos e mexa bem até obter um creme homogêneo e levemente líquido.\nCozinhe a mistura: Leve ao fogo baixo, mexendo sempre, até atingir a textura desejada (mais líquida para cobertura ou recheio, mais densa para enrolar).\nFinalize: Se quiser enrolar, deixe esfriar e leve à geladeira por alguns minutos para firmar. Caso prefira brigadeiro de colher, pode consumir logo em seguida.",
      "tips": "Se quiser usar como cobertura para bolos, panquecas ou outras sobremesas, retire do fogo antes de **engrossar muito**. Assim, o brigadeiro fit ficará mais cremoso e fácil de espalhar!",
      "storage": "Geladeira: Armazene em um recipiente fechado por até **3 dias**. Se quiser uma textura mais firme, deixe mais tempo refrigerado.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766769715988",
      "type": "recipe",
      "title": "BRIGADEIRO DE CAFÉ",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "1 brigadeiro",
      "nutrition": {
        "cal": "40",
        "prot": "3g",
        "carb": "7.1g",
        "fat": "0.33g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes Principais",
          "items": "6 colheres de sopa de leite em pó\n2 colheres de sopa de cacau em pó ou achocolatado com baixo teor de açúcar\nCafé extra forte a gosto (adicionado aos poucos)\nAdoçante culinário (caso utilize cacau puro)"
        }
      ],
      "prepSteps": "Em uma panela, misture o leite em pó, o cacau e o adoçante, adicionando o café extra forte aos poucos até formar uma mistura homogênea.\nLeve ao fogo baixo, mexendo constantemente para evitar que grude no fundo da panela.\nContinue mexendo até atingir o ponto de brigadeiro, ou seja, quando a massa começar a soltar do fundo.\nDesligue o fogo e deixe esfriar um pouco antes de modelar as bolinhas.\nPasse no cacau em pó para finalizar.",
      "tips": "Para garantir que o ponto seja atingido corretamente, mantenha o fogo **baixo** e mexa sem parar.",
      "storage": "Armazene os brigadeiros em um recipiente fechado na geladeira por até **5 dias**.\nPara um consumo posterior, eles podem ser congelados por até **30 dias**, devendo ser descongelados na geladeira antes de consumir.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766770241368",
      "type": "recipe",
      "title": "MUFFIN DE CHOCOLATE",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "Rende 4 muffins",
      "nutrition": {
        "cal": "37",
        "prot": "1.8g",
        "carb": "4.5g",
        "fat": "1.8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 ovo\n1 colher de sopa de iogurte natural ou grego\n1 colher de sopa de farinha de aveia (preferencialmente sem glúten)\n3 colheres de sopa de cacau em pó ou achocolatado com baixo teor de açúcar\nAdoçante culinário a gosto\n1 colher de chá de fermento em pó"
        }
      ],
      "prepSteps": "Em uma tigela, bata o ovo até ficar homogêneo.\nAcrescente o iogurte natural, a farinha de aveia, o cacau e o adoçante, misturando bem até obter uma massa lisa.\nAdicione o fermento por último e mexa delicadamente.\nDespeje a massa em forminhas de silicone e leve à AirFryer pré-aquecida a **180°C por 10 minutos**.\nSe preferir, asse no forno a **180°C por 15 a 18 minutos** ou até o palito sair limpo.",
      "tips": "",
      "storage": "Pode ser armazenado em um recipiente fechado na geladeira por até **3 dias**.\nPara manter a textura mais úmida, aqueça no micro-ondas por **10 segundos** antes de consumir.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766770403980",
      "type": "recipe",
      "title": "FLAN DE CHOCOLATE",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "1 porção - 150ml",
      "nutrition": {
        "cal": "105",
        "prot": "5g",
        "carb": "12g",
        "fat": "5g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 pacote de pudim diet (encontrado em supermercados)\n2 colheres de sopa de achocolatado sem açúcar\n500ml de leite (ou conforme instruções do pudim)"
        }
      ],
      "prepSteps": "Prepare o pudim conforme as instruções da embalagem, mexendo bem para evitar grumos.\nAcrescente o achocolatado sem açúcar e misture até obter um sabor mais intenso de chocolate.\nCozinhe até engrossar e atingir a consistência desejada.\nDespeje o flan em potinhos individuais e leve à geladeira até firmar.",
      "tips": "",
      "storage": "Geladeira: **Até 5 dias**\nCongelador: **Não recomendado**, pois pode alterar a textura.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766770510921",
      "type": "recipe",
      "title": "MOUSSE DE CHOCOLATE",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "Aproximadamente 4 porções",
      "nutrition": {
        "cal": "160",
        "prot": "8g",
        "carb": "14g",
        "fat": "6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "250ml de iogurte natural ou iogurte grego\n50g de chocolate ao leite derretido\n4 colheres de sopa de leite em pó integral\n1 colher de sopa de achocolatado com baixo teor de açúcar (ou substitua por whey protein ou cacau em pó)\n1 envelope de gelatina incolor hidratada (opcional, para textura mais firme)"
        }
      ],
      "prepSteps": "Misture o iogurte com o chocolate derretido até obter uma consistência homogênea. Acrescente o leite em pó e o achocolatado, misturando bem. Utilize um mixer ou liquidificador para garantir que fique bem cremoso.\nSe desejar uma textura mais firme, adicione a gelatina incolor hidratada e misture novamente. Distribua o mousse em potinhos individuais e leve à geladeira por algumas horas antes de consumir.",
      "tips": "Para um mousse mais proteico, utilize **whey protein** ou **cacau em pó** no lugar do achocolatado. Certifique-se de que o chocolate derretido não esteja muito quente para não talhar o iogurte.",
      "storage": "Geladeira: Até **5 dias**. Congelador: Até **30 dias**, mas a textura pode ser ligeiramente comprometida ao descongelar.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766772317331",
      "type": "recipe",
      "title": "MOUSSE DE MARACUJÁ",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "Porções semanais",
      "nutrition": {
        "cal": "135",
        "prot": "10.7g",
        "carb": "17g",
        "fat": "5.4g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "400ml de iogurte natural (caseiro ou industrializado)\n2 polpas de maracujá (pode coar ou usar com sementes)\n4 colheres de sopa de leite em pó\n1 gelatina incolor hidratada\nAdoçante a gosto (usei estévia, cerca de 8 dosadores pequenos)"
        }
      ],
      "prepSteps": "Prepare a base: No liquidificador, bata o iogurte, a polpa de maracujá, o leite em pó e o adoçante. Se preferir, coe o maracujá antes de bater.\nAdicione a gelatina: Hidrate a gelatina conforme as instruções da embalagem e adicione à mistura. Bata novamente até obter um creme homogêneo.\nDistribua: Coloque em um recipiente grande ou divida em potinhos individuais para porções semanais.\nGele: Leve à geladeira por pelo menos 1 hora ou ao congelador para firmar mais rápido.\nFinalize: Adicione um pouco de polpa de maracujá por cima para decorar.",
      "tips": "",
      "storage": "**Geladeira**: Até 5 dias.\n**Congelador**: Até 30 dias (recomenda-se descongelar na geladeira antes de consumir).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766772554312",
      "type": "recipe",
      "title": "MOUSSE DE CAFÉ",
      "category": "Doces e Sobremesas",
      "code": "LM, LT, S",
      "yield": "1 mousse",
      "nutrition": {
        "cal": "147",
        "prot": "18g",
        "carb": "12g",
        "fat": "2g"
      },
      "macroNote": "Os valores da tabela correspondem a 1 mousse",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "60ml de café forte\n180ml de iogurte natural ou grego\nGelatina incolor já hidratada\nAdoçante a gosto"
        }
      ],
      "prepSteps": "Dissolva a gelatina incolor conforme as instruções da embalagem. Em seguida, misture todos os ingredientes em um recipiente até formar um creme homogêneo.\nPara um resultado mais aerado, bata a mistura com um mixer ou liquidificador.\nDespeje em potinhos individuais e leve ao congelador por pelo menos 2 horas ou até firmar. O café precisa estar mais forte para intensificar o sabor e equilibrar a doçura do mousse.",
      "tips": "",
      "storage": "Mantenha o flan na geladeira por até **5 dias** em potinhos bem fechados. Se congelado, ele pode durar até **15 dias**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766772672045",
      "type": "recipe",
      "title": "PUDIM",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "100g do pudim fit",
      "nutrition": {
        "cal": "134",
        "prot": "8.7g",
        "carb": "6.2g",
        "fat": "7.6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 ovos\n4 colheres de sopa de leite em pó\n100 ml de leite líquido\n2 colheres e meia de sopa de adoçante forno e fogão"
        },
        {
          "title": "Para a calda",
          "items": "2 colheres de sopa de adoçante (recomendo adoçante forno e fogão)\nUm pouco de água"
        }
      ],
      "prepSteps": "Prepare a base do pudim: Bata os ovos até ficarem homogêneos. Acrescente o leite em pó e misture bem para dissolver completamente. Adicione o leite líquido e o adoçante, misturando até obter uma massa lisa.\nFaça a calda: Em uma panela, coloque o adoçante com um pouco de água e mexa em fogo baixo até caramelizar.\nMonte o pudim: Distribua a calda e a massa do pudim nos recipientes de sua preferência.\nAsse: Air Fryer: 160°C por 15 minutos em banho-maria. Micro-ondas: Aproximadamente 3 minutos. Forno: Assar em banho-maria até firmar.\nResfrie e sirva: Leve à geladeira por pelo menos 1 hora antes de consumir.",
      "tips": "",
      "storage": "Geladeira: Pode ser armazenado por até **3 dias** em potes fechados. Evite congelar, pois pode alterar a textura.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766772786967",
      "type": "recipe",
      "title": "DOCINHO DE UVA",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "1 docinho de uva",
      "nutrition": {
        "cal": "181",
        "prot": "11g",
        "carb": "27.2g",
        "fat": "5.4g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 colheres de sopa de leite em pó\n3 colheres de sopa de iogurte natural\n80g de uva\nCalda de cacau ou chocolate 70% derretido"
        }
      ],
      "prepSteps": "Misture o leite em pó com o iogurte natural até formar um creme homogêneo. Se preferir uma consistência mais líquida, adicione 1 colher de sopa de leite ou água.\nAcrescente as frutas escolhidas e finalize com a calda de cacau ou chocolate derretido. Sirva gelado.",
      "tips": "",
      "storage": "Conserve na geladeira em um pote fechado por até 2 dias.\n**Não é recomendado congelar**, pois pode alterar a textura do creme.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766772886347",
      "type": "recipe",
      "title": "PIPOCA DOCE",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "1 porção",
      "nutrition": {
        "cal": "170",
        "prot": "5g",
        "carb": "30g",
        "fat": "3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "30g de milho de pipoca\n1 pitada de sal\n2 colheres de sopa de leite em pó\n1 colher de sopa de cacau em pó\nAdoçante culinário a gosto"
        }
      ],
      "prepSteps": "Prepare a pipoca normalmente na pipoqueira ou em uma panela com tampa, sem óleo ou com uma pequena quantidade de óleo de coco para evitar que grude.\nEnquanto isso, em uma tigela, misture o leite em pó, o cacau e o adoçante.\nAssim que a pipoca estiver pronta, ainda quente, despeje a mistura por cima e mexa bem para que a calda se distribua de maneira uniforme.",
      "tips": "",
      "storage": "Deve ser consumida imediatamente para manter a crocância.\nSe precisar armazenar, guarde em um pote hermético por até **2 dias**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773002223",
      "type": "recipe",
      "title": "ABACAXI CARAMELIZADO",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "1 porção (100g)",
      "nutrition": {
        "cal": "53",
        "prot": "11g",
        "carb": "14.1g",
        "fat": "0.12g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 abacaxi maduro\n2 colheres de sopa de adoçante culinário (Stevia forno e fogão recomendado)\nCanela em pó a gosto"
        }
      ],
      "prepSteps": "Prepare o abacaxi: Corte o abacaxi em rodelas e, em seguida, remova a casca como se estivesse descascando uma laranja. Esse método evita desperdícios e facilita o corte.\nCaramelize: Misture o adoçante com a canela em pó e passe as fatias de abacaxi nessa mistura dos dois lados. Você também pode simplesmente polvilhar o adoçante e a canela por cima das fatias.\nAsse na AirFryer: Disponha as rodelas na cesta da AirFryer e asse a 180°C por 10 a 12 minutos, virando na metade do tempo para caramelizar uniformemente.\nNo forno: Pré-aqueça o forno a 200°C, em seguida coloque as fatias de abacaxi em uma assadeira forrada com papel manteiga. Polvilhe a mistura de adoçante e canela e leve ao forno por 15 a 20 minutos, virando na metade do tempo.",
      "tips": "",
      "storage": "Geladeira: Pode ser armazenado por até **3 dias** em potes fechados.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773101185",
      "type": "recipe",
      "title": "DANONINHO FIT",
      "category": "Doces e Sobremesas",
      "code": "CM, LT",
      "yield": "1 porção",
      "nutrition": {
        "cal": "95",
        "prot": "6g",
        "carb": "10g",
        "fat": "3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 pote de iogurte natural (caseiro ou pronto)\n½ pacote de suco Clight sabor morango (ou gelatina diet)\n2 colheres de sopa de leite em pó\nMorangos picados a gosto"
        }
      ],
      "prepSteps": "Misture os ingredientes: Em um bowl, adicione o iogurte, o suco Clight (ou gelatina), o leite em pó e os morangos. Misture tudo até ficar homogêneo.\nAjuste a consistência: A mistura vai ficar um pouco líquida no início, mas não se preocupe!\nLeve à geladeira: Deixe descansar por pelo menos 1 hora. Após esse tempo, o creme vai ficar bem mais firme e consistente.",
      "tips": "",
      "storage": "Geladeira: Até **2 dias** em pote fechado.\nFreezer: Não recomendado (pode perder a textura cremosa).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773351631",
      "type": "recipe",
      "title": "BOLINHO DE CHOCOLATE",
      "category": "Bolos e Bolinhos",
      "code": "LM, LT",
      "yield": "6 bolinhos",
      "nutrition": {
        "cal": "120",
        "prot": "6g",
        "carb": "10g",
        "fat": "5g"
      },
      "macroNote": "Essa tabela representa 1 bolinho, e essa receita rende aproximadamente 6 bolinhos.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 ovos\n2 colheres de sopa de cacau em pó\n3 colheres de sopa de farinha de aveia\n2 colheres de sopa de xilitol (ou outro adoçante de sua preferência)\n4 colheres de sopa de leite líquido\n1 colher de café de fermento em pó\nChocolate 70% (opcional, para recheio ou cobertura)"
        }
      ],
      "prepSteps": "Prepare a massa: Em uma tigela, misture os ovos, cacau em pó, farinha de aveia, xilitol e leite até obter uma massa homogênea. Adicione o fermento e misture delicadamente.\nPrepare as forminhas: Use uma forma de silicone ou outro recipiente que possa ir ao forno. Se não for de silicone, unte para evitar que grude.\nAdicione o chocolate: Coloque pedacinhos de chocolate 70% no meio da massa, se desejar.\nAsse: Leve ao forno pré-aquecido a 200°C por 25 minutos. Na air fryer, asse na mesma temperatura até dourar.",
      "tips": "Para um toque especial, finalize com uma cobertura de pasta de amendoim ou do **brigadeiro fit**.\nAjuste o adoçante conforme seu paladar.",
      "storage": "Geladeira: Conserve o bolo em um recipiente fechado por até **5 dias**.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773443360",
      "type": "recipe",
      "title": "BOLINHO DE CHOCOLATE II",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "6 fatias",
      "nutrition": {
        "cal": "69",
        "prot": "2.9g",
        "carb": "10g",
        "fat": "2.7g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 ovos\n2 bananas maduras\n2 colheres de sopa de cacau em pó\n1 colher de sobremesa de fermento em pó\nMorangos picados (a gosto)\nOpcional: Pedacinhos de chocolate 70% para um sabor extra"
        }
      ],
      "prepSteps": "Prepare a massa: Amasse as bananas em uma tigela até formar um purê. Adicione os ovos e o cacau em pó, misturando bem até obter uma massa homogênea. Acrescente o fermento e misture delicadamente. Se quiser, adicione pedacinhos de chocolate 70% para um sabor extra.\nAsse: Unte uma forma e despeje a massa. Distribua os morangos picados por cima. Leve ao forno pré-aquecido a 200°C por 25 minutos até dourar.\nSirva: Deixe esfriar um pouco antes de servir e aproveite esse bolinho saudável e delicioso!",
      "tips": "",
      "storage": "Geladeira: Conserve o bolo em um recipiente fechado por até **5 dias**",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773544277",
      "type": "recipe",
      "title": "BOLINHO DE COCO",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "8 fatias",
      "nutrition": {
        "cal": "120",
        "prot": "6g",
        "carb": "5g",
        "fat": "8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "4 ovos\n50g de coco ralado\n1/2 xícara de leite de coco\n3 colheres de sopa de xilitol (ou o adoçante de sua preferência)\n1/2 xícara de leite em pó\n1 colher de sopa de fermento em pó"
        },
        {
          "title": "Para a cobertura",
          "items": "Leite em pó (ou whey protein)\nÁgua (para ajustar a consistência)\nCoco ralado (para decorar)"
        }
      ],
      "prepSteps": "Prepare a massa: Misture os ovos, adicione o coco ralado e bata bem. Junte o leite de coco, xilitol, leite em pó ou whey e misture até ficar homogêneo. Por último, adicione o fermento e misture delicadamente.\nUnte a forma: Use óleo de coco e farinha em uma forma de 13 cm.\nAsse: Forno ou airfryer pré-aquecido a 180°C por 20-25 minutos. Teste com o palito; se sair limpo, está pronto.\nPrepare a cobertura: Misture leite em pó (ou whey) com água até virar creme. Cubra o bolo, finalize com coco ralado e leve à geladeira para firmar. Sirva!",
      "tips": "",
      "storage": "Geladeira: Conserve o bolo em um recipiente fechado por até **5 dias**.\nEvite armazenar a cobertura separada por muito tempo, pois pode alterar a textura.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773701293",
      "type": "recipe",
      "title": "BOLINHO DE BANANA",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "8 fatias",
      "nutrition": {
        "cal": "120",
        "prot": "6g",
        "carb": "5g",
        "fat": "8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 bananas maduras\n3 ovos (se preferir, pode usar 2 ovos)\n3 colheres de sopa de farinha de aveia\n1 colher de chá de fermento em pó\nCanela a gosto (ou substitua por 3 colheres de sopa de cacau em pó)\nUvas-passas (opcional)\nPedacinhos de chocolate 70% (opcional)"
        }
      ],
      "prepSteps": "Prepare a massa: Amasse as bananas. Adicione ovos, farinha de aveia e canela (ou cacau). Misture até ficar homogêneo. Acrescente o fermento e misture delicadamente.\nUnte a forma: Se não for de silicone, unte com óleo e polvilhe cacau para evitar que grude e dar mais sabor.\nAsse: Forno a 200°C por 25 minutos ou na airfryer até dourar. Faça o teste do palito.\nFinalize: Acrescente uvas-passas ou pedacinhos de chocolate 70% antes de assar, se quiser um toque especial",
      "tips": "",
      "storage": "Geladeira: Conserve o bolo em um recipiente fechado por até **5 dias**",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773769417",
      "type": "recipe",
      "title": "BOLINHO DE CENOURA",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "5 unidades",
      "nutrition": {
        "cal": "109.2",
        "prot": "4.6g",
        "carb": "10.6g",
        "fat": "5.5g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 cenoura média\n2 ovos\n2 colheres de sopa de adoçante natural\n3 colheres de sopa de farinha de aveia\n1 colher de sobremesa de fermento"
        },
        {
          "title": "Para cobertura",
          "items": "4 quadradinhos de chocolate 70%\n1 colher de sopa de leite em pó\nÁgua (quantidade suficiente para dar cremosidade)"
        }
      ],
      "prepSteps": "Prepare a massa: No liquidificador, bata a cenoura, os ovos e o adoçante até obter uma mistura homogênea. Transfira para uma tigela, acrescente a farinha de aveia e misture bem. Por último, adicione o fermento e mexa delicadamente.\nAsse: Distribua a massa em forminhas de cupcake ou no recipiente de sua preferência. Leve ao forno pré-aquecido a 200°C por 25 minutos.\nPrepare a cobertura: Derreta os quadradinhos de chocolate 70% em banho-maria. Acrescente o leite em pó e adicione água aos poucos, mexendo até obter uma consistência cremosa.\nSirva: Deixe esfriar um pouco antes de servir e aproveite esse bolinho saudável e delicioso!",
      "tips": "",
      "storage": "",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773855448",
      "type": "recipe",
      "title": "PÃO DE MEL",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "6 unidades",
      "nutrition": {
        "cal": "138",
        "prot": "5.6g",
        "carb": "16.3g",
        "fat": "5.8g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "3 ovos\n3 colheres de sopa de farinha de aveia\n3 colheres de sopa de cacau em pó\n2 colheres de sopa de iogurte natural\n1 colher de sopa de mel (se quiser pode ser 2)\nCanela a gosto\n1 colher de sopa de fermento em pó"
        }
      ],
      "prepSteps": "Prepare a massa: Em uma tigela, bata os ovos até ficarem aerados. Adicione a farinha de aveia, o cacau em pó, o iogurte natural, o mel e a canela. Misture bem até obter uma massa homogênea. Acrescente o fermento e misture delicadamente.\nAsse: Distribua a massa em forminhas de cupcake ou no recipiente de sua preferência. Leve ao forno pré-aquecido a 200°C por 15 minutos. Se seu forno for muito potente, fique de olho, pois assa rapidamente.\nRecheie: Depois que os bolinhos esfriarem, corte ao meio e recheie com meia colher de sopa de doce de leite em cada unidade.\nCobertura: Derreta uma barrinha de chocolate 70% em banho-maria. Mergulhe os bolinhos no chocolate derretido ou espalhe a cobertura por cima.",
      "tips": "",
      "storage": "",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766773977205",
      "type": "recipe",
      "title": "BOLO NO POTE",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "1 potinho",
      "nutrition": {
        "cal": "81",
        "prot": "5.5g",
        "carb": "9.8g",
        "fat": "4.3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Para o bolo",
          "items": "2 ovos (ou 3 pequenos)\n3 colheres de sopa de farinha de aveia\n2 colheres de sopa de cacau em pó\n5 colheres de sopa de leite\n5 a 6 colheres de sopa de adoçante culinário\n1 colher de sopa de fermento em pó"
        },
        {
          "title": "Para a cobertura",
          "items": "2 colheres de sopa de leite em pó\n2 colheres de sopa de cacau em pó\n2 colheres de sopa de adoçante culinário\nÁgua (adicionar até atingir a textura desejada)"
        }
      ],
      "prepSteps": "Prepare a massa: Em uma tigela, misture os ovos, a farinha de aveia, o cacau em pó e o leite. Adicione o adoçante e misture bem. Por último, acrescente o fermento e misture delicadamente.\nAsse o bolo: Despeje a massa em um recipiente que possa ir ao forno ou Air Fryer. Caso não use forma de silicone, unte e enfarinhe para evitar que grude. Forno: Asse até dourar, verificando com um palito. Air fryer: asse a 160°C por aproximadamente 10 a 12 minutos.\nPrepare a cobertura: Misture o leite em pó, o cacau e o adoçante. Adicione água aos poucos até obter uma consistência líquida. Leve ao fogo baixo, mexendo sempre, até engrossar na textura desejada.\nMonte o bolo: Esfarele o bolo com um garfo, distribua nos potinhos e cubra com a calda.",
      "tips": "",
      "storage": "Geladeira: Armazene por até **7 dias** na parte mais fria.\nCongelamento: Não recomendado devido à mudança de textura.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766774046761",
      "type": "recipe",
      "title": "BOLINHO DE MILHO",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "10 fatias",
      "nutrition": {
        "cal": "178",
        "prot": "36g",
        "carb": "21g",
        "fat": "9g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 xícara de milho verde\n1 ½ xícara de flocão de milho\n3 ovos\n5 colheres de sopa de adoçante culinário\n3 colheres de sopa de óleo de coco ou azeite\n200ml de leite de coco\n1 tampinha de fermento"
        }
      ],
      "prepSteps": "Misture os ingredientes: Em uma tigela, bata os ovos, adicione o milho, o flocão, o adoçante, o óleo de coco e o leite de coco. Misture bem até obter uma massa homogênea.\nAdicione o fermento: Acrescente o fermento e misture delicadamente.\nAsse: Despeje a massa em forminhas ou uma assadeira untada e leve ao forno pré-aquecido a 180°C por 25 minutos. Faça o teste do palito.\nSirva: Espere esfriar e aproveite!",
      "tips": "",
      "storage": "**Geladeira**: até 5 dias em pote hermético.\n**Congelador**: até 1 mês.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766774151320",
      "type": "recipe",
      "title": "BOLINHO DE MICROONDAS",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "1 bolinho",
      "nutrition": {
        "cal": "165",
        "prot": "6g",
        "carb": "16g",
        "fat": "7g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 ovo\n1 colher de sopa de cacau em pó 100%\n2 colheres de sopa de adoçante culinário (se usar cacau 100%)\n4 colheres de sopa de leite (ou água, para versão sem lactose)\n2 colheres de sopa de farinha de aveia (ou farelo de aveia)\n1 pontinha de colher de fermento em pó\nGotas de chocolate (opcional, para finalizar)"
        }
      ],
      "prepSteps": "Em uma caneca funda, adicione o ovo e bata bem.\nAcrescente o cacau, o adoçante, o leite (ou água), a farinha e misture tudo até ficar homogêneo.\nAdicione o fermento por último e misture delicadamente.\nColoque algumas gotinhas de chocolate por cima da massa (opcional).\nLeve ao micro-ondas por 3 minutos em potência alta. Mesmo se dobrar a receita, mantenha o mesmo tempo (3 minutos).",
      "tips": "",
      "storage": "**Consumo imediato**: A textura é melhor na hora.\n**Geladeira**: Pode armazenar por até 1 dia, mas pode perder a maciez.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766775765974",
      "type": "recipe",
      "title": "SHAKE LAXATIVO (REGULADOR INTESTINAL)",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "8 potinhos",
      "nutrition": {
        "cal": "216",
        "prot": "10.6g",
        "carb": "19.8g",
        "fat": "10.3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Para o iogurte",
          "items": "2 litros de leite integral\n1 pote de iogurte natural (como \"isca\")\n4 colheres de sopa de leite em pó (opcional, para consistência)"
        },
        {
          "title": "Para a geleia",
          "items": "500g de morangos congelados\n1/2 limão espremido (suco)\n6 colheres de sopa de adoçante culinário (sugestão: Forno e Fogão)"
        }
      ],
      "prepSteps": "Prepare o iogurte: Aqueça o leite até atingir 40°C (morno ao toque). Dissolva o leite em pó nesta etapa para garantir cremosidade. Adicione o iogurte natural e misture bem. Cubra o recipiente com plástico filme e um pano de prato. Deixe descansar em um local abafado e sem corrente de ar (como dentro do forno desligado) até firmar.\nPrepare a geleia: Em uma panela, coloque os morangos, o suco de limão e o adoçante. Leve ao fogo médio. Não adicione água, deixe o morango soltar o próprio líquido.\nDê o ponto: Mexa e amasse levemente os morangos conforme amolecem, mantendo pedaços para textura. Cozinhe até obter uma calda grossa e brilhante.\nMonte: Distribua a geleia no fundo de 8 potes e complete com o iogurte firme.",
      "tips": "Os valores nutricionais correspondem a **1 potinho**.",
      "storage": "**Geladeira:** Mantenha refrigerado e consuma em até 7 dias.\n**Congelamento:** Não recomendado (o iogurte pode talhar ao descongelar)",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766776181059",
      "type": "recipe",
      "title": "IOGURTE COM GELEIA DE MORANGO",
      "category": "Lanches",
      "code": "CM, LT",
      "yield": "1 copo",
      "nutrition": {
        "cal": "359",
        "prot": "11.4g",
        "carb": "54.8g",
        "fat": "13.0g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "4 unidades de ameixa seca (sem caroço)\n1 colher de sopa de chia\n200 ml de água, leite sem lactose ou leite vegetal\n1 colher de sopa de linhaça (dourada ou marrom)\n1 fatia grande de mamão formosa (ou 1/2 mamão papaya bem maduro)\n1 colher de sopa de psyllium (ou mix de fibras)\nAdoçante stevia ou mel a gosto"
        }
      ],
      "prepSteps": "Em recipientes separados, coloque as ameixas e a chia de molho em um pouco de água por 10 a 15 minutos. Isso é essencial para liberar a mucilagem da chia e ativar as fibras da ameixa.\nA água onde a ameixa ficou de molho contém sorbitol (laxante natural) e deve ser usada na receita. A chia formará um \"gel\" que também será usado integralmente.\nNo liquidificador, coloque os 200ml de leite, a linhaça, o mamão, as ameixas com a água do molho, o gel de chia, o psyllium e o adoçante.\nBata até que a mistura fique homogênea e com uma cor mais escura, garantindo que todas as sementes e fibras foram bem processadas.",
      "tips": "Protocolo: Consumir \"dia sim, dia não\" para auxiliar na regulação do trânsito intestinal.\nDica: Se desejar reduzir as calorias, substitua o leite integral por água ou leite desnatado e use adoçante em vez de **mel**",
      "storage": "",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766776435256",
      "type": "recipe",
      "title": "TOAST DE ATUM CREMOSO",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "8 toasts",
      "nutrition": {
        "cal": "216",
        "prot": "10.6g",
        "carb": "19.8g",
        "fat": "10.3g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "8 fatias de pão de forma\n2 latas de atum sólido (escorrido)\n1/2 cebola roxa picada\n1/2 tomate picado\nCebolinha picada a gosto (opcional)\n2 colheres de sopa (bem cheias) de requeijão cremoso light\n8 fatias de queijo mussarela\nSal a gosto"
        }
      ],
      "prepSteps": "Prepare o recheio: Em um bowl, misture o atum, a cebola, o tomate, a cebolinha e o requeijão. Tempere com sal e mexa até obter um creme homogêneo.\nPrepare o pão: Pressione levemente o centro de cada fatia de pão com uma colher, criando uma pequena cavidade para acomodar o recheio sem vazar.\nMonte: Distribua o creme de atum sobre as fatias de pão e cubra cada um com uma fatia de queijo mussarela.\nAsse: Leve ao forno ou Air Fryer até o queijo derreter e gratinar (se for consumir na hora)",
      "tips": "",
      "storage": "**Como embalar**: Envolva cada toast (ainda cru/sem assar o queijo) individualmente em plástico filme, fechando bem.\n**Validade**: Pode ser mantido no congelador por até 3 meses.\n**Para consumir**: Retire do congelador e leve direto ao forno ou Air Fryer até aquecer e o queijo derreter.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766776844428",
      "type": "recipe",
      "title": "CREPIOCA DOCE COM BANANA",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "1 unidade",
      "nutrition": {
        "cal": "350",
        "prot": "15g",
        "carb": "35g",
        "fat": "15g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1 ovo\n2 colheres de sopa de goma de tapioca\n50g de queijo mussarela (aprox. 2 fatias)\n1 banana (cortada em rodelas)\n1 pitada de sal\nMel e Canela a gosto (para finalizar)"
        }
      ],
      "prepSteps": "Base de Queijo: Em uma frigideira antiaderente fria, distribua o queijo mussarela no fundo.\nCamada de Banana: Coloque as rodelas de banana sobre o queijo.\nMassa: Em uma tigela separada, bata o ovo com a tapioca e o sal até ficar homogêneo. Despeje essa mistura na frigideira, cobrindo as bananas e o queijo.\nCozimento: Tampe a frigideira e leve ao fogo baixo. Quando ouvir o queijo \"estalando\", significa que a crosta dourada se formou.\nFinalização: Vire para cozinhar o outro lado brevemente. Sirva com um fio de mel e canela polvilhada por cima.",
      "tips": "O segredo da crosta crocante é começar com a frigideira fria e deixar o queijo dourar bem antes de virar. Use uma boa frigideira antiaderente para não precisar adicionar óleo.",
      "storage": "Consumo imediato: A textura é melhor na hora.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766776926526",
      "type": "recipe",
      "title": "PUDIM DE CHIA COM GELATINA E FRUTAS",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "4 unidades",
      "nutrition": {
        "cal": "165",
        "prot": "8.5g",
        "carb": "20.5g",
        "fat": "4.6g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Base",
          "items": "2 pacotes de gelatina diet (sabor morango)\nÁgua (conforme instrução da embalagem)"
        },
        {
          "title": "Creme de Chia",
          "items": "400 ml de iogurte natural\n4 colheres de sopa de chia\n4 colheres de sopa de aveia em flocos\nAdoçante a gosto (Sugestão: 5 a 6 dosadores de stevia)"
        },
        {
          "title": "Cobertura",
          "items": "Morangos picados\nKiwi picado\n(Ou frutas de sua preferência)"
        }
      ],
      "prepSteps": "Prepare a gelatina: Dissolva a gelatina diet conforme as instruções do fabricante. Distribua em potes de vidro e leve à geladeira até firmar completamente.\nPrepare o creme: Em uma tigela, misture o iogurte natural, a chia, a aveia e o adoçante. Mexa bem até integrar.\nMonte: Retire os potes da geladeira. Adicione uma camada generosa do creme de chia sobre a gelatina já firme.\nFinalize: Cubra com os pedaços de morango e kiwi.",
      "tips": "",
      "storage": "Geladeira: Mantenha os potes bem fechados na geladeira por até **3 a 4 dias**.\nDica: Se for consumir depois de muitos dias, prefira colocar as frutas picadas apenas na hora de comer para que elas não soltem muita água ou oxidem.\nCongelamento: **Não recomendado**. A gelatina cristaliza e perde a textura gelatinosa ao descongelar, e o iogurte pode talhar ou separar o soro",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766777027344",
      "type": "recipe",
      "title": "SORVETE DE MANGA FIT (2 INGREDIENTES)",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "1 porção",
      "nutrition": {
        "cal": "410",
        "prot": "13.2g",
        "carb": "67.7g",
        "fat": "12.2g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "Manga picada e congelada (quantidade a gosto, sugestão: 1 a 2 mangas grandes)\n4 colheres de sopa de leite em pó (ou Whey Protein sabor baunilha/neutro)"
        }
      ],
      "prepSteps": "Congelamento: Descasque e corte a manga (tipos Tommy ou Palmer são melhores por terem menos fiapos) em cubos. Leve ao congelador por aproximadamente 6 horas ou até que esteja bem dura.\nProcessamento: Coloque a manga congelada em um recipiente resistente. Adicione o leite em pó (ou Whey Protein) por cima.\nBata: Utilize um Mixer para processar a fruta com o pó. Pressione o mixer contra a fruta aos poucos até obter uma textura cremosa e homogênea.\nCuidado: Evite usar liquidificador comum sem água, pois a manga congelada é muito dura e pode danificar o aparelho. O mixer é o mais indicado.\nSirva: O resultado é imediato, um creme espesso estilo sorvete de massa.",
      "tips": "**Proteína Extra**: Substitua o leite em pó por Whey Protein para transformar esse sorvete em um pós-treino refrescante e proteico.",
      "storage": "**Congelador**: Pode ser armazenado no congelador em pote fechado. Se endurecer muito, retire alguns minutos antes de consumir para voltar à cremosidade.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766777134292",
      "type": "recipe",
      "title": "CEBOLA ROXA EM CONSERVA",
      "category": "Acompanhamentos",
      "code": "CM, LT",
      "yield": "1 pote",
      "nutrition": {
        "cal": "0",
        "prot": "0g",
        "carb": "0g",
        "fat": "0g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "1kg de cebola roxa\n400 ml de água morna\nAzeite de oliva (quantidade generosa para conserva)\nVinagre (de álcool ou maçã - quantidade a gosto)\nTemperos: Chimichurri, Pimenta Calabresa e Sal a gosto\nOpcional: Alho granulado ou Lemon Pepper"
        }
      ],
      "prepSteps": "Descasque e fatie as cebolas em rodelas bem finas (quanto mais fina, melhor a textura e absorção do tempero).\nEm um recipiente grande, coloque as cebolas e adicione o azeite, o vinagre e os temperos secos (chimichurri, pimenta, sal e alho).\nDespeje a água morna sobre as cebolas temperadas.\nMexa bem para que todos os ingredientes se incorporem.\nTransfira para um pote com tampa. Embora possa ser consumida na hora, o ideal é deixar descansar na geladeira de um dia para o outro para apurar o sabor.",
      "tips": "",
      "storage": "**Pote**: Utilize potes herméticos (bem vedados) e limpos.\n**Validade**: Conservar na geladeira por até 15 dias.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766777230003",
      "type": "recipe",
      "title": "SALADA REFOGADA PRÁTICA",
      "category": "Acompanhamentos",
      "code": "CM, LT",
      "yield": "Variável",
      "nutrition": {
        "cal": "0",
        "prot": "0g",
        "carb": "0g",
        "fat": "0g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "6 folhas de couve (sem o talo central)\n2 cenouras (cortadas em tiras finas)\n1/4 de repolho (cortado em tiras finas)\n1 fio de azeite\nCebola picada a gosto\nAlho (fresco ou granulado) a gosto\nTemperos: Sal e Chimichurri a gosto"
        }
      ],
      "prepSteps": "Preparação da Couve: Retire o talo central das folhas de couve para evitar o amargor. Enrole as folhas fazendo um \"charutinho\" e corte em tiras finas.\nPreparação da Cenoura: Utilize um descascador ou faca para cortar as cenouras em tiras longas e finas (estilo julienne ou espaguete).\nPreparação do Repolho: Fatie o repolho bem fininho.\nRefoga: Em uma frigideira grande ou panela, aqueça o azeite e refogue a cebola e o alho até dourarem levemente.\nSequência de Cozimento: Adicione o repolho primeiro e deixe refogar até começar a murchar.\nAcrescente a cenoura e deixe cozinhar por cerca de 3 a 4 minutos (ela deve ficar macia, mas ainda firme).\nPor último, coloque a couve, pois ela cozinha muito rápido. Mexa apenas para misturar e murchar levemente.\nTempere: Finalize com sal e chimichurri (ou temperos de sua preferência) e desligue o fogo.",
      "tips": "",
      "storage": "Pode ser guardada na geladeira em pote fechado e consumida ao longo da semana.",
      "image": "",
      "videoLink": "",
      "layout": "8",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766777357707",
      "type": "recipe",
      "title": "SALADA DE CHUCHU",
      "category": "Saladas e Acompanhamentos",
      "code": "LM, LT",
      "yield": "Variável",
      "nutrition": {
        "cal": "19",
        "prot": "0g",
        "carb": "0g",
        "fat": "0g"
      },
      "macroNote": "Tabela nutricional por 100g de chuchu. As calorias totais são irrisórias, sendo uma excelente opção de volume para saciedade.",
      "ingredientGroups": [
        {
          "title": "Ingredientes",
          "items": "2 chuchus (descascados e cortados em tiras ou cubos)\n1 cebola pequena (picada bem miudinha)\n1 tomate (picado em cubinhos)\nSuco de 1 limão\nAzeite (um fio)\nVinagre (opcional, se quiser mais acidez)\nCheiro-verde: Cebolinha e Coentro picados a gosto (o coentro é opcional)\nTemperos: Sal e Pimenta do Reino a gosto"
        }
      ],
      "prepSteps": "Cozimento do Chuchu: Descasque e corte os chuchus. Leve para cozinhar preferencialmente no vapor até ficarem macios (\"al dente\").\nPreparo do Vinagrete: Enquanto o chuchu cozinha, pique a cebola, o tomate e o cheiro-verde. Coloque em uma tigela e tempere com o limão, azeite, vinagre (se usar), sal e pimenta. Misture bem.\nMontagem: Com o chuchu já cozido (e frio ou morno), misture-o ao vinagrete preparado na tigela. Mexa para envolver todos os pedaços no tempero.\nFinalização: Pode ser servida imediatamente ou levada à geladeira para apurar o sabor.",
      "tips": "O vapor preserva o sabor e evita que o chuchu fique encharcado (\"aguado\"). Se cozinhar na água, escorra **muito bem**.",
      "storage": "**Geladeira**: Conserve em pote fechado na geladeira. O sabor costuma ficar ainda melhor no dia seguinte.\n**Validade**: Consumir em até 3 a 4 dias (devido ao tomate e cebola crus).",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    },
    {
      "id": "p_1766777451765",
      "type": "recipe",
      "title": "PRESTÍGIO FIT (SEM WHEY)",
      "category": "Bolos e Bolinhos",
      "code": "CM, LT",
      "yield": "1 potinho",
      "nutrition": {
        "cal": "19",
        "prot": "8.5g",
        "carb": "16.0g",
        "fat": "9.0g"
      },
      "macroNote": "Valores referentes a 1 porção.",
      "ingredientGroups": [
        {
          "title": "Base",
          "items": "2 colheres de sopa de iogurte grego (ou natural)\n1 colher de sopa de leite em pó\n1 colher de sopa de coco ralado (seco ou fresco, sem açúcar)\nAdoçante a gosto (opcional se usar iogurte grego; recomendado se usar natural)"
        },
        {
          "title": "Cobertura",
          "items": "3 a 4 quadradinhos de chocolate amargo/meio amargo (aprox. 15-20g)\n1 colher de sopa de leite desnatado (ou iogurte) para o ganache"
        }
      ],
      "prepSteps": "Prepare o creme: Em um potinho pequeno, misture o iogurte, o leite em pó e o coco ralado até formar um creme homogêneo e consistente. Adoce se achar necessário. Nivele o creme no fundo do pote.\n\nPrepare a cobertura: Derreta os quadradinhos de chocolate no micro-ondas (de 30 em 30 segundos para não queimar). Misture com o leite desnatado (ou iogurte) para criar um ganache cremoso que não endureça demais ao gelar.\n\nMonte: Despeje o chocolate derretido sobre o creme de coco.\n\nResfrie: Leve ao congelador por cerca de 30 minutos para firmar e ficar na textura ideal.",
      "tips": "",
      "storage": "**Congelador**: Ideal para consumo rápido após os 30 minutos de freezer.\n**Geladeira**: Se quiser guardar para mais tarde, mantenha na geladeira para não congelar completamente.",
      "image": "",
      "videoLink": "",
      "layout": "2",
      "fontSizes": {
        "title": 3,
        "ingredients": 2,
        "prep": 2
      },
      "imageSize": 3,
      "spacing": "normal",
      "videoDisplayStyle": "button",
      "objectFit": "cover",
      "objectPosition": "center",
      "imageZoom": 100,
      "columnRatio": "default",
      "tipPlacement": "footer",
      "storagePlacement": "footer",
      "nutritionDisplayStyle": "default",
      "titleAlignment": null
    }
];

export type PageData = typeof PDF_LUIZA_DATA[0];
export type RecipePageData = typeof INITIAL_DATA[TEMPLATES.RECIPE];
export type IntroPageData = typeof INITIAL_DATA[TEMPLATES.INTRO];
export type CoverPageData = typeof INITIAL_DATA[TEMPLATES.COVER];
export type SectionPageData = typeof INITIAL_DATA[TEMPLATES.SECTION];
export type ShoppingPageData = typeof INITIAL_DATA[TEMPLATES.SHOPPING];
export type TocPageData = typeof INITIAL_DATA[TEMPLATES.TOC] & {
    tocPageNumber?: number; // Explicitamente adicionado ao tipo
};
export type LegendPageData = typeof INITIAL_DATA[TEMPLATES.LEGEND];