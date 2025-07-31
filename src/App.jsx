import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nome, setNome] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [nivel, setNivel] = useState('');
  const [vagas, setVagas] = useState([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosUsuario');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      setNome(dados.nome);
      setTecnologias(dados.tecnologias);
      setNivel(dados.nivel);
    }
  }, []);

  const buscarVagas = async () => {
    const query = `${tecnologias} ${nivel} developer remote`;
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setVagas(data.data.slice(0, 10));
      setMostrarResultado(true);
    } catch  {
      setVagas([]);
      setMostrarResultado(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dados = { nome, tecnologias, nivel };
    localStorage.setItem('dadosUsuario', JSON.stringify(dados));
    buscarVagas();
  };

  return (
    <div className="container">
      <h1>Sua Vaga Dev</h1>
      {!mostrarResultado ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Digite seu nome:</label><br />
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label>Tecnologias que você conhece:</label><br />
            <input
              type="text"
              value={tecnologias}
              onChange={(e) => setTecnologias(e.target.value)}
              placeholder="Ex: React, JS, CSS"
            />
          </div>

          <div>
            <label>Nível de experiência:</label><br />
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="estagio">Estágio</option>
              <option value="junior">Júnior</option>
              <option value="pleno">Pleno</option>
              <option value="senior">Sênior</option>
            </select>
          </div>

          <button type="submit">Começar</button>
        </form>
      ) : (
        <div>
          <h2>Olá {nome}, essas são as vagas que mais se encaixam no seu perfil:</h2>
          <ul>
            {vagas.map((vaga) => (
              <li key={vaga.job_id}>
                <a
                  href={vaga.job_apply_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {vaga.job_title} - {vaga.employer_name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
