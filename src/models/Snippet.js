const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema(
    {
        // Mongoose Reference: vincula el snippet con su propietario (User)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            minlength: [3, 'El título debe tener al menos 3 caracteres'],
            trim: true,
        },
        language: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
        },
        code: {
            type: String,
            required: [true, 'El código es obligatorio'],
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Snippet', SnippetSchema);
