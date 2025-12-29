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
    "id": "p_1722457200000_cover",
    "type": "cover",
    "title": "Receitinhas",
    "subtitle": "FIT",
    "author": "@LU.MTSFIT",
    "edition": "EDIÇÃO ESPECIAL"
  },
  {
    "id": "p_1722457200001_intro",
    "type": "intro",
    "title": "Um Olá Especial",
    "highlight": "para Você!",
    "text": "Olá! Que bom ter você por aqui. Este e-book foi feito com muito carinho para te ajudar a ter uma alimentação mais saudável e saborosa. Aqui você encontrará receitas práticas e nutritivas para o seu dia a dia. Aproveite cada página e descubra como é fácil se alimentar bem! Com carinho, Luiza."
  },
  {
    "id": "p_1722457200012_legend",
    "type": "legend",
    "title": "Legendas",
    "text": "Estas legendas foram criadas para facilitar a sua organização. Identifique rapidamente em qual refeição cada receita se encaixa melhor no seu dia a dia."
  },
  // --- NOVAS SEÇÕES E RECEITAS ---
  {
    "id": "p_section_acompanhamentos_saladas_sopas",
    "type": "section",
    "title": "ACOMPANHAMENTOS, SALADAS & SOPAS",
    "subtitle": "Opções leves e saborosas"
  },
  {
    "id": "p_1722457200049_recipe_batata_perfeita",
    "type": "recipe",
    "title": "BATATA PERFEITA",
    "category": "ACOMPANHAMENTO",
    "code": "AC, A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "200",
      "prot": "4g",
      "carb": "40g",
      "fat": "3g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 batatas médias\n1 colher de sopa de azeite\nSal, páprica e alecrim a gosto"
      }
    ],
    "prepSteps": "1. Lave bem as batatas e corte-as em palitos ou cubos (com casca).\n2. Em um recipiente, misture as batatas com o azeite, sal, páprica e alecrim.\n3. Leve à airfryer pré-aquecida a 200°C por cerca de 20-25 minutos, mexendo na metade do tempo, ou até ficarem douradas e crocantes."
  },
  {
    "id": "p_1722457200041_recipe_caldo_abobora_frango",
    "type": "recipe",
    "title": "CALDINHO DE ABÓBORA COM FRANGO",
    "category": "JANTAR",
    "code": "J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "250",
      "prot": "25g",
      "carb": "20g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "300g de abóbora picada\n100g de frango desfiado\n1/2 cebola picada\n1 dente de alho picado\nCaldo de legumes caseiro ou água\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. Cozinhe a abóbora em água ou caldo de legumes até ficar macia. Bata no liquidificador até virar um creme.\n2. Em outra panela, refogue a cebola e o alho, adicione o frango desfiado e tempere a gosto.\n3. Misture o creme de abóbora ao frango. Se necessário, adicione mais caldo/água para ajustar a consistência.\n4. Cozinhe por alguns minutos, finalize com cheiro verde e sirva."
  },
  {
    "id": "p_1722457200044_recipe_caldo_fraldinha",
    "type": "recipe",
    "title": "CALDINHO DE FRALDINHA",
    "category": "JANTAR",
    "code": "J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "300",
      "prot": "30g",
      "carb": "15g",
      "fat": "12g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "200g de fraldinha em cubos\n1/2 cebola picada\n1 dente de alho picado\n1 tomate picado\nCaldo de carne caseiro ou água\nLegumes picados a gosto (cenoura, batata, abobrinha)\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. Em uma panela de pressão, doure a fraldinha em um fio de azeite. Adicione a cebola, alho e tomate, refogue.\n2. Cubra com caldo de carne/água, tempere com sal e pimenta. Cozinhe na pressão por cerca de 20-25 minutos após pegar pressão.\n3. Desligue o fogo, espere a pressão sair, abra a panela e adicione os legumes picados. Cozinhe até os legumes ficarem macios.\n4. Finalize com cheiro verde e sirva."
  },
  {
    "id": "p_1722457200042_recipe_caldo_legumes",
    "type": "recipe",
    "title": "CALDINHO DE LEGUMES",
    "category": "BASE",
    "code": "B",
    "yield": "1 litro",
    "nutrition": {
      "cal": "20",
      "prot": "1g",
      "carb": "4g",
      "fat": "0g"
    },
    "macroNote": "Valores por 100ml.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 cebola grande\n2 cenouras\n2 talos de aipo\n2 folhas de louro\nGrãos de pimenta do reino\n1,5 litros de água"
      }
    ],
    "prepSteps": "1. Lave e pique grosseiramente todos os legumes.\n2. Em uma panela grande, coloque os legumes, as folhas de louro, os grãos de pimenta e a água.\n3. Leve ao fogo alto até ferver, depois reduza o fogo e cozinhe por cerca de 30-40 minutos.\n4. Coe o caldo, descarte os sólidos e utilize em suas receitas."
  },
  {
    "id": "p_1722457200050_recipe_cebola_roxa_conserva",
    "type": "recipe",
    "title": "CEBOLA ROXA EM CONSERVA",
    "category": "ACOMPANHAMENTO",
    "code": "AC, B",
    "yield": "1 pote",
    "nutrition": {
      "cal": "15",
      "prot": "0g",
      "carb": "3g",
      "fat": "0g"
    },
    "macroNote": "Valores por 30g.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 cebola roxa grande fatiada finamente\n1/2 xícara de vinagre de maçã\n1/2 xícara de água\n1 colher de chá de sal\n1 colher de chá de açúcar (opcional)\nGrãos de pimenta do reino e louro a gosto"
      }
    ],
    "prepSteps": "1. Em um pote de vidro esterilizado, coloque as fatias de cebola roxa.\n2. Em uma panela, misture o vinagre, água, sal, açúcar (se usar), pimenta e louro. Leve ao fogo até ferver.\n3. Despeje a mistura quente sobre as cebolas no pote, cobrindo completamente.\n4. Tampe o pote e deixe esfriar em temperatura ambiente. Leve à geladeira por pelo menos 2 horas antes de consumir.\n5. Dura até 2 semanas na geladeira."
  },
  {
    "id": "p_1722457200054_recipe_requeijao_cremoso",
    "type": "recipe",
    "title": "REQUEIJÃO CREMOSO",
    "category": "BASE",
    "code": "B",
    "yield": "1 pote",
    "nutrition": {
      "cal": "80",
      "prot": "5g",
      "carb": "3g",
      "fat": "6g"
    },
    "macroNote": "Valores por 50g.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 litro de leite integral\n4 colheres de sopa de vinagre branco ou suco de limão\n1 colher de sopa de manteiga ou azeite\nSal a gosto"
      }
    ],
    "prepSteps": "1. Aqueça o leite em uma panela até quase ferver. Desligue o fogo e adicione o vinagre/limão. Mexa delicadamente e deixe talhar por 10 minutos.\n2. Coe o leite talhado em uma peneira forrada com um pano de prato limpo, espremendo bem para retirar todo o soro.\n3. Transfira a massa para um liquidificador, adicione a manteiga/azeite e o sal. Bata até obter um creme liso e homogêneo.\n4. Leve à geladeira por pelo menos 2 horas antes de consumir. Dura até 5 dias na geladeira."
  },
  {
    "id": "p_1722457200048_recipe_salada_molho_ervas",
    "type": "recipe",
    "title": "SALADA COM MOLHO DE ERVAS",
    "category": "ACOMPANHAMENTO",
    "code": "AC, A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "150",
      "prot": "4g",
      "carb": "10g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Salada",
        "items": "Mix de folhas verdes\nCenoura ralada\nTomate picado\nMilho"
      },
      {
        "title": "Molho",
        "items": "3 colheres de sopa de azeite\n2 colheres de sopa de vinagre balsâmico\nErvas finas desidratadas a gosto (orégano, manjericão, alecrim)\nSal e pimenta do reino a gosto"
      }
    ],
    "prepSteps": "1. Lave e seque as folhas. Monte a salada com os vegetais.\n2. Em um recipiente pequeno, misture todos os ingredientes do molho até ficar homogêneo.\n3. Regue a salada com o molho e sirva."
  },
  {
    "id": "p_1722457200047_recipe_salada_molho_mostarda_mel",
    "type": "recipe",
    "title": "SALADA COM MOLHO DE MOSTARDA E MEL",
    "category": "ACOMPANHAMENTO",
    "code": "AC, A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "180",
      "prot": "5g",
      "carb": "15g",
      "fat": "12g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Salada",
        "items": "Folhas verdes a gosto (alface, rúcula)\nTomate cereja\nPepino em rodelas\nFrango grelhado em tiras (opcional)"
      },
      {
        "title": "Molho",
        "items": "2 colheres de sopa de mostarda dijon\n1 colher de sopa de mel\n2 colheres de sopa de azeite\n1 colher de sopa de vinagre de maçã\nSal e pimenta do reino a gosto"
      }
    ],
    "prepSteps": "1. Lave e seque as folhas verdes. Monte a salada com os vegetais e o frango (se usar).\n2. Em um recipiente pequeno, misture todos os ingredientes do molho até ficar homogêneo.\n3. Regue a salada com o molho e sirva."
  },
  {
    "id": "p_1722457200052_recipe_salada_de_chuchu",
    "type": "recipe",
    "title": "SALADA DE CHUCHU",
    "category": "ACOMPANHAMENTO",
    "code": "AC, A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "80",
      "prot": "2g",
      "carb": "8g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 chuchu médio cozido e picado\n1/4 cebola roxa picada\nCheiro verde a gosto\nMolho: azeite, vinagre, sal e pimenta do reino"
      }
    ],
    "prepSteps": "1. Cozinhe o chuchu até ficar macio, escorra e pique em cubos.\n2. Em um recipiente, misture o chuchu picado, a cebola roxa e o cheiro verde.\n3. Prepare o molho misturando azeite, vinagre, sal e pimenta do reino.\n4. Regue a salada com o molho e misture bem.\n5. Sirva fria."
  },
  {
    "id": "p_1722457200046_recipe_salada_grao_bico",
    "type": "recipe",
    "title": "SALADA DE GRÃO DE BICO",
    "category": "ACOMPANHAMENTO",
    "code": "AC, A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "250",
      "prot": "12g",
      "carb": "30g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de grão de bico cozido\n1/2 pepino picado\n1/2 tomate picado\n1/4 cebola roxa picada\nCheiro verde a gosto\nMolho: azeite, limão, sal e pimenta do reino"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o grão de bico cozido, pepino, tomate, cebola roxa e cheiro verde.\n2. Prepare o molho misturando azeite, suco de limão, sal e pimenta do reino.\n3. Regue a salada com o molho e misture bem.\n4. Sirva fria."
  },
  {
    "id": "p_1722457200051_recipe_salada_refogada_pratica",
    "type": "recipe",
    "title": "SALADA REFOGADA PRÁTICA",
    "category": "ACOMPANHAMENTO",
    "code": "AC, A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "100",
      "prot": "3g",
      "carb": "10g",
      "fat": "6g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 maço de couve ou espinafre picado\n1 dente de alho picado\n1/4 cebola picada\n1 colher de sopa de azeite\nSal e pimenta do reino a gosto"
      }
    ],
    "prepSteps": "1. Em uma frigideira, aqueça o azeite e refogue a cebola e o alho.\n2. Adicione a couve/espinafre picado e refogue até murchar.\n3. Tempere com sal e pimenta do reino.\n4. Sirva quente como acompanhamento."
  },
  {
    "id": "p_section_bolos_doces_sobremesas",
    "type": "section",
    "title": "BOLOS, DOCES & SOBREMESAS",
    "subtitle": "Para adoçar a vida sem culpa"
  },
  {
    "id": "p_1722457200065_recipe_abacaxi_caramelizado",
    "type": "recipe",
    "title": "ABACAXI CARAMELIZADO",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "100",
      "prot": "1g",
      "carb": "25g",
      "fat": "0g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 rodelas de abacaxi\nCanela em pó a gosto\nGotas de adoçante ou mel (opcional)"
      }
    ],
    "prepSteps": "1. Descasque o abacaxi e corte em rodelas grossas.\n2. Polvilhe canela em pó e, se desejar, adicione algumas gotas de adoçante ou um fio de mel.\n3. Leve à airfryer pré-aquecida a 180°C por cerca de 10-15 minutos, virando na metade do tempo, ou até caramelizar e dourar."
  },
  {
    "id": "p_1722457200070_recipe_bolinho_de_banana",
    "type": "recipe",
    "title": "BOLINHO DE BANANA",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "2 bolinhos",
    "nutrition": {
      "cal": "170",
      "prot": "5g",
      "carb": "30g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 bolinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n1 banana madura amassada\n3 colheres de sopa de farinha de aveia\n1/4 xícara de leite (ou bebida vegetal)\nCanela a gosto\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, banana amassada, farinha de aveia, leite e canela até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em duas forminhas de silicone ou canecas untadas.\n4. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou ao forno pré-aquecido a 180°C por 15-20 minutos.\n5. Sirva quente."
  },
  {
    "id": "p_1722457200071_recipe_bolinho_de_cenoura",
    "type": "recipe",
    "title": "BOLINHO DE CENOURA",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "2 bolinhos",
    "nutrition": {
      "cal": "160",
      "prot": "5g",
      "carb": "25g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 bolinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n1/4 xícara de cenoura ralada\n3 colheres de sopa de farinha de aveia\n1/4 xícara de leite (ou bebida vegetal)\n2 colheres de sopa de adoçante culinário\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, cenoura ralada, farinha de aveia, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em duas forminhas de silicone ou canecas untadas.\n4. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou ao forno pré-aquecido a 180°C por 15-20 minutos.\n5. Sirva quente."
  },
  {
    "id": "p_1722457200067_recipe_bolinho_de_chocolate",
    "type": "recipe",
    "title": "BOLINHO DE CHOCOLATE",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "2 bolinhos",
    "nutrition": {
      "cal": "180",
      "prot": "6g",
      "carb": "25g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 bolinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n3 colheres de sopa de farinha de aveia\n2 colheres de sopa de cacau em pó 100%\n1/4 xícara de leite (ou bebida vegetal)\n2 colheres de sopa de adoçante culinário\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, farinha de aveia, cacau, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em duas forminhas de silicone ou canecas untadas.\n4. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou ao forno pré-aquecido a 180°C por 15-20 minutos.\n5. Sirva quente."
  },
  {
    "id": "p_1722457200068_recipe_bolinho_de_chocolate_ii",
    "type": "recipe",
    "title": "BOLINHO DE CHOCOLATE II",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "2 bolinhos",
    "nutrition": {
      "cal": "180",
      "prot": "6g",
      "carb": "25g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 bolinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n3 colheres de sopa de farinha de aveia\n2 colheres de sopa de cacau em pó 100%\n1/4 xícara de leite (ou bebida vegetal)\n2 colheres de sopa de adoçante culinário\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, farinha de aveia, cacau, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em duas forminhas de silicone ou canecas untadas.\n4. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou ao forno pré-aquecido a 180°C por 15-20 minutos.\n5. Sirva quente."
  },
  {
    "id": "p_1722457200069_recipe_bolinho_de_coco",
    "type": "recipe",
    "title": "BOLINHO DE COCO",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "2 bolinhos",
    "nutrition": {
      "cal": "190",
      "prot": "6g",
      "carb": "20g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 bolinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n3 colheres de sopa de farinha de aveia\n2 colheres de sopa de coco ralado sem açúcar\n1/4 xícara de leite (ou bebida vegetal)\n2 colheres de sopa de adoçante culinário\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, farinha de aveia, coco ralado, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em duas forminhas de silicone ou canecas untadas.\n4. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou ao forno pré-aquecido a 180°C por 15-20 minutos.\n5. Sirva quente."
  },
  {
    "id": "p_1722457200075_recipe_bolinho_de_microondas",
    "type": "recipe",
    "title": "BOLINHO DE MICROONDAS",
    "category": "BASE",
    "code": "B, CM, S",
    "yield": "1 bolinho",
    "nutrition": {
      "cal": "150",
      "prot": "6g",
      "carb": "20g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 bolinho (base).",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n2 colheres de sopa de farinha de aveia\n2 colheres de sopa de leite (ou bebida vegetal)\n1 colher de sopa de adoçante culinário\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em uma caneca ou forminha de silicone, misture o ovo, farinha de aveia, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou até assar.\n4. Sirva puro ou com coberturas e recheios a gosto (frutas, iogurte, pasta de amendoim)."
  },
  {
    "id": "p_1722457200074_recipe_bolinho_de_milho",
    "type": "recipe",
    "title": "BOLINHO DE MILHO",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "2 bolinhos",
    "nutrition": {
      "cal": "170",
      "prot": "5g",
      "carb": "30g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 bolinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n3 colheres de sopa de farinha de milho\n1/4 xícara de leite (ou bebida vegetal)\n2 colheres de sopa de adoçante culinário\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, farinha de milho, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em duas forminhas de silicone ou canecas untadas.\n4. Leve ao micro-ondas por cerca de 1-2 minutos (dependendo da potência) ou ao forno pré-aquecido a 180°C por 15-20 minutos.\n5. Sirva quente."
  },
  {
    "id": "p_1722457200073_recipe_bolo_no_pote",
    "type": "recipe",
    "title": "BOLO NO POTE",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 potes",
    "nutrition": {
      "cal": "250",
      "prot": "10g",
      "carb": "35g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 pote.",
    "ingredientGroups": [
      {
        "title": "Bolo",
        "items": "1 ovo\n2 colheres de sopa de farinha de aveia\n1 colher de sopa de cacau em pó 100%\n2 colheres de sopa de adoçante culinário\n1/4 xícara de leite (ou bebida vegetal)\n1 colher de chá de fermento em pó"
      },
      {
        "title": "Recheio",
        "items": "1/2 xícara de iogurte natural\nFrutas picadas a gosto"
      }
    ],
    "prepSteps": "1. **Bolo:** Misture o ovo, farinha, cacau, adoçante e leite. Adicione o fermento. Despeje em uma caneca e leve ao micro-ondas por 1-2 minutos. Deixe esfriar e esfarele.\n2. **Montagem:** Em potes, intercale camadas de bolo esfarelado, iogurte natural e frutas picadas.\n3. Leve à geladeira por pelo menos 1 hora antes de servir."
  },
  {
    "id": "p_1722457200055_recipe_brigadeiro",
    "type": "recipe",
    "title": "BRIGADEIRO",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "6 brigadeiros",
    "nutrition": {
      "cal": "80",
      "prot": "3g",
      "carb": "10g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 brigadeiro.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de leite em pó desnatado\n1/2 xícara de água quente\n2 colheres de sopa de cacau em pó 100%\nGotas de adoçante a gosto\nGranulado diet ou coco ralado para decorar (opcional)"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o leite em pó, a água quente e o cacau em pó até obter uma massa homogênea.\n2. Adicione as gotas de adoçante e misture bem.\n3. Leve ao micro-ondas por 30 segundos, mexa e repita até atingir a consistência desejada (cerca de 1-2 minutos no total).\n4. Deixe esfriar, enrole os brigadeiros e passe no granulado/coco ralado (se usar)."
  },
  {
    "id": "p_1722457200056_recipe_brigadeiro_de_cafe",
    "type": "recipe",
    "title": "BRIGADEIRO DE CAFÉ",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "6 brigadeiros",
    "nutrition": {
      "cal": "85",
      "prot": "3g",
      "carb": "10g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 brigadeiro.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de leite em pó desnatado\n1/2 xícara de café forte e quente\n2 colheres de sopa de cacau em pó 100%\nGotas de adoçante a gosto\nCafé solúvel para decorar (opcional)"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o leite em pó, o café quente e o cacau em pó até obter uma massa homogênea.\n2. Adicione as gotas de adoçante e misture bem.\n3. Leve ao micro-ondas por 30 segundos, mexa e repita até atingir a consistência desejada (cerca de 1-2 minutos no total).\n4. Deixe esfriar, enrole os brigadeiros e passe no café solúvel (se usar)."
  },
  {
    "id": "p_1722457200066_recipe_danoninho_fit",
    "type": "recipe",
    "title": "DANONINHO FIT",
    "category": "SOBREMESA",
    "code": "S, LT",
    "yield": "2 porções",
    "nutrition": {
      "cal": "120",
      "prot": "8g",
      "carb": "15g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de iogurte natural integral\n1/2 xícara de morangos congelados\nGotas de adoçante a gosto"
      }
    ],
    "prepSteps": "1. Bata todos os ingredientes no liquidificador até obter uma consistência cremosa e homogênea.\n2. Despeje em potinhos individuais e leve à geladeira por pelo menos 30 minutos antes de servir."
  },
  {
    "id": "p_1722457200063_recipe_docinho_de_uva",
    "type": "recipe",
    "title": "DOCINHO DE UVA",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "8 docinhos",
    "nutrition": {
      "cal": "60",
      "prot": "2g",
      "carb": "10g",
      "fat": "2g"
    },
    "macroNote": "Valores referentes a 1 docinho.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "8 uvas grandes sem sementes\n1/2 xícara de leite em pó desnatado\n2 colheres de sopa de água\nGotas de adoçante a gosto\nCoco ralado sem açúcar para decorar (opcional)"
      }
    ],
    "prepSteps": "1. Lave e seque bem as uvas.\n2. Em um recipiente, misture o leite em pó com a água e as gotas de adoçante até formar uma pasta.\n3. Envolva cada uva com uma porção da pasta, modelando um docinho.\n4. Se desejar, passe no coco ralado sem açúcar.\n5. Leve à geladeira por pelo menos 30 minutos antes de servir."
  },
  {
    "id": "p_1722457200058_recipe_flan_de_chocolate",
    "type": "recipe",
    "title": "FLAN DE CHOCOLATE",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "120",
      "prot": "8g",
      "carb": "15g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de leite (ou bebida vegetal)\n2 colheres de sopa de cacau em pó 100%\n1 colher de sopa de amido de milho\nGotas de adoçante a gosto"
      }
    ],
    "prepSteps": "1. Em uma panela, misture o leite, cacau em pó e amido de milho até dissolver bem.\n2. Leve ao fogo médio, mexendo sempre, até engrossar.\n3. Adicione as gotas de adoçante e misture.\n4. Despeje em potinhos individuais e leve à geladeira por pelo menos 2 horas antes de servir."
  },
  {
    "id": "p_1722457200061_recipe_mousse_de_cafe",
    "type": "recipe",
    "title": "MOUSSE DE CAFÉ",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "160",
      "prot": "8g",
      "carb": "18g",
      "fat": "7g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de iogurte natural integral\n2 colheres de sopa de café solúvel (dissolvido em um pouco de água quente)\nGotas de adoçante a gosto\nCacau em pó para decorar (opcional)"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o iogurte natural com o café dissolvido e as gotas de adoçante até ficar homogêneo.\n2. Leve à geladeira por pelo menos 1 hora para firmar.\n3. Sirva com cacau em pó (se usar)."
  },
  {
    "id": "p_1722457200059_recipe_mousse_de_chocolate",
    "type": "recipe",
    "title": "MOUSSE DE CHOCOLATE",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "180",
      "prot": "10g",
      "carb": "20g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de iogurte natural integral\n2 colheres de sopa de cacau em pó 100%\nGotas de adoçante a gosto\nRaspas de chocolate amargo para decorar (opcional)"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o iogurte natural com o cacau em pó e as gotas de adoçante até ficar homogêneo.\n2. Leve à geladeira por pelo menos 1 hora para firmar.\n3. Sirva com raspas de chocolate amargo (se usar)."
  },
  {
    "id": "p_1722457200060_recipe_mousse_de_maracuja",
    "type": "recipe",
    "title": "MOUSSE DE MARACUJÁ",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "150",
      "prot": "8g",
      "carb": "18g",
      "fat": "6g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de iogurte natural integral\nPolpa de 1 maracujá\nGotas de adoçante a gosto"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o iogurte natural com a polpa do maracujá e as gotas de adoçante até ficar homogêneo.\n2. Leve à geladeira por pelo menos 1 hora para firmar.\n3. Sirva."
  },
  {
    "id": "p_1722457200057_recipe_muffin_de_chocolate",
    "type": "recipe",
    "title": "MUFFIN DE CHOCOLATE",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "4 muffins",
    "nutrition": {
      "cal": "150",
      "prot": "5g",
      "carb": "20g",
      "fat": "7g"
    },
    "macroNote": "Valores referentes a 1 muffin.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n1/2 xícara de farinha de aveia\n1/4 xícara de cacau em pó 100%\n1/2 xícara de leite (ou bebida vegetal)\n1/4 xícara de adoçante culinário\n1 colher de chá de fermento em pó\nGotas de chocolate amargo (opcional)"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, farinha de aveia, cacau, leite e adoçante até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Distribua a massa em forminhas de muffin (untadas ou com forminhas de papel).\n4. Se usar, adicione gotas de chocolate por cima.\n5. Leve ao forno pré-aquecido a 180°C por cerca de 20-25 minutos, ou até assar e dourar."
  },
  {
    "id": "p_1722457200064_recipe_pipoca_doce",
    "type": "recipe",
    "title": "PIPOCA DOCE",
    "category": "LANCHE",
    "code": "LT, S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "150",
      "prot": "3g",
      "carb": "25g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1/2 xícara de milho para pipoca\n1 colher de sopa de óleo de coco\n2 colheres de sopa de adoçante culinário ou xilitol\n1 colher de sopa de cacau em pó 100% (opcional)"
      }
    ],
    "prepSteps": "1. Em uma panela grande, aqueça o óleo de coco. Adicione o milho e tampe.\n2. Mexa a panela ocasionalmente até que todos os grãos estourem.\n3. Em outra panela, misture o adoçante e o cacau (se usar). Leve ao fogo baixo até derreter um pouco.\n4. Despeje a pipoca na panela com o adoçante derretido e misture rapidamente para cobrir todas as pipocas.\n5. Espalhe em uma assadeira para esfriar e não grudar."
  },
  {
    "id": "p_new_prestigio_fit",
    "type": TEMPLATES.RECIPE,
    "title": "PRESTÍGIO FIT (SEM WHEY)",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "4 porções",
    "nutrition": {
      "cal": "150",
      "prot": "5g",
      "carb": "15g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Recheio de Coco",
        "items": "1 xícara de coco ralado sem açúcar\n1/2 xícara de leite de coco\n2 colheres de sopa de adoçante culinário"
      },
      {
        "title": "Cobertura de Chocolate",
        "items": "100g de chocolate amargo (70% cacau ou mais)\n2 colheres de sopa de leite de coco"
      }
    ],
    "prepSteps": "1. **Recheio:** Em uma panela, misture o coco ralado, leite de coco e adoçante. Leve ao fogo baixo, mexendo sempre, até desgrudar do fundo da panela. Deixe esfriar e modele pequenas barrinhas ou bolinhas.\n2. **Cobertura:** Derreta o chocolate amargo em banho-maria ou micro-ondas. Adicione o leite de coco e misture até ficar homogêneo.\n3. Banhe as barrinhas de coco no chocolate derretido. Leve à geladeira até o chocolate endurecer."
  },
  {
    "id": "p_1722457200062_recipe_pudim",
    "type": "recipe",
    "title": "PUDIM",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "90",
      "prot": "10g",
      "carb": "10g",
      "fat": "0g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "3 claras de ovo\n1/2 xícara de leite (ou bebida vegetal)\nGotas de adoçante a gosto\nEssência de baunilha a gosto"
      }
    ],
    "prepSteps": "1. Em um recipiente, bata as claras em neve.\n2. Em outra tigela, misture o leite, adoçante e essência de baunilha.\n3. Incorpore delicadamente as claras em neve à mistura de leite.\n4. Despeje em forminhas individuais (untadas com um pouco de óleo de coco, se necessário).\n5. Cozinhe em banho-maria no forno pré-aquecido a 180°C por cerca de 20-25 minutos, ou até firmar.\n6. Leve à geladeira para esfriar antes de servir."
  },
  {
    "id": "p_1722457200022_recipe_pudim_chia_frutas",
    "type": "recipe",
    "title": "PUDIM DE CHIA COM GELATINA E FRUTAS",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "200",
      "prot": "8g",
      "carb": "25g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 colheres de sopa de chia\n1 xícara de leite (ou bebida vegetal)\nFrutas picadas a gosto\nMel ou adoçante a gosto"
      }
    ],
    "prepSteps": "1. Em um pote com tampa, misture a chia com o leite e o mel/adoçante.\n2. Leve à geladeira por pelo menos 4 horas ou durante a noite.\n3. No momento de servir, adicione as frutas picadas."
  },
  {
    "id": "p_1722457200072_recipe_pao_de_mel",
    "type": "recipe",
    "title": "PÃO DE MEL",
    "category": "SOBREMESA",
    "code": "S, CM",
    "yield": "4 pães de mel",
    "nutrition": {
      "cal": "180",
      "prot": "5g",
      "carb": "30g",
      "fat": "6g"
    },
    "macroNote": "Valores referentes a 1 pão de mel.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n1/4 xícara de mel\n1/4 xícara de leite (ou bebida vegetal)\n1/2 xícara de farinha de trigo integral\n1 colher de sopa de cacau em pó 100%\n1 colher de chá de especiarias (canela, cravo, gengibre)\n1 colher de chá de fermento em pó"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o ovo, mel, leite, farinha, cacau e especiarias até ficar homogêneo.\n2. Adicione o fermento em pó e misture delicadamente.\n3. Despeje a massa em forminhas de pão de mel (untadas e enfarinhadas).\n4. Leve ao forno pré-aquecido a 180°C por cerca de 20-25 minutos, ou até assar.\n5. Se desejar, cubra com chocolate amargo derretido."
  },
  {
    "id": "p_1722457200023_recipe_sorvete_manga_fit",
    "type": "recipe",
    "title": "SORVETE DE MANGA FIT",
    "category": "SOBREMESA",
    "code": "S",
    "yield": "2 porções",
    "nutrition": {
      "cal": "120",
      "prot": "2g",
      "carb": "30g",
      "fat": "1g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 manga madura congelada em cubos\n1/4 xícara de água ou leite de coco (opcional)"
      }
    ],
    "prepSteps": "1. Bata a manga congelada no processador ou liquidificador até obter uma consistência cremosa.\n2. Se necessário, adicione um pouco de água ou leite de coco para ajudar a bater.\n3. Sirva imediatamente ou leve ao freezer por mais alguns minutos para firmar."
  },
  {
    "id": "p_section_cafe_da_manha_lanches_rapidos",
    "type": "section",
    "title": "CAFÉ DA MANHÃ & LANCHES RÁPIDOS",
    "subtitle": "Comece o dia com energia"
  },
  {
    "id": "p_1722457200021_recipe_crepioca",
    "type": "recipe",
    "title": "CREPIOCA",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "150",
      "prot": "10g",
      "carb": "15g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n2 colheres de sopa de goma de tapioca\nSal a gosto\nRecheio a gosto (queijo, frango desfiado, legumes)"
      }
    ],
    "prepSteps": "1. Em um recipiente, bata o ovo com a goma de tapioca e o sal.\n2. Aqueça uma frigideira antiaderente e despeje a massa.\n3. Cozinhe em fogo baixo até firmar e dourar dos dois lados.\n4. Recheie a gosto e dobre ao meio."
  },
  {
    "id": "p_new_crepioca_doce",
    "type": TEMPLATES.RECIPE,
    "title": "CREPIOCA DOCE COM BANANA",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "220",
      "prot": "10g",
      "carb": "30g",
      "fat": "7g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n2 colheres de sopa de goma de tapioca\n1/2 banana amassada\nCanela a gosto\nRecheio a gosto (pasta de amendoim, mel, frutas)"
      }
    ],
    "prepSteps": "1. Em um recipiente, bata o ovo com a goma de tapioca, banana amassada e canela.\n2. Aqueça uma frigideira antiaderente e despeje a massa.\n3. Cozinhe em fogo baixo até firmar e dourar dos dois lados.\n4. Recheie a gosto e dobre ao meio."
  },
  {
    "id": "p_1722457200015_recipe_overnight_oats",
    "type": "recipe",
    "title": "OVERNIGHT OATS",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "250",
      "prot": "10g",
      "carb": "35g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1/2 xícara de aveia em flocos\n1 xícara de leite (ou bebida vegetal)\n1 colher de sopa de chia\nFrutas picadas a gosto (banana, morango, mirtilo)\nMel ou adoçante a gosto"
      }
    ],
    "prepSteps": "1. Em um pote com tampa, misture a aveia, o leite e a chia.\n2. Leve à geladeira por pelo menos 4 horas ou durante a noite.\n3. No momento de servir, adicione as frutas picadas e o mel/adoçante."
  },
  {
    "id": "p_1722457200014_recipe_panqueca",
    "type": "recipe",
    "title": "PANQUECA FIT",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "180",
      "prot": "15g",
      "carb": "20g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n2 colheres de sopa de aveia\n1/4 xícara de leite (ou bebida vegetal)\n1 colher de chá de fermento em pó\nCanela a gosto"
      }
    ],
    "prepSteps": "1. Bata todos os ingredientes no liquidificador ou com um garfo até ficar homogêneo.\n2. Aqueça uma frigideira antiaderente e despeje a massa.\n3. Cozinhe em fogo baixo até dourar dos dois lados.\n4. Sirva com frutas, mel ou pasta de amendoim."
  },
  {
    "id": "p_1722457200027_recipe_pao_com_carne_moida",
    "type": "recipe",
    "title": "PÃO COM CARNE MOÍDA",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "350",
      "prot": "30g",
      "carb": "30g",
      "fat": "12g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 pães franceses integrais\n200g de carne moída magra\n1/2 cebola picada\n1 dente de alho picado\nMolho de tomate a gosto\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. Refogue a cebola e o alho em um fio de azeite.\n2. Adicione a carne moída e cozinhe até dourar.\n3. Acrescente o molho de tomate, sal, pimenta e cheiro verde. Cozinhe por mais alguns minutos.\n4. Abra os pães, recheie com a carne moída e sirva."
  },
  {
    "id": "p_1722457200028_recipe_sanduiche_natural",
    "type": "recipe",
    "title": "SANDUÍCHE NATURAL",
    "category": "LANCHE",
    "code": "LT, A",
    "yield": "1 porção",
    "nutrition": {
      "cal": "280",
      "prot": "20g",
      "carb": "30g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 fatias de pão integral\n100g de frango desfiado ou atum\n1 colher de sopa de maionese light ou iogurte natural\nAlface, tomate e cenoura ralada a gosto\nSal e pimenta do reino a gosto"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o frango/atum com a maionese/iogurte, sal e pimenta.\n2. Monte o sanduíche com as fatias de pão, a pasta, alface, tomate e cenoura.\n3. Sirva."
  },
  {
    "id": "p_1722457200020_recipe_toast_atum_cremoso",
    "type": "recipe",
    "title": "TOAST DE ATUM CREMOSO",
    "category": "LANCHE",
    "code": "LT, J",
    "yield": "1 porção",
    "nutrition": {
      "cal": "280",
      "prot": "25g",
      "carb": "20g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 fatias de pão integral\n1 lata de atum light (escorrido)\n1 colher de sopa de cream cheese light ou requeijão light\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o atum escorrido com o cream cheese/requeijão, sal, pimenta e cheiro verde.\n2. Torre as fatias de pão.\n3. Espalhe a pasta de atum sobre o pão torrado e sirva."
  },
  {
    "id": "p_1722457200016_recipe_waffle_doce",
    "type": "recipe",
    "title": "WAFFLE DOCE",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "2 waffles",
    "nutrition": {
      "cal": "220",
      "prot": "12g",
      "carb": "25g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 2 waffles.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n3 colheres de sopa de farinha de aveia\n1/4 xícara de leite (ou bebida vegetal)\n1 colher de chá de fermento em pó\nGotas de adoçante ou mel a gosto"
      }
    ],
    "prepSteps": "1. Misture todos os ingredientes até obter uma massa homogênea.\n2. Aqueça a máquina de waffle e despeje a massa.\n3. Cozinhe até dourar.\n4. Sirva com frutas e iogurte."
  },
  {
    "id": "p_1722457200017_recipe_waffle_salgado",
    "type": "recipe",
    "title": "WAFFLE SALGADO",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "2 waffles",
    "nutrition": {
      "cal": "200",
      "prot": "18g",
      "carb": "15g",
      "fat": "7g"
    },
    "macroNote": "Valores referentes a 2 waffles.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 ovo\n3 colheres de sopa de farinha de aveia\n1/4 xícara de leite (ou bebida vegetal)\nSal e pimenta do reino a gosto\nQueijo cottage ou frango desfiado para rechear"
      }
    ],
    "prepSteps": "1. Misture o ovo, a farinha de aveia, o leite, sal e pimenta.\n2. Despeje na máquina de waffle aquecida e cozinhe até dourar.\n3. Recheie com queijo cottage, frango desfiado ou outros recheios salgados de sua preferência."
  },
  {
    "id": "p_section_salgados_e_refeicoes",
    "type": "section",
    "title": "SALGADOS E REFEIÇÕES",
    "subtitle": "Refeições completas e nutritivas"
  },
  {
    "id": "p_1722457200039_recipe_arroz_fraldinha_desfiada",
    "type": "recipe",
    "title": "ARROZ COM FRALDINHA DESFIADA",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "480",
      "prot": "35g",
      "carb": "50g",
      "fat": "18g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Fraldinha Desfiada",
        "items": "200g de fraldinha cozida e desfiada\n1/2 cebola picada\n1 dente de alho picado\nMolho de tomate\nSal, pimenta do reino e cheiro verde a gosto"
      },
      {
        "title": "Arroz",
        "items": "1 xícara de arroz integral cozido"
      }
    ],
    "prepSteps": "1. **Fraldinha:** Refogue a cebola e o alho, adicione a fraldinha desfiada, molho de tomate, sal, pimenta e cheiro verde. Cozinhe por alguns minutos.\n2. Sirva a fraldinha desfiada sobre o arroz integral cozido."
  },
  {
    "id": "p_1722457200043_recipe_coxinha_fit",
    "type": "recipe",
    "title": "COXINHA FIT",
    "category": "LANCHE",
    "code": "LT, A",
    "yield": "8 coxinhas",
    "nutrition": {
      "cal": "130",
      "prot": "10g",
      "carb": "15g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 coxinha.",
    "ingredientGroups": [
      {
        "title": "Massa",
        "items": "2 batatas doces médias cozidas e amassadas\n1/2 xícara de farinha de aveia\nSal a gosto"
      },
      {
        "title": "Recheio",
        "items": "200g de frango cozido e desfiado\n1/4 cebola picada\n1 dente de alho picado\nSal, pimenta do reino e cheiro verde a gosto"
      },
      {
        "title": "Para Empanar",
        "items": "1 ovo batido\nFarinha de rosca integral ou farelo de aveia"
      }
    ],
    "prepSteps": "1. **Massa:** Misture a batata doce amassada com a farinha de aveia e o sal até formar uma massa homogênea.\n2. **Recheio:** Refogue a cebola e o alho, adicione o frango desfiado e tempere a gosto.\n3. Abra pequenas porções da massa na palma da mão, recheie com o frango e modele as coxinhas.\n4. Passe as coxinhas no ovo batido e depois na farinha de rosca/farelo de aveia.\n5. Leve ao forno pré-aquecido a 180°C por cerca de 25-30 minutos, ou até dourar."
  },
  {
    "id": "p_1722457200037_recipe_croquete_frango",
    "type": "recipe",
    "title": "CROQUETE DE FRANGO",
    "category": "LANCHE",
    "code": "LT, A",
    "yield": "6 croquetes",
    "nutrition": {
      "cal": "120",
      "prot": "10g",
      "carb": "10g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 croquete.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "200g de frango cozido e desfiado\n2 colheres de sopa de requeijão light\n1/4 xícara de farinha de aveia\nSal, pimenta do reino e cheiro verde a gosto\nFarinha de rosca integral para empanar\nAzeite para untar"
      }
    ],
    "prepSteps": "1. Em um recipiente, misture o frango desfiado com o requeijão light, farinha de aveia, sal, pimenta e cheiro verde até formar uma massa homogênea.\n2. Modele os croquetes e passe-os na farinha de rosca integral.\n3. Unte uma assadeira com azeite e disponha os croquetes.\n4. Leve ao forno pré-aquecido a 180°C por cerca de 20-25 minutos, virando na metade do tempo, ou até dourar."
  },
  {
    "id": "p_1722457200033_recipe_frango_com_creme_de_batata",
    "type": "recipe",
    "title": "FRANGO COM CREME DE BATATA",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "400",
      "prot": "35g",
      "carb": "40g",
      "fat": "12g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Frango",
        "items": "200g de peito de frango em cubos\n1/2 cebola picada\n1 dente de alho picado\nMolho de tomate\nSal, pimenta do reino e cheiro verde a gosto"
      },
      {
        "title": "Creme de Batata",
        "items": "2 batatas médias cozidas e amassadas\n1/4 xícara de leite (ou bebida vegetal)\n1 colher de sopa de requeijão light (opcional)\nSal e noz-moscada a gosto"
      }
    ],
    "prepSteps": "1. **Frango:** Refogue a cebola e o alho, adicione o frango e cozinhe até dourar. Acrescente o molho de tomate, sal, pimenta e cheiro verde. Cozinhe por alguns minutos.\n2. **Creme de Batata:** Misture as batatas amassadas com o leite, requeijão (se usar), sal e noz-moscada até obter um creme homogêneo.\n3. Em um refratário, coloque o frango e cubra com o creme de batata.\n4. Leve ao forno para gratinar por cerca de 15 minutos."
  },
  {
    "id": "p_1722457200034_recipe_frango_cremoso_brocolis",
    "type": "recipe",
    "title": "FRANGO CREMOSO COM BRÓCOLIS",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "380",
      "prot": "38g",
      "carb": "25g",
      "fat": "15g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "200g de peito de frango em cubos\n1 xícara de brócolis cozido\n1/2 cebola picada\n1 dente de alho picado\n1/2 xícara de creme de leite light ou iogurte natural\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. Refogue a cebola e o alho em um fio de azeite.\n2. Adicione o frango em cubos e cozinhe até dourar.\n3. Acrescente o brócolis cozido e o creme de leite light/iogurte natural.\n4. Tempere com sal, pimenta do reino e cheiro verde. Cozinhe por alguns minutos até o molho encorpar.\n5. Sirva com arroz integral ou batata doce."
  },
  {
    "id": "p_1722457200032_recipe_frango_empanado",
    "type": "recipe",
    "title": "FRANGO EMPANADO",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "300",
      "prot": "35g",
      "carb": "20g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 filés de frango\n1 ovo batido\n1 xícara de farinha de rosca integral ou farelo de aveia\nTemperos a gosto (sal, pimenta, páprica)\nAzeite para untar"
      }
    ],
    "prepSteps": "1. Tempere os filés de frango com sal, pimenta e páprica.\n2. Passe cada filé no ovo batido e depois na farinha de rosca/farelo de aveia, cobrindo bem.\n3. Unte uma assadeira com azeite e disponha os filés.\n4. Leve ao forno pré-aquecido a 200°C por cerca de 20-25 minutos, virando na metade do tempo, ou até dourar e cozinhar por completo."
  },
  {
    "id": "p_1722457200036_recipe_hamburguer_fit",
    "type": "recipe",
    "title": "HAMBÚRGUER FIT",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 hambúrgueres",
    "nutrition": {
      "cal": "320",
      "prot": "30g",
      "carb": "25g",
      "fat": "12g"
    },
    "macroNote": "Valores referentes a 1 hambúrguer.",
    "ingredientGroups": [
      {
        "title": "Hambúrguer",
        "items": "200g de carne moída magra\n1/4 cebola picada\n1 dente de alho picado\nSal, pimenta do reino e cheiro verde a gosto"
      },
      {
        "title": "Montagem",
        "items": "2 pães de hambúrguer integrais\nAlface, tomate, cebola roxa a gosto\nQueijo muçarela light (opcional)\nMolhos light a gosto"
      }
    ],
    "prepSteps": "1. **Hambúrguer:** Misture a carne moída com a cebola, alho, sal, pimenta e cheiro verde. Modele 2 hambúrgueres.\n2. Grelhe os hambúrgueres em uma frigideira antiaderente ou chapa até o ponto desejado.\n3. Se for usar queijo, coloque sobre o hambúrguer nos últimos minutos para derreter.\n4. Monte o hambúrguer com o pão, alface, tomate, cebola e molhos light."
  },
  {
    "id": "p_1722457200038_recipe_macarrao_cremoso_brocolis",
    "type": "recipe",
    "title": "MACARRÃO CREMOSO COM BRÓCOLIS",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "420",
      "prot": "20g",
      "carb": "50g",
      "fat": "15g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "150g de macarrão integral\n1 xícara de brócolis cozido\n1/2 cebola picada\n1 dente de alho picado\n1/2 xícara de creme de leite light ou iogurte natural\nQueijo parmesão light ralado a gosto\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. Cozinhe o macarrão integral conforme as instruções da embalagem.\n2. Em outra panela, refogue a cebola e o alho em um fio de azeite.\n3. Adicione o brócolis cozido e o creme de leite light/iogurte natural. Tempere com sal e pimenta.\n4. Misture o molho ao macarrão cozido.\n5. Finalize com queijo parmesão light ralado e cheiro verde."
  },
  {
    "id": "p_1722457200029_recipe_mini_pizza_fit",
    "type": "recipe",
    "title": "MINI PIZZA FIT",
    "category": "LANCHE",
    "code": "LT, J",
    "yield": "2 mini pizzas",
    "nutrition": {
      "cal": "200",
      "prot": "15g",
      "carb": "20g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 mini pizza.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "2 pães sírios integrais ou tortilhas\nMolho de tomate\nQueijo muçarela light\nRecheio a gosto (frango desfiado, legumes, peito de peru)\nOrégano a gosto"
      }
    ],
    "prepSteps": "1. Espalhe o molho de tomate sobre os pães/tortilhas.\n2. Cubra com queijo muçarela light e o recheio de sua preferência.\n3. Leve ao forno pré-aquecido a 180°C por cerca de 10-15 minutos, ou até o queijo derreter e dourar.\n4. Salpique orégano e sirva."
  },
  {
    "id": "p_1722457200040_recipe_pastelzinho_fit",
    "type": "recipe",
    "title": "PASTELZINHO FIT",
    "category": "LANCHE",
    "code": "LT, A",
    "yield": "6 pasteizinhos",
    "nutrition": {
      "cal": "150",
      "prot": "10g",
      "carb": "15g",
      "fat": "6g"
    },
    "macroNote": "Valores referentes a 1 pastelzinho.",
    "ingredientGroups": [
      {
        "title": "Massa",
        "items": "1 xícara de farinha de trigo integral\n2 colheres de sopa de azeite\nÁgua morna o suficiente para dar ponto\nSal a gosto"
      },
      {
        "title": "Recheio",
        "items": "150g de carne moída magra ou frango desfiado\n1/4 cebola picada\n1 dente de alho picado\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. **Massa:** Misture a farinha, azeite e sal. Adicione água morna aos poucos até formar uma massa homogênea. Abra a massa com um rolo e corte em círculos.\n2. **Recheio:** Refogue a cebola e o alho, adicione a carne/frango e cozinhe. Tempere a gosto.\n3. Recheie os círculos de massa, feche bem as bordas com um garfo.\n4. Leve ao forno pré-aquecido a 180°C por cerca de 20 minutos, ou até dourar."
  },
  {
    "id": "p_1722457200035_recipe_tiras_carne_creme_batata",
    "type": "recipe",
    "title": "TIRAS DE CARNE COM CREME DE BATATA",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 porções",
    "nutrition": {
      "cal": "450",
      "prot": "40g",
      "carb": "45g",
      "fat": "18g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Carne",
        "items": "200g de carne bovina magra em tiras (patinho, alcatra)\n1/2 cebola picada\n1 dente de alho picado\nMolho inglês ou shoyu light a gosto\nSal, pimenta do reino a gosto"
      },
      {
        "title": "Creme de Batata",
        "items": "2 batatas médias cozidas e amassadas\n1/4 xícara de leite (ou bebida vegetal)\n1 colher de sopa de requeijão light (opcional)\nSal e noz-moscada a gosto"
      }
    ],
    "prepSteps": "1. **Carne:** Refogue a cebola e o alho, adicione as tiras de carne e cozinhe até dourar. Acrescente o molho inglês/shoyu, sal e pimenta. Cozinhe por alguns minutos.\n2. **Creme de Batata:** Misture as batatas amassadas com o leite, requeijão (se usar), sal e noz-moscada até obter um creme homogêneo.\n3. Em um refratário, coloque a carne e cubra com o creme de batata.\n4. Leve ao forno para gratinar por cerca de 15 minutos."
  },
  {
    "id": "p_1722457200030_recipe_tortinha_frango_fit",
    "type": "recipe",
    "title": "TORTINHA DE FRANGO FIT",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 tortinhas",
    "nutrition": {
      "cal": "280",
      "prot": "25g",
      "carb": "20g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 tortinha.",
    "ingredientGroups": [
      {
        "title": "Massa",
        "items": "1 xícara de farinha de aveia\n2 colheres de sopa de azeite\nÁgua gelada o suficiente para dar ponto"
      },
      {
        "title": "Recheio",
        "items": "200g de frango desfiado\n1/2 cebola picada\n1 dente de alho picado\nMolho de tomate\nMilho e ervilha a gosto\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. **Massa:** Misture a farinha de aveia com o azeite e adicione água gelada aos poucos até formar uma massa homogênea. Forre forminhas de torta.\n2. **Recheio:** Refogue a cebola e o alho, adicione o frango desfiado, molho de tomate, milho, ervilha, sal, pimenta e cheiro verde. Cozinhe por alguns minutos.\n3. Recheie as tortinhas com o frango.\n4. Leve ao forno pré-aquecido a 180°C por cerca de 20-25 minutos, ou até dourar."
  },
  {
    "id": "p_1722457200031_recipe_tortinha_frango_fit_ii",
    "type": "recipe",
    "title": "TORTINHA DE FRANGO FIT II",
    "category": "ALMOÇO",
    "code": "A, J",
    "yield": "2 tortinhas",
    "nutrition": {
      "cal": "280",
      "prot": "25g",
      "carb": "20g",
      "fat": "10g"
    },
    "macroNote": "Valores referentes a 1 tortinha.",
    "ingredientGroups": [
      {
        "title": "Massa",
        "items": "1 xícara de farinha de aveia\n2 colheres de sopa de azeite\nÁgua gelada o suficiente para dar ponto"
      },
      {
        "title": "Recheio",
        "items": "200g de frango desfiado\n1/2 cebola picada\n1 dente de alho picado\nMolho de tomate\nMilho e ervilha a gosto\nSal, pimenta do reino e cheiro verde a gosto"
      }
    ],
    "prepSteps": "1. **Massa:** Misture a farinha de aveia com o azeite e adicione água gelada aos poucos até formar uma massa homogênea. Forre forminhas de torta.\n2. **Recheio:** Refogue a cebola e o alho, adicione o frango desfiado, molho de tomate, milho, ervilha, sal, pimenta e cheiro verde. Cozinhe por alguns minutos.\n3. Recheie as tortinhas com o frango.\n4. Leve ao forno pré-aquecido a 180°C por cerca de 20-25 minutos, ou até dourar."
  },
  {
    "id": "p_section_shakes_e_iogurtes",
    "type": "section",
    "title": "SHAKES E IOGURTES",
    "subtitle": "Refresque-se e nutra-se"
  },
  {
    "id": "p_1722457200019_recipe_iogurte_geleia_morango",
    "type": "recipe",
    "title": "IOGURTE COM GELEIA DE MORANGO",
    "category": "CAFÉ DA MANHÃ",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "150",
      "prot": "10g",
      "carb": "20g",
      "fat": "4g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 pote de iogurte natural\n5 morangos picados\n1 colher de chá de chia\nAdoçante a gosto"
      }
    ],
    "prepSteps": "1. Em uma panela pequena, cozinhe os morangos picados com um pouco de água e adoçante até formar uma geleia.\n2. Deixe esfriar e misture a chia.\n3. Sirva a geleia sobre o iogurte natural."
  },
  {
    "id": "p_1722457200018_recipe_iogurte_natural_infinito",
    "type": "recipe",
    "title": "IOGURTE NATURAL INFINITO",
    "category": "BASE",
    "code": "B",
    "yield": "Várias porções",
    "nutrition": {
      "cal": "60",
      "prot": "6g",
      "carb": "4g",
      "fat": "2g"
    },
    "macroNote": "Valores por 100g.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 litro de leite integral ou semidesnatado\n1 pote de iogurte natural integral (170g) com fermento vivo"
      }
    ],
    "prepSteps": "1. Aqueça o leite até quase ferver (85-90°C). Desligue o fogo e deixe amornar até 45°C (você consegue manter o dedo por 10 segundos).\n2. Em um recipiente, misture o iogurte natural com um pouco do leite morno até dissolver bem.\n3. Adicione essa mistura ao restante do leite, mexendo delicadamente.\n4. Tampe o recipiente e envolva-o em um pano de prato ou cobertor para manter a temperatura.\n5. Deixe descansar em um local sem corrente de ar por 6 a 8 horas (ou durante a noite).\n6. Após esse tempo, leve à geladeira por pelo menos 2 horas antes de consumir.\n7. Para fazer a próxima leva, reserve 3 colheres de sopa do seu iogurte pronto e repita o processo."
  },
  {
    "id": "p_1722457200025_recipe_milkshake_de_cafe",
    "type": "recipe",
    "title": "MILK SHAKE DE CAFÉ",
    "category": "LANCHE",
    "code": "LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "220",
      "prot": "10g",
      "carb": "30g",
      "fat": "7g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 xícara de café forte e frio\n1/2 xícara de leite (ou bebida vegetal)\n1 bola de sorvete de creme light ou iogurte congelado\nGotas de adoçante a gosto\nGelo a gosto"
      }
    ],
    "prepSteps": "1. Bata todos os ingredientes no liquidificador até ficar cremoso.\n2. Sirva imediatamente."
  },
  {
    "id": "p_1722457200024_recipe_milkshake_proteico",
    "type": "recipe",
    "title": "MILKSHAKE PROTEICO",
    "category": "LANCHE",
    "code": "LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "280",
      "prot": "30g",
      "carb": "25g",
      "fat": "8g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 scoop de whey protein (sabor de sua preferência)\n200ml de leite (ou bebida vegetal)\n1 banana congelada\n1 colher de sopa de pasta de amendoim (opcional)\nGelo a gosto"
      }
    ],
    "prepSteps": "1. Bata todos os ingredientes no liquidificador até obter uma mistura homogênea e cremosa.\n2. Sirva imediatamente."
  },
  {
    "id": "p_1722457200076_recipe_shake_laxativo",
    "type": "recipe",
    "title": "SHAKE LAXATIVO",
    "category": "BEBIDA",
    "code": "CM, LT",
    "yield": "1 porção",
    "nutrition": {
      "cal": "180",
      "prot": "5g",
      "carb": "30g",
      "fat": "5g"
    },
    "macroNote": "Valores referentes a 1 porção.",
    "ingredientGroups": [
      {
        "title": "Ingredientes",
        "items": "1 copo de água ou água de coco\n1/2 mamão papaia\n1 colher de sopa de farelo de aveia\n1 colher de sopa de linhaça\n5 ameixas secas sem caroço\nGotas de adoçante (opcional)"
      }
    ],
    "prepSteps": "1. Bata todos os ingredientes no liquidificador até obter uma mistura homogênea.\n2. Sirva imediatamente, preferencialmente em jejum ou antes de dormir."
  },
  {
    "id": "p_1722457200077_shopping",
    "type": "shopping",
    "title": "Listinha de Compras",
    "hortifruti": "Maçãs\nBananas\nMorangos\Mirtilos\nAbacaxi\nManga\nLimão\nLaranja\nAbóbora\nBatata doce\nBrócolis\nCouve\nEspinafre\nCenoura\nTomate\nPepino\nCebola\nAlho\nChuchu\nMilho",
    "acougue": "Peito de frango\nCarne moída magra (patinho, alcatra)\nFraldinha",
    "laticinios": "Leite integral/semidesnatado\nIogurte natural integral\nRequeijão light\nCream cheese light\nQueijo muçarela light",
    "padaria": "Aveia em flocos\nFarinha de aveia\nGoma de tapioca\nPão integral\nPão sírio/tortilhas\nFarinha de rosca integral\nFarinha de trigo integral\nFarinha de milho",
    "mercearia": "Chia\nLinhaça\nCacau em pó 100%\nAdoçante culinário/xilitol\nMel\nÓleo de coco\nAzeite\nVinagre de maçã\nVinagre balsâmico\nMostarda dijon\nMolho de tomate\nMolho inglês/shoyu light\nAtum light em lata\nGrão de bico\nAmeixas secas\nLeite em pó desnatado\nCoco ralado sem açúcar\nEspeciarias (canela, cravo, gengibre)\nCafé solúvel\nFermento em pó\nAmido de milho\nEssência de baunilha\nGotas de chocolate amargo\nUvas"
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