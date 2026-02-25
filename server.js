require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

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
    res.json({ success: true, message: 'DevLocker API v1 funcionando correctamente' });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ success: false, status: 404, message: 'Ruta no encontrada' });
});

// Middleware global de errores (debe ir al final, con 4 parámetros)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor DevLocker corriendo en el puerto ${PORT}`);
});
