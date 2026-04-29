import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [filmes, setFilmes] = useState([])
  const [titulo, setTitulo] = useState('')
  const [genero, setGenero] = useState('')
  const [filtroGenero, setFiltroGenero] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFilmes()
  }, [])

  const fetchFilmes = async (generoFiltro = '') => {
    setLoading(true)
    try {
      const url = generoFiltro ? `http://localhost:3000/filmes/genero?nome=${generoFiltro}` : 'http://localhost:3000/filmes'
      const response = await fetch(url)
      const data = await response.json()
      setFilmes(data)
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
    } finally {
      setLoading(false)
    }
  }

  const adicionarFilme = async (e) => {
    e.preventDefault()
    if (!titulo || !genero) return
    try {
      const response = await fetch('http://localhost:3000/filmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo, genero })
      })
      if (response.ok) {
        setTitulo('')
        setGenero('')
        fetchFilmes(filtroGenero)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Erro ao adicionar filme:', error)
    }
  }

  const handleFileChange = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('poster', file);
    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      await fetch(`http://localhost:3000/filmes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poster: data.url })
      });
      fetchFilmes(filtroGenero);
    } catch (error) {
      console.error('Erro ao atualizar poster:', error);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Catálogo de Filmes</h1>
      </header>
      <main className="main">
        <section className="form-section">
          <h2>Adicionar Novo Filme</h2>
          <form onSubmit={adicionarFilme} className="form">
            <input
              type="text"
              placeholder="Título do Filme"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Gênero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            />
            <button type="submit">Adicionar</button>
          </form>
        </section>
        <section className="filter-section">
          <h2>Filtrar por Gênero</h2>
          <div className="filter">
            <input
              type="text"
              placeholder="Digite o gênero"
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
            />
            <button onClick={filtrarPorGenero}>Filtrar</button>
            <button onClick={() => { setFiltroGenero(''); fetchFilmes() }}>Limpar</button>
          </div>
        </section>
        <section className="movies-section">
          <h2>Filmes</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="movies-grid">
              {filmes.map(filme => (
                <div key={filme.id} className="movie-card">
                  {filme.poster ? (
                    <img src={filme.poster} alt={filme.titulo} />
                  ) : (
                    <div className="no-image">Sem Imagem</div>
                  )}
                  <h3>{filme.titulo}</h3>
                  <p>{filme.genero}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(filme.id, e)}
                    className="file-input"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
