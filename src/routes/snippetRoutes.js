const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, createSnippetRules, updateSnippetRules } = require('../middleware/validators');
const {
    createSnippet,
    getSnippets,
    updateSnippet,
    deleteSnippet,
} = require('../controllers/snippetController');

// Todos los endpoints están protegidos por el middleware JWT
router.use(protect);

// POST   /api/v1/snippets  → crear snippet (con validación)
// GET    /api/v1/snippets  → listar snippets del usuario actual
router.route('/')
    .post(createSnippetRules, validate, createSnippet)
    .get(getSnippets);

// PUT    /api/v1/snippets/:id  → editar (con validación, solo si es dueño)
// DELETE /api/v1/snippets/:id  → borrar (solo si es dueño)
router.route('/:id')
    .put(updateSnippetRules, validate, updateSnippet)
    .delete(deleteSnippet);

module.exports = router;
