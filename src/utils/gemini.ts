// Para usar a API Gemini de forma segura, você deve configurar um backend proxy
// para proteger sua API Key. Expor a chave diretamente no frontend não é recomendado.
// Por enquanto, usaremos uma variável de ambiente para a chave.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const geminiModelName = import.meta.env.VITE_GEMINI_MODEL_NAME || "gemini-2.5-flash-preview-09-2025"; // Modelo configurável

export const callGemini = async (prompt: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key não configurada. Por favor, adicione VITE_GEMINI_API_KEY ao seu arquivo .env");
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName}:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    
    const res = await fetch(url, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Erro na API Gemini: ${res.status} ${res.statusText} - ${errorBody}`);
    }

    const data = await res.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
        throw new Error("Resposta da IA vazia ou inesperada.");
    }
    return data.candidates[0].content.parts[0].text;
};