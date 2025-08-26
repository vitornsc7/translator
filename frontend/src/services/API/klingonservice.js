const BASE_URL = "http://localhost:8080/translate/";

async function translateToKlingon(text) {
  try {
    // EncodeURIComponent para evitar problemas com caracteres especiais
    const response = await fetch(`${BASE_URL}klingon?text=${encodeURIComponent(text)}`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      // data tem a forma: { original: "...", translated: "...", language: "klingon" }
      return { translated: data.translated };
    } else {
      // Se o backend retornar 4xx ou 5xx
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `Erro ${response.status}: ${response.statusText}`;
      return { error: message };
    }
  } catch (error) {
    return { error: error.message || "Erro desconhecido ao chamar o backend." };
  }
}

export async function translate(idiom, text) {
    if(idiom == "klingon") {
        return translateToKlingon(text);
    } else {
        return {error: "Error while translating."}
    }
}