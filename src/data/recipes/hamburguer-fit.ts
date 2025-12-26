import { TEMPLATES, ColumnRatioKey } from "@/lib/constants";
import { RecipePageData } from "@/data/initialData";

export const HAMBURGUER_FIT_RECIPE: RecipePageData = {
    id: 'p_hamburguer_fit',
    type: TEMPLATES.RECIPE,
    title: "HAMBÚRGUER FIT",
    category: "Salgados e Refeições",
    code: "A, J",
    yield: "6 hambúrgueres",
    nutrition: { cal: "297", prot: "28g", carb: "24g", fat: "9g" },
    macroNote: "Informações Nutricionais considerando a Montagem de um Hambúrguer Completo (um blend de 150g de carne, pão e complementos)",
    ingredientGroups: [
        {
            title: "Ingredientes",
            items: "900g de patinho moído (rende 6 hambúrgueres)\n2 dentes de alho picados\n1 colher de chá de pimenta-do-reino\nSal a gosto\n1 colher de sopa de água (para dar suculência na carne ao fritar)"
        }
    ],
    prepSteps: "Modele os Hambúrgueres: Tempere a carne moída com alho, pimenta-do-reino e sal. Misture bem para distribuir os temperos.\nDivida a carne em 6 porções de 150g e pese cada uma com o auxílio de uma balança coberta com plástico filme. Modele os hambúrgueres manualmente ou utilizando um modelador.\nResfrie para Firmar: Coloque os hambúrgueres no congelador por alguns minutos antes de fritar. Isso ajuda a manter o formato e evitar que desmanchem na frigideira.\nGrelhe os Hambúrgueres: Aqueça uma frigideira antiaderente e adicione um pouco de água para manter a carne suculenta. Grelhe cada hambúrguer em fogo médio-alto até dourar bem dos dois lados.",
    tips: "",
    storage: "**Geladeira**: Até 3 dias em recipiente fechado.\n**Congelador**: Até 3 meses, embalados individualmente em plástico filme ou saquinhos próprios.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Imagem de exemplo
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
};