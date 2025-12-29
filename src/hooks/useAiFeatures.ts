import React, { useState } from 'react';
import { toast } from 'sonner';
import { callGemini } from '@/utils/gemini';
import { TEMPLATES } from '@/lib/constants';
import { PageData, RecipePageData, IntroPageData, ShoppingPageData, recipeSchema, introSchema, shoppingSchema, INITIAL_DATA } from '@/data/initialData';
import { z } from 'zod';

interface UseAiFeaturesProps {
    pages: PageData[];
    setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
    updatePage: (newData: Partial<PageData>) => void;
    setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useAiFeatures = ({ pages, setPages, updatePage, setSelectedId }: UseAiFeaturesProps) => {
    const [showImporter, setShowImporter] = useState(false);
    const [importText, setImportText] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [magicModal, setMagicModal] = useState({ isOpen: false, type: 'recipe', title: '', description: '', placeholder: '', prompt: '' });
    const [isMagicGenerating, setIsMagicGenerating] = useState(false);

    const organizeRecipeWithAI = async () => {
        if (!importText.trim()) {
            toast.info("Por favor, cole o texto da receita para organizar.");
            return;
        }
        setIsImporting(true);
        try {
            const prompt = `Organize esta receita em JSON estrito: "${importText}". Para "prepSteps" e "ingredientGroups.items", use uma string com cada item/passo em uma nova linha (sem numeração ou marcadores). Para "tips" e "storage", permita **negrito** com markdown. Valores nutricionais (cal, prot, carb, fat) devem ser **strings**. Para 'prot', 'carb', 'fat', inclua 'g' no final (ex: "5g"). Para 'cal', inclua o número (inteiro ou decimal) como string (ex: "110" ou "67.8"). Formato: { "title": "...", "category": "...", "yield": "...", "nutrition": { "cal": "STRING_NUMERIC_VALUE", "prot": "STRING_NUMERIC_VALUE_WITH_G", "carb": "STRING_NUMERIC_VALUE_WITH_G", "fat": "STRING_NUMERIC_VALUE_WITH_G" }, "ingredientGroups": [{ "title": "...", "items": "item 1\\nitem 2" }], "prepSteps": "Primeiro passo\\nSegundo passo", "tips": "Dica com **negrito**", "storage": "Armazenamento com **negrito**" }. Sem markdown para o JSON em si.`;
            const text = await callGemini(prompt);
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const parsedData = JSON.parse(cleanJson);
            const validatedData = recipeSchema.parse(parsedData);

            const newId = `p_${Date.now()}`;
            const pageData = { id: newId, type: TEMPLATES.RECIPE, ...JSON.parse(JSON.stringify(INITIAL_DATA[TEMPLATES.RECIPE])), ...validatedData };
            setPages([...pages, pageData]); 
            setSelectedId(newId); 
            setShowImporter(false); 
            setImportText("");
            toast.success("Receita organizada e adicionada com sucesso!");

        } catch (err: any) { 
            console.error("Erro ao organizar receita com IA:", err);
            if (err instanceof z.ZodError) {
                toast.error("Erro de validação: A IA retornou um formato inesperado. Tente ajustar o texto ou o prompt. Detalhes: " + err.errors.map((e: any) => e.message).join(', '));
            } else if (err instanceof SyntaxError) {
                toast.error("Erro de formato JSON: A IA retornou um JSON inválido. Tente novamente.");
            } else {
                toast.error("Erro ao organizar receita: " + err.message); 
            }
        } finally { 
            setIsImporting(false); 
        }
    };

    const handleMagicSubmit = async () => {
        if (!magicModal.prompt.trim()) {
            toast.info("Por favor, digite um prompt para a IA gerar o conteúdo.");
            return;
        }
        setIsMagicGenerating(true);
        try {
            let prompt = "";
            let schemaToValidate: z.ZodSchema<any>;

            if (magicModal.type === 'recipe') {
                prompt = `Crie receita JSON para: "${magicModal.prompt}". Para "prepSteps" e "ingredientGroups.items", use uma string com cada item/passo em uma nova linha (sem numeração ou marcadores). Para "tips" e "storage", permita **negrito** com markdown. Valores nutricionais (cal, prot, carb, fat) devem ser **strings**. Para 'prot', 'carb', 'fat', inclua 'g' no final (ex: "5g"). Para 'cal', inclua o número (inteiro ou decimal) como string (ex: "110" ou "67.8"). Chaves: title, category, yield, nutrition, ingredientGroups, prepSteps, tips, storage. Formato de prepSteps: "Primeiro passo\\nSegundo passo". Sem markdown para o JSON em si.`;
                schemaToValidate = recipeSchema;
            } else if (magicModal.type === 'intro') {
                prompt = `Escreva intro curta para ebook sobre: "${magicModal.prompt}". Permita **negrito** com markdown. Texto puro.`;
                schemaToValidate = introSchema;
            } else if (magicModal.type === 'shopping') {
                prompt = `Crie lista compras JSON para dieta: "${magicModal.prompt}". Chaves: hortifruti, acougue, laticinios, padaria, mercearia. Sem markdown para o JSON em si.`;
                schemaToValidate = shoppingSchema;
            } else {
                throw new Error("Tipo de modal mágico desconhecido.");
            }
           
            const text = await callGemini(prompt);
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            if (magicModal.type === 'recipe') {
                const parsedData = JSON.parse(cleanText);
                const validatedData = schemaToValidate.parse(parsedData);
                const newId = `p_${Date.now()}`;
                setPages([...pages, { id: newId, type: TEMPLATES.RECIPE, ...INITIAL_DATA[TEMPLATES.RECIPE], ...validatedData as Partial<RecipePageData> }]);
                setSelectedId(newId);
            } else if (magicModal.type === 'intro') {
                const parsedData = { text: cleanText };
                const validatedData = schemaToValidate.parse(parsedData);
                updatePage(validatedData);
            }
            else if (magicModal.type === 'shopping') {
                const parsedData = JSON.parse(cleanText);
                const validatedData = schemaToValidate.parse(parsedData);
                updatePage(validatedData);
            }
           
            setMagicModal({ ...magicModal, isOpen: false, prompt: '' });
            toast.success("Conteúdo gerado com IA com sucesso!");

        } catch (err: any) { 
            console.error("Erro na IA:", err);
            if (err instanceof z.ZodError) {
                toast.error("Erro de validação: A IA retornou um formato inesperado. Tente ajustar o prompt. Detalhes: " + err.errors.map((e: any) => e.message).join(', '));
            } else if (err instanceof SyntaxError) {
                toast.error("Erro de formato JSON: A IA retornou um JSON inválido. Tente novamente.");
            } else {
                toast.error("Erro ao gerar conteúdo com IA: " + err.message); 
            }
        } finally { 
            setIsMagicGenerating(false); 
        }
    };

    const openMagicModal = (type: 'recipe' | 'intro' | 'shopping') => {
        let title = '';
        let description = '';
        let placeholder = '';
        if (type === 'recipe') {
            title = 'Receita Mágica com IA';
            description = 'Descreva a receita que você deseja criar (ex: "Bolo de cenoura fit com cobertura de chocolate").';
            placeholder = 'Ex: Torta de frango cremosa low carb';
        } else if (type === 'intro') {
            title = 'Escrever Introdução com IA';
            description = 'Descreva o tema do seu e-book para a IA escrever uma introdução (ex: "E-book de receitas saudáveis para emagrecimento").';
            placeholder = 'Ex: E-book de marmitas fitness para semana';
        } else if (type === 'shopping') {
            title = 'Gerar Lista de Compras com IA';
            description = 'Descreva o tipo de dieta ou refeições para a IA gerar uma lista de compras (ex: "Dieta mediterrânea para 7 dias").';
            placeholder = 'Ex: Lista de compras para dieta vegana';
        }
        setMagicModal({ isOpen: true, type, title, description, placeholder, prompt: '' });
    };

    return {
        showImporter,
        setShowImporter,
        importText,
        setImportText,
        isImporting,
        organizeRecipeWithAI,
        magicModal,
        setMagicModal,
        isMagicGenerating,
        handleMagicSubmit,
        openMagicModal,
    };
};