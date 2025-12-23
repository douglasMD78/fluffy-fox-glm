// Para usar a API Gemini de forma segura, você deve configurar um backend proxy
// para proteger sua API Key. Expor a chave diretamente no frontend não é recomendado.
// Por enquanto, usaremos uma variável de ambiente para a chave.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 

export const callGemini = async (prompt: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key não configurada. Por favor, adicione VITE_GEMINI_API_KEY ao seu arquivo .env");
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    return data.candidates[0].content.parts[0].text;
};