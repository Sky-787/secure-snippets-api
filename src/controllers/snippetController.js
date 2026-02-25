const Snippet = require('../models/Snippet');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Crear un nuevo snippet
// @route   POST /api/v1/snippets
// @access  Private
const createSnippet = asyncHandler(async (req, res) => {
    const { title, language, code, tags } = req.body;

    // El usuario SIEMPRE viene del JWT (req.user), nunca del body
    const snippet = await Snippet.create({
        user: req.user._id,
        title,
        language,
        code,
        tags,
    });

    res.status(201).json({ success: true, data: snippet });
});

// @desc    Listar snippets del usuario autenticado
// @route   GET /api/v1/snippets
// @access  Private
const getSnippets = asyncHandler(async (req, res) => {
    // Solo devuelve los snippets del usuario actual (filtro por user)
    const snippets = await Snippet.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: snippets.length, data: snippets });
});

// @desc    Editar un snippet (solo si pertenece al usuario)
// @route   PUT /api/v1/snippets/:id
// @access  Private
const updateSnippet = asyncHandler(async (req, res) => {
    const { title, language, code, tags } = req.body;

    // Buscar por _id Y por user (del JWT) — seguridad a nivel de datos
    const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user._id });

    if (!snippet) {
        // 404 para no revelar si el recurso existe (pero pertenece a otro)
        const err = new Error('Snippet no encontrado');
        err.statusCode = 404;
        throw err;
    }

    if (title !== undefined) snippet.title = title;
    if (language !== undefined) snippet.language = language;
    if (code !== undefined) snippet.code = code;
    if (tags !== undefined) snippet.tags = tags;

    const updatedSnippet = await snippet.save();

    res.status(200).json({ success: true, data: updatedSnippet });
});

// @desc    Eliminar un snippet (solo si pertenece al usuario)
// @route   DELETE /api/v1/snippets/:id
// @access  Private
const deleteSnippet = asyncHandler(async (req, res) => {
    // Buscar por _id Y por user (del JWT) — seguridad a nivel de datos
    const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user._id });

    if (!snippet) {
        // 404 para no revelar si el recurso existe (pero pertenece a otro)
        const err = new Error('Snippet no encontrado');
        err.statusCode = 404;
        throw err;
    }

    await snippet.deleteOne();

    res.status(200).json({ success: true, message: 'Snippet eliminado exitosamente' });
});

module.exports = { createSnippet, getSnippets, updateSnippet, deleteSnippet };
