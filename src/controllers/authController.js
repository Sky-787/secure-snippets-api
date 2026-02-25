const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario o email ya está registrado' });
        }

        // Crear usuario (el pre-save hook se encarga del hash)
        const user = await User.create({ username, email, password });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token: generateToken(user._id),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

// @desc    Iniciar sesión
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: generateToken(user._id),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

module.exports = { register, login };
