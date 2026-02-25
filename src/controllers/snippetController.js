const Snippet = require('../models/Snippet');

// @desc    Crear un nuevo snippet
// @route   POST /api/v1/snippets
// @access  Private
const createSnippet = async (req, res) => {
    const { title, language, code, tags } = req.body;

    try {
        // El usuario se asigna automáticamente desde el token (req.user)
        const snippet = await Snippet.create({
            user: req.user._id,
            title,
            language,
            code,
            tags,
        });

        res.status(201).json(snippet);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el snippet', error: error.message });
    }
};

// @desc    Listar snippets del usuario autenticado
// @route   GET /api/v1/snippets
// @access  Private
const getSnippets = async (req, res) => {
    try {
        // Solo devuelve los snippets del usuario actual
        const snippets = await Snippet.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json(snippets);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los snippets', error: error.message });
    }
};

// @desc    Editar un snippet (solo si pertenece al usuario)
// @route   PUT /api/v1/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
    const { title, language, code, tags } = req.body;

    try {
        // Buscar por _id Y por user para garantizar la propiedad
        const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user._id });

        if (!snippet) {
            return res.status(403).json({
                message: 'No autorizado: el snippet no existe o no te pertenece',
            });
        }

        // Actualizar los campos enviados
        if (title !== undefined) snippet.title = title;
        if (language !== undefined) snippet.language = language;
        if (code !== undefined) snippet.code = code;
        if (tags !== undefined) snippet.tags = tags;

        const updatedSnippet = await snippet.save();

        res.status(200).json(updatedSnippet);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el snippet', error: error.message });
    }
};

// @desc    Eliminar un snippet (solo si pertenece al usuario)
// @route   DELETE /api/v1/snippets/:id
// @access  Private
const deleteSnippet = async (req, res) => {
    try {
        // Buscar por _id Y por user para garantizar la propiedad
        const snippet = await Snippet.findOne({ _id: req.params.id, user: req.user._id });

        if (!snippet) {
            return res.status(403).json({
                message: 'No autorizado: el snippet no existe o no te pertenece',
            });
        }

        await snippet.deleteOne();

        res.status(200).json({ message: 'Snippet eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el snippet', error: error.message });
    }
};

module.exports = { createSnippet, getSnippets, updateSnippet, deleteSnippet };
