const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createSnippet,
    getSnippets,
    updateSnippet,
    deleteSnippet,
} = require('../controllers/snippetController');

// Todos los endpoints están protegidos por el middleware JWT
router.use(protect);

// POST   /api/v1/snippets      → crear snippet (asignado al usuario logueado)
// GET    /api/v1/snippets      → listar snippets del usuario actual
router.route('/').post(createSnippet).get(getSnippets);

// PUT    /api/v1/snippets/:id  → editar snippet (solo si pertenece al usuario)
// DELETE /api/v1/snippets/:id  → borrar snippet (solo si pertenece al usuario)
router.route('/:id').put(updateSnippet).delete(deleteSnippet);

module.exports = router;
