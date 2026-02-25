const { body, validationResult } = require('express-validator');

/**
 * Middleware para leer los resultados de express-validator
 * y devolver un 400 con los errores si los hay.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Error de validación',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

// --- Reglas de validación para Auth ---
const registerRules = [
    body('username')
        .trim()
        .notEmpty().withMessage('El nombre de usuario es obligatorio')
        .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Ingresa un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Ingresa un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
];

// --- Reglas de validación para Snippets ---
const createSnippetRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),

    body('code')
        .notEmpty().withMessage('El código es obligatorio'),

    body('language')
        .optional()
        .trim()
        .isString().withMessage('El lenguaje debe ser texto'),

    body('tags')
        .optional()
        .isArray().withMessage('Los tags deben ser un arreglo'),
];

const updateSnippetRules = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('El título debe tener al menos 3 caracteres'),

    body('code')
        .optional()
        .notEmpty().withMessage('El código no puede estar vacío'),

    body('language')
        .optional()
        .trim()
        .isString().withMessage('El lenguaje debe ser texto'),

    body('tags')
        .optional()
        .isArray().withMessage('Los tags deben ser un arreglo'),
];

module.exports = {
    validate,
    registerRules,
    loginRules,
    createSnippetRules,
    updateSnippetRules,
};
