import { useState } from "react";
import { translate } from "../src/services/API/klingonservice"; // import do service
import "./App.css";

function App() {
  const [texto, setTexto] = useState("");
  const [idioma, setIdioma] = useState("yoda");
  const [resultado, setResultado] = useState("> Waiting input...");
  const [loading, setLoading] = useState(false);

  const traduzir = async () => {
    if (!texto.trim()) {
      setResultado("> Digite um texto para traduzir.");
      return;
    }

    setLoading(true);
    setResultado("");

    try {
      let translated;

      const res = await translate(idioma, texto);
      
      if (res.translated) {
        translated = res.translated;
      } else {
        translated = `> ⚠️ ${res.error}`;
      }

      setResultado(`> ${translated}`);
    } catch (e) {
      setResultado("> ❌ Erro ao traduzir.");
      console.log(e);
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
        placeholder="> Type your text in english."
      />

      <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
        <option value="yoda">Yoda</option>
        <option value="pirate">Pirata</option>
        <option value="minion">Minion</option>
        <option value="valyrian">Valyrian</option>
        <option value="klingon">Klingon</option>
      </select>

      <button onClick={traduzir} disabled={loading}>
        {loading ? "[ Traduzindo... ]" : "[ Translate ]"}
      </button>

      <div className="resultado">{resultado}</div>
    </div>
  );
}

export default App;
