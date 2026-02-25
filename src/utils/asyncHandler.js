/**
 * asyncHandler
 * Envuelve funciones async de Express para capturar errores
 * y pasarlos al middleware global de errores (next(err)).
 * Elimina la necesidad de bloques try/catch en cada controlador.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
