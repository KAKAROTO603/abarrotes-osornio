const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todas las categorías activas
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM categorias WHERE activo = 1 ORDER BY nombre';
    
    const [results] = await db.query(query);
    
    res.json({
      exito: true,
      total: results.length,
      categorias: results
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

module.exports = router;