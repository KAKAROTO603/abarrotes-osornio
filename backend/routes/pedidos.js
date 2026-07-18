const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET - Obtener todos los pedidos (para admin)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.usuario_id,
        COALESCE(u.nombre, 'Cliente') as cliente_nombre,
        COALESCE(u.email, 'N/A') as cliente_email,
        p.total,
        p.estado,
        p.fecha_pedido,
        GROUP_CONCAT(
          CONCAT(pr.nombre, ' x', dp.cantidad) SEPARATOR ', '
        ) as productos
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
      GROUP BY p.id, p.usuario_id, u.nombre, u.email, p.total, p.estado, p.fecha_pedido
      ORDER BY p.fecha_pedido DESC
    `;
    
    const [results] = await db.query(query);
    
    res.json({
      exito: true,
      total: results.length,
      pedidos: results
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos', detalle: error.message });
  }
});

// GET - Obtener pedidos de un usuario específico
router.get('/usuario/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    
    const query = `
      SELECT 
        p.id,
        p.total,
        p.estado,
        p.fecha_pedido,
        GROUP_CONCAT(
          CONCAT(pr.nombre, ' x', dp.cantidad, ' - $', dp.precio_unitario) 
          SEPARATOR ' | '
        ) as productos_detalle,
        COUNT(dp.id) as total_productos
      FROM pedidos p
      LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
      WHERE p.usuario_id = ?
      GROUP BY p.id, p.total, p.estado, p.fecha_pedido
      ORDER BY p.fecha_pedido DESC
    `;
    
    const [results] = await db.query(query, [usuario_id]);
    
    res.json({
      exito: true,
      total: results.length,
      pedidos: results
    });
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// POST - Crear nuevo pedido
router.post('/', async (req, res) => {
  try {
    const { usuario_id, productos, total } = req.body;
    
    if (!usuario_id || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    await db.query('START TRANSACTION');
    
    const queryPedido = 'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)';
    const [resultPedido] = await db.query(queryPedido, [usuario_id, total, 'pendiente']);
    
    const pedidoId = resultPedido.insertId;
    
    for (const item of productos) {
      const queryDetalle = `
        INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
        VALUES (?, ?, ?, ?)
      `;
      await db.query(queryDetalle, [pedidoId, item.producto_id, item.cantidad, item.precio]);
      
      const queryStock = `
        UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?
      `;
      const [resultStock] = await db.query(queryStock, [item.cantidad, item.producto_id, item.cantidad]);
      
      if (resultStock.affectedRows === 0) {
        throw new Error(`Stock insuficiente para el producto ID: ${item.producto_id}`);
      }
    }
    
    await db.query('COMMIT');
    
    res.status(201).json({
      exito: true,
      mensaje: 'Pedido creado exitosamente',
      pedido_id: pedidoId
    });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error al crear pedido:', error);
    res.status(500).json({ 
      error: 'Error al crear pedido',
      detalle: error.message 
    });
  }
});

module.exports = router;