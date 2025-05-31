const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Cargar JSON
const shows = JSON.parse(fs.readFileSync('./data/shows.json'));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({ mensaje: "Bienvenido al catálogo de Series con Express!" });
});

// Ruta: todas las series
app.get('/shows/all', (req, res) => {
    res.json(shows);
});

// Ruta: buscar por ID
app.get('/shows/id/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const show = shows.find(s => s.id === id);
    if (!show) {
        return res.status(404).json({ error: `Serie con ID ${id} no encontrada` });
    }

    res.json(show);
});

// Ruta: buscar por título parcial (insensible a mayúsculas)
app.get('/shows/titulo/:titulo', (req, res) => {
    const titulo = req.params.titulo.toLowerCase();
    const resultados = shows.filter(s => s.titulo.toLowerCase().includes(titulo));
    res.json(resultados);
});

// Ruta: verificar existencia exacta
app.get('/shows/existe/:titulo', (req, res) => {
    const titulo = req.params.titulo.toLowerCase();
    const existe = shows.some(s => s.titulo.toLowerCase() === titulo);
    res.json({ titulo, existe });
});

// Middleware 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});