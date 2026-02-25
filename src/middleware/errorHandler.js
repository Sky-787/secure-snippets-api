/**
 * Middleware global de manejo de errores.
 * Devuelve siempre JSON con formato consistente:
 * { success: false, status, message }
 *
 * Debe registrarse DESPUÉS de todas las rutas en server.js
 * con firma de 4 parámetros: (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error interno del servidor';

    // CastError de Mongoose: ID con formato inválido (ej: "abc")
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `ID inválido: ${err.value}`;
    }

    // ValidationError de Mongoose: campos requeridos o minlength, etc.
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
    }

    // Clave duplicada (email o username ya registrado)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `El campo '${field}' ya está en uso`;
    }

    // Error de JWT inválido o expirado
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'El token ha expirado';
    }

    console.error(`[ERROR] ${statusCode} - ${message}`);

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
    });
};

module.exports = errorHandler;
