require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares globales
app.use(express.json());

// Rutas
app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/snippets', require('./src/routes/snippetRoutes'));

// Ruta base
app.get('/', (req, res) => {
    res.json({ message: '🔒 DevLocker API v1 funcionando correctamente' });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor DevLocker corriendo en el puerto ${PORT}`);
});
