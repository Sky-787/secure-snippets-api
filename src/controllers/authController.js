const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Generar JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        res.statusCode = 400;
        throw new Error('El usuario o email ya está registrado');
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token: generateToken(user._id),
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
});

// @desc    Iniciar sesión
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.statusCode = 401;
        throw new Error('Credenciales inválidas');
    }

    res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        token: generateToken(user._id),
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
});

module.exports = { register, login };
