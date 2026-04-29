import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiInstagram, FiGithub, FiMail } from 'react-icons/fi'
import './App.css'

const API_BASE = 'http://localhost:3000'

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
      const url = generoFiltro ? `${API_BASE}/filmes/genero?nome=${generoFiltro}` : `${API_BASE}/filmes`
      const { data } = await axios.get(url)
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
      await axios.post(`${API_BASE}/filmes`, { titulo, genero })
      setTitulo('')
      setGenero('')
      fetchFilmes(filtroGenero)
    } catch (error) {
      console.error('Erro ao adicionar filme:', error)
      alert(error.response?.data?.error || 'Erro ao adicionar filme')
    }
  }

  const handleFileChange = async (id, e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('poster', file)
    
    try {
      const { data: uploadResponse } = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      await axios.put(`${API_BASE}/filmes/${id}`, { poster: uploadResponse.url })
      
      fetchFilmes(filtroGenero)
      alert('Imagem atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar poster:', error)
      alert('Erro ao atualizar a imagem. Tente novamente.')
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
            <button onClick={() => fetchFilmes(filtroGenero)}>Filtrar</button>
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
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 Catálogo de Filmes. Todos os direitos reservados.</p>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
              <FiInstagram size={24} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
              <FiGithub size={24} />
            </a>
            <a href="mailto:contato@example.com" title="Email">
              <FiMail size={24} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
