import { useState } from "react";
import "./App.css"; // estilos separados

function App() {
  const [texto, setTexto] = useState("");
  const [idioma, setIdioma] = useState("yoda");
  const [resultado, setResultado] = useState("> Aguardando input...");
  const [loading, setLoading] = useState(false);

  const traduzir = async () => {
    if (!texto.trim()) {
      setResultado("> Digite um texto para traduzir.");
      return;
    }

    setLoading(true);
    setResultado("");

    try {
      const response = await fetch(
        `https://api.funtranslations.com/translate/${idioma}.json`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ text: texto }),
        }
      );

      const data = await response.json();
      if (data.contents) {
        setResultado(`> ${data.contents.translated}`);
      } else {
        setResultado("> ⚠️ Erro ou limite da API atingido.");
      }
    } catch (e) {
      setResultado("> ❌ Erro ao traduzir.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Fun Translation</h2>

      <textarea
        rows="4"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="> Digite seu texto em português."
      />

      <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
        <option value="yoda">Yoda</option>
        <option value="pirate">Pirata</option>
        <option value="minion">Minion</option>
        <option value="valyrian">Valyrian</option>
        <option value="klingon">Klingon</option>
      </select>

      <button onClick={traduzir} disabled={loading}>
        {loading ? "[ Traduzindo... ]" : "[ Traduzir ]"}
      </button>

      <div className="resultado">{resultado}</div>
    </div>
  );
}

export default App;
