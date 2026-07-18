const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todos los cupones activos
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM cupones WHERE activo = 1 AND fecha_expiracion >= CURDATE()';
    const [results] = await db.query(query);
    
    res.json({
      exito: true,
      total: results.length,
      cupones: results
    });
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
});

// POST - Validar cupón
router.post('/validar', async (req, res) => {
  try {
    const { codigo } = req.body;
    
    const query = 'SELECT * FROM cupones WHERE codigo = ? AND activo = 1 AND fecha_expiracion >= CURDATE()';
    const [results] = await db.query(query, [codigo]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Cupón inválido o expirado' });
    }
    
    res.json({
      exito: true,
      cupon: results[0]
    });
  } catch (error) {
    console.error('Error al validar cupón:', error);
    res.status(500).json({ error: 'Error al validar cupón' });
  }
});

// POST - Crear nuevo cupón (admin)
router.post('/', async (req, res) => {
  try {
    const { codigo, porcentaje_descuento, fecha_expiracion } = req.body;
    
    if (!codigo || !porcentaje_descuento || !fecha_expiracion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const query = 'INSERT INTO cupones (codigo, porcentaje_descuento, fecha_expiracion) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [codigo.toUpperCase(), porcentaje_descuento, fecha_expiracion]);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Cupón creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear cupón:', error);
    res.status(500).json({ error: 'Error al crear cupón' });
  }
});

// DELETE - Desactivar cupón
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE cupones SET activo = 0 WHERE id = ?';
    const [result] = await db.query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }
    
    res.json({ exito: true, mensaje: 'Cupón desactivado' });
  } catch (error) {
    console.error('Error al desactivar cupón:', error);
    res.status(500).json({ error: 'Error al desactivar cupón' });
  }
});

module.exports = router;