const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todos los productos activos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = 1
      ORDER BY p.created_at DESC
    `;
    
    const [results] = await db.query(query);
    
    res.json({
      exito: true,
      total: results.length,
      productos: results
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET - Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ? AND p.activo = 1
    `;
    
    const [results] = await db.query(query, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ exito: true, producto: results[0] });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST - Crear nuevo producto (con URL de imagen)
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;
    
    if (!nombre || !precio || !stock || !categoria_id) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, activo)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `;
    
    const [result] = await db.query(query, [
      nombre, 
      descripcion, 
      precio, 
      stock, 
      imagen_url || 'https://via.placeholder.com/300x200?text=Producto',
      parseInt(categoria_id)
    ]);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT - Actualizar producto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id, imagen_url } = req.body;
    
    const producto = { nombre, descripcion, precio, stock, categoria_id, imagen_url };
    const fields = Object.keys(producto).filter(key => producto[key] !== undefined && producto[key] !== '');
    const values = Object.values(producto).filter(val => val !== undefined && val !== '');
    
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id);
    
    const query = `UPDATE productos SET ${setClause} WHERE id = ?`;
    
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ exito: true, mensaje: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE - Eliminar producto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'UPDATE productos SET activo = 0 WHERE id = ?';
    
    const [result] = await db.query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ exito: true, mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;