import { useState, useEffect } from 'react';
import './App.css';

/**
 * Banco de dados temporário de filmes para testes.
 * Cada filme contém atributos para comparação no jogo.
 */
const FILMES_DB = [
  { titulo: "Procurando Nemo", ano: 2003, genero: "Aventura", estudio: "Pixar", diretor: "Andrew Stanton", duracao: 100 },
  { titulo: "A Era do Gelo", ano: 2002, genero: "Comédia", estudio: "Blue Sky", diretor: "Chris Wedge", duracao: 81 },
  { titulo: "A Era do Gelo 2", ano: 2006, genero: "Comédia", estudio: "Blue Sky", diretor: "Carlos Saldanha", duracao: 91 },
  { titulo: "A Era do Gelo 3", ano: 2009, genero: "Comédia", estudio: "Blue Sky", diretor: "Carlos Saldanha", duracao: 94 },
  { titulo: "A Era do Gelo 4", ano: 2012, genero: "Comédia", estudio: "Blue Sky", diretor: "Steve Martino", duracao: 88 },
  { titulo: "A Era do Gelo: O Big Bang", ano: 2016, genero: "Comédia", estudio: "Blue Sky", diretor: "Mike Thurmeier", duracao: 94 },
  { titulo: "Toy Story", ano: 1995, genero: "Aventura", estudio: "Pixar", diretor: "John Lasseter", duracao: 81 },
  { titulo: "Shrek", ano: 2001, genero: "Comédia", estudio: "Dreamworks", diretor: "Andrew Adamson", duracao: 90 },
  { titulo: "Carros", ano: 2006, genero: "Aventura", estudio: "Pixar", diretor: "John Lasseter", duracao: 117 },
  { titulo: "Monstros S.A.", ano: 2001, genero: "Comédia", estudio: "Pixar", diretor: "Pete Docter", duracao: 92 },
  { titulo: "Interestelar", ano: 2014, genero: "Ficção Científica", estudio: "Warner Bros", diretor: "Christopher Nolan", duracao: 169 },
  { titulo: "O Poderoso Chefão", ano: 1972, genero: "Crime", estudio: "Paramount", diretor: "Francis Ford Coppola", duracao: 175 },
  { titulo: "Pulp Fiction", ano: 1994, genero: "Crime", estudio: "Miramax", diretor: "Quentin Tarantino", duracao: 154 },
  { titulo: "Batman: O Cavaleiro das Trevas", ano: 2008, genero: "Ação", estudio: "Warner Bros", diretor: "Christopher Nolan", duracao: 152 },
  { titulo: "Parasita", ano: 2019, genero: "Suspense", estudio: "CJ Entertainment", diretor: "Bong Joon-ho", duracao: 132 },
  { titulo: "Matrix", ano: 1999, genero: "Ficção Científica", estudio: "Warner Bros", diretor: "Lana Wachowski", duracao: 136 },
  { titulo: "O Rei Leão", ano: 1994, genero: "Animação", estudio: "Disney", diretor: "Roger Allers", duracao: 88 },
  { titulo: "Titanic", ano: 1997, genero: "Romance", estudio: "Paramount", diretor: "James Cameron", duracao: 194 },
  { titulo: "Vingadores: Ultimato", ano: 2019, genero: "Ação", estudio: "Marvel", diretor: "Anthony Russo", duracao: 181 },
  { titulo: "Coringa", ano: 2019, genero: "Drama", estudio: "Warner Bros", diretor: "Todd Phillips", duracao: 122 },
  { titulo: "O Silêncio dos Inocentes", ano: 1991, genero: "Suspense", estudio: "Orion", diretor: "Jonathan Demme", duracao: 118 },
  { titulo: "Forrest Gump", ano: 1994, genero: "Drama", estudio: "Paramount", diretor: "Robert Zemeckis", duracao: 142 },
  { titulo: "Clube da Luta", ano: 1999, genero: "Drama", estudio: "Fox", diretor: "David Fincher", duracao: 139 },
  { titulo: "Inception", ano: 2010, genero: "Ficção Científica", estudio: "Warner Bros", diretor: "Christopher Nolan", duracao: 148 },
  { titulo: "Jurassic Park", ano: 1993, genero: "Aventura", estudio: "Universal", diretor: "Steven Spielberg", duracao: 127 },
  { titulo: "O Exorcista", ano: 1973, genero: "Terror", estudio: "Warner Bros", diretor: "William Friedkin", duracao: 122 },
  { titulo: "La La Land", ano: 2016, genero: "Musical", estudio: "Summit Entertainment", diretor: "Damien Chazelle", duracao: 128 },
  { titulo: "Gladiador", ano: 2000, genero: "Ação", estudio: "DreamWorks", diretor: "Ridley Scott", duracao: 155 },
  { titulo: "A Viagem de Chihiro", ano: 2001, genero: "Animação", estudio: "Studio Ghibli", diretor: "Hayao Miyazaki", duracao: 125 },
  { titulo: "Cidade de Deus", ano: 2002, genero: "Drama", estudio: "O2 Filmes", diretor: "Fernando Meirelles", duracao: 130 }
];

function App() {
  // --- Estados do Jogo ---
  const [filmeDoDia, setFilmeDoDia] = useState(null);
  const [chute, setChute] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [tentativas, setTentativas] = useState([]);
  const [status, setStatus] = useState("jogando"); // 'jogando' ou 'venceu'
  const [mensagem, setMensagem] = useState("");

  
  useEffect(() => {
    // id do filme
    setFilmeDoDia(FILMES_DB[10]);
  }, []);

  /**
   * move acentos e converte para minúsculas para comparação de strings.
   */
  const normalizar = (str) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  /**
   * Gerencia a mudança no campo de input e filtra sugestões.
   */
  const handleInputChange = (e) => {
    const valor = e.target.value;
    setChute(valor);

    if (valor.trim().length > 0) {
      const valorNormalizado = normalizar(valor);
      const filtrados = FILMES_DB.filter(filme => 
        normalizar(filme.titulo).includes(valorNormalizado) &&
        !tentativas.some(t => normalizar(t.titulo) === normalizar(filme.titulo))
      ).slice(0, 5); 
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const selecionarSugestao = (titulo) => {
    setChute(titulo);
    setSugestoes([]);
  };

  /**
   * Processa o envio de um palpite.
   */
  const handleEnviarChute = (e) => {
    if (e) e.preventDefault();
    if (!chute.trim() || status !== "jogando") return;

    const filmeChutado = FILMES_DB.find(f => normalizar(f.titulo) === normalizar(chute));
    
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

    // Verifica vitória
    if (normalizar(filmeChutado.titulo) === normalizar(filmeDoDia.titulo)) {
      setStatus("venceu");
      setMensagem("Parabéns! Você acertou.");
    } else {
      setMensagem(""); 
    }

    setChute("");
    setSugestoes([]);
  };

  // --- Lógica de Comparação Visual ---

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

  // Renderização de carregamento
  if (!filmeDoDia) return <div className="loading">Carregando filme do dia...</div>;

  return (
    <div className="container">
      <header>
        <h1>DESCUBRA O FILME</h1>
        <br />
        <p className="subtitle">Boa sorte!</p>
      </header>

      <main className="game-area">
        {/* Seção de Entrada do Usuário */}
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
              <button type="submit" disabled={status !== "jogando"}>
                {status === "jogando" ? "CENA!" : "FIM"}
              </button>
            </form>

            {/* Lista de Sugestões (Autocomplete) */}
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
          {mensagem && <p className={`status-msg ${status}`}>{mensagem}</p>}
        </section>

        {/* Listagem de Tentativas Realizadas */}
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
                  <div className={`feedback-tag ${compareExact("genero", t.genero)}`}>
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

        {/* Controle de Reinício */}
        {status !== "jogando" && (
          <button className="reset-btn" onClick={() => window.location.reload()}>
            NOVA SESSÃO
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
