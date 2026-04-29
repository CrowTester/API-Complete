//Essential imports for the server work;

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

//Array of filmes for simulantion a database;
let filmes = [
    { id: 1, titulo: 'O Senhor dos Anéis', genero: 'Fantasia', poster: null },
    { id: 2, titulo: 'Matrix', genero: 'Ficção Científica', poster: null },
    { id: 3, titulo: 'O Pequenino', genero: 'Comédia', poster: null },
    { id: 4, titulo: 'Capitão América: guerra civil', genero: 'Ficção Científica', poster: null }
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

app.post('/upload', upload.single('poster'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }
  res.json({ url: `http://localhost:3000/uploads/${req.file.filename}` });
});

app.post('/filmes', async (req, res) => {
    const { titulo, genero } = req.body;
    if (!titulo || !genero) {
        return res.status(400).json({ error: 'Título e gênero são obrigatórios' });
    }
    const filmeExistente = filmes.find(f => f.titulo === titulo);
    if (filmeExistente) {
        return res.status(400).json({ error: 'Este filme já está cadastrado' });
    }

    const poster = await getPoster(titulo);
    const id = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;
    const novoFilme = { id, titulo, genero, poster };
    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

//System call DELETE;

app.delete('/filmes', (req, res) => {
  const { titulo } = req.body;
  filmes = filmes.filter(f => f.titulo !== titulo);
  res.json(filmes);
});

app.put('/filmes/:id', async (req, res) => {
  const { id } = req.params;
  const { poster } = req.body;
  const filme = filmes.find(f => f.id == id);
  if (!filme) {
    return res.status(404).json({ error: 'Filme não encontrado' });
  }
  filme.poster = poster;
  res.json(filme);
});

//System call open door 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});