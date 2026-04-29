//Essential imports for the server work;

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Array of filmes for simulantion a database;
let filmes = [
    { id: 1, titulo: 'O Senhor dos Anéis', genero: 'Fantasia' },
    { id: 2, titulo: 'Matrix', genero: 'Ficção Científica' },
    { id: 3, titulo: 'O Pequenino', genero: 'Comédia' },
    { id: 4, titulo: 'Capitão América: guerra civil', genero: 'Ficção Científica' }
]

//System call GET;
app.get('/filmes', (req, res) => {
    res.json(filmes);
});

app.get('/filmes/genero', (req, res) => {
    const nome = req.query.nome;
    if (!nome) {
        return res.status(400).json({ error: 'Parâmetro nome é obrigatório' });
    }
    const filmesFiltrados = filmes.filter(f => f.genero.toLowerCase() === nome.toLowerCase());
    res.json(filmesFiltrados);
});

//System call POST;

app.post('/filmes', (req, res) => {
    const { titulo, genero } = req.body;
    if (!titulo || !genero) {
        return res.status(400).json({ error: 'Título e gênero são obrigatórios' });
    }
    const filmeExistente = filmes.find(f => f.titulo === titulo);
    if (filmeExistente) {
        return res.status(400).json({ error: 'Este filme já está cadastrado' });
    }

    const id = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;
    const novoFilme = { id, titulo, genero };
    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

//System call DELETE;

app.delete('/filmes', (req, res) => {
  const { titulo } = req.body;
  filmes = filmes.filter(f => f.titulo !== titulo);
  res.json(filmes);
});

//System call open door 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});