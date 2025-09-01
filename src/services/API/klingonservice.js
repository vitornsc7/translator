const FUNTRANSLATIONS_URL = "https://api.funtranslations.com/translate/klingon.json";

async function translateToKlingon(text) {
  try {
    const formData = new URLSearchParams();
    formData.append("text", text);

    const response = await fetch(FUNTRANSLATIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (response.ok) {
      const data = await response.json();
      // A resposta da API FunTranslations vem em: data.contents.translated
      return { translated: data.contents.translated };
    } else {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error?.message || `Erro ${response.status}: ${response.statusText}`;
      return { error: message };
    }
  } catch (error) {
    return { error: error.message || "Erro desconhecido ao chamar a API." };
  }
}

export async function translate(idiom, text) {
  if (idiom === "klingon") {
    return translateToKlingon(text);
  } else {
    return { error: "Idioma não suportado." };
  }
}