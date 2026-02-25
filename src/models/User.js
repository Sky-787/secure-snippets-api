const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'El nombre de usuario es obligatorio'],
            unique: true,
            trim: true,
            minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido'],
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        },
    },
    { timestamps: true }
);

// Pre-save hook: hashear la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
    // Solo hashear si la contraseña fue modificada (o es nueva)
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método de instancia: comparar contraseñas
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
