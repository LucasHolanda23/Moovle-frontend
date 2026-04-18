import { useState, useEffect } from 'react';
import './App.css';
import { AiFillAlert } from "react-icons/ai";
import api from '../services/api';

function App() {
 
  const [filmesDb, setFilmesDb] = useState([]);
  const [filmeDoDia, setFilmeDoDia] = useState(null);
  const [chute, setChute] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [tentativas, setTentativas] = useState([]);
  const [status, setStatus] = useState("jogando");
  const [mensagem, setMensagem] = useState("");
  const [mostrarTutorial, setMostrarTutorial] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resFilmes = await api.get('/filmes');
        const resFilmeDia = await api.get('/filme-do-dia');
        setFilmesDb(resFilmes.data);
        setFilmeDoDia(resFilmeDia.data);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        setMensagem("Erro ao conectar com o servidor.");
      }
    }
    carregarDados();
  }, []);

  const normalizar = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setChute(valor);

    if (valor.trim().length > 0) {
      const valorNormalizado = normalizar(valor);
      const filtrados = filmesDb.filter(filme =>
        normalizar(filme.titulo).includes(valorNormalizado) &&
        !tentativas.some(t => normalizar(t.titulo) === normalizar(filme.titulo))
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const selecionarSugestao = (titulo) => {
    setChute(titulo);
    setSugestoes([]);
  };

  const handleEnviarChute = (e) => {
    if (e) e.preventDefault();
    if (!chute.trim() || status !== "jogando") return;

    const filmeChutado = filmesDb.find(f => normalizar(f.titulo) === normalizar(chute));

    if (!filmeChutado) {
      setMensagem("Selecione um filme da lista.");
      return;
    }

    if (tentativas.some(t => normalizar(t.titulo) === normalizar(filmeChutado.titulo))) {
      setMensagem("Você já tentou este filme!");
      return;
    }

    const novasTentativas = [...tentativas, filmeChutado];
    setTentativas(novasTentativas);

    if (normalizar(filmeChutado.titulo) === normalizar(filmeDoDia.titulo)) {
      setStatus("venceu");
      setMensagem("Parabéns! Você acertou.");
    } else {
      setMensagem("");
    }

    setChute("");
    setSugestoes([]);
  };

  const handleDesistir = () => {
    if (status !== "jogando") return;
    setStatus("desistiu");
    setMensagem(`Você desistiu. O filme era: ${filmeDoDia.titulo}`);
  };

  const compareAno = (val) => {
    if (val === filmeDoDia.ano) return { cl: "match", txt: val };
    return { cl: "wrong", txt: `${val} ${val < filmeDoDia.ano ? "↑" : "↓"}` };
  };

  const compareDuracao = (val) => {
    if (val === filmeDoDia.duracao) return { cl: "match", txt: `${val} min` };
    return { cl: "wrong", txt: `${val} min ${val < filmeDoDia.duracao ? "↑" : "↓"}` };
  };

  const compareExact = (campo, val) => {
    return val === filmeDoDia[campo] ? "match" : "wrong";
  };

  const compareGenero = (val) => {
    // Normaliza para comparação (ignora maiúsculas/minúsculas)
    const listGuessed = val.toLowerCase().split(", ").map(g => g.trim());
    const listCorrect = filmeDoDia.genero.toLowerCase().split(", ").map(g => g.trim());

    // Se todos os gêneros baterem perfeitamente
    const allMatch = listGuessed.length === listCorrect.length && 
                     listGuessed.every(g => listCorrect.includes(g));
    if (allMatch) return "match";

    // Se pelo menos um gênero bater (amarelo/laranja)
    const someMatch = listGuessed.some(g => listCorrect.includes(g));
    if (someMatch) return "match partial";

    return "wrong";
  };

  if (!filmeDoDia) return <div className="loading">Carregando filme do dia...</div>;

  return (
    <div className="container">
      <header>
        <h1>DESCUBRA O FILME</h1>
        <br />
        <p className="subtitle">Que o filme esteja com voce !</p>
        <div className='icon-help'>
          <button onClick={() => setMostrarTutorial(true)}><AiFillAlert size={20} /></button>
        </div>
      </header>

      <main className="game-area">
        <section className="input-section">
          <div className="input-wrapper">
            <form onSubmit={handleEnviarChute}>
              <input
                type="text"
                value={chute}
                onChange={handleInputChange}
                placeholder="Qual filme você está pensando?"
                disabled={status !== "jogando"}
                autoComplete="off"
              />
              <button className="button-red" type="submit" disabled={status !== "jogando"}>
                {status === "jogando" ? "CHUTE" : "FIM"}
              </button>
            </form>
            {sugestoes.length > 0 && (
              <ul className="suggestions-list">
                {sugestoes.map((s, i) => (
                  <li key={i} className="suggestion-item" onClick={() => selecionarSugestao(s.titulo)}>
                    {s.titulo} ({s.ano})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="action-buttons">

            {
            //BUTAO DE DICA
            /* <button 
              className="button-outline" 
              onClick={() => {}} 
              disabled={status !== "jogando"}
            >
              DICA
            </button> */}
            <button 
              className="button-outline" 
              onClick={handleDesistir} 
              disabled={status !== "jogando"}
            >
              DESISTIR
            </button>
          </div>
          {mensagem && <p className={`status-msg ${status}`}>{mensagem}</p>}
        </section>

        <section className="tentativas-list">
          {tentativas.length > 0 && <h3>Suas Tentativas ({tentativas.length})</h3>}
          <ul>
            {[...tentativas].reverse().map((t, i) => (
              <li key={i} className="tentativa-item">
                <div className="tentativa-header">
                  <span className="tentativa-nome">{t.titulo}</span>
                </div>
                <div className="feedback-row">
                  <div className={`feedback-tag ${compareAno(t.ano).cl}`}>
                    <span className="tag-label">ANO</span>
                    <span>{compareAno(t.ano).txt}</span>
                  </div>
                  <div className={`feedback-tag ${compareGenero(t.genero)}`}>
                    <span className="tag-label">GÊNERO</span>
                    <span>{t.genero}</span>
                  </div>
                  <div className={`feedback-tag ${compareDuracao(t.duracao).cl}`}>
                    <span className="tag-label">DURAÇÃO</span>
                    <span>{compareDuracao(t.duracao).txt}</span>
                  </div>
                  <div className={`feedback-tag ${compareExact("estudio", t.estudio)}`}>
                    <span className="tag-label">ESTÚDIO</span>
                    <span>{t.estudio}</span>
                  </div>
                  <div className={`feedback-tag ${compareExact("diretor", t.diretor)}`}>
                    <span className="tag-label">DIRETOR</span>
                    <span>{t.diretor}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {status !== "jogando" && (
          <button className="reset-btn" onClick={() => window.location.reload()}>
            NOVA SESSÃO
          </button>
        )}
      </main>

      {mostrarTutorial && (
        <div className="modal-overlay" onClick={() => setMostrarTutorial(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Como Jogar</h2>
            <p>Descubra o filme do dia em quantas tentativas precisar!</p>
            <ul>
              <li>Digite o nome de um filme no campo de busca.</li>
              <li>Cada tentativa mostrará dicas baseadas no filme secreto:</li>
              <li><span className="text-match">Verde</span>: Acerto exato em todos os campos.</li>
              <li><span className="text-partial">Amarelo</span>: Acerto parcial (pelo menos um gênero em comum).</li>
              <li><span className="text-wrong">Cinza</span>: Erro total (nenhuma correspondência).</li>
              <li><span className="text-match">↑ / ↓</span>: O ano ou duração é maior ou menor.</li>
            </ul>
            <button className="button-red" onClick={() => setMostrarTutorial(false)}>
              ENTENDI!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
