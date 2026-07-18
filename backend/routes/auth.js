const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// POST - Registro de nuevos usuarios
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar si el email ya existe
    const checkQuery = 'SELECT id FROM usuarios WHERE email = ?';
    const [existing] = await db.query(checkQuery, [email]);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insertar nuevo usuario
    const query = `
      INSERT INTO usuarios (nombre, email, telefono, password_hash, rol)
      VALUES (?, ?, ?, ?, 'cliente')
    `;

    const [result] = await db.query(query, [nombre, email, telefono || null, password_hash]);

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message });
  }
});

// POST - Login de usuarios
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email
    const query = 'SELECT * FROM usuarios WHERE email = ? AND activo = 1';
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Retornar usuario sin la contraseña
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      exito: true,
      mensaje: 'Login exitoso',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
});

module.exports = router;