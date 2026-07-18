const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://abarrotes-osornio.vercel.app',
    'https://abarrotes-osornio-two.vercel.app',  // ← Agrega tu dominio de Vercel
    'https://abarrotes-osornio.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const productosRoutes = require('./routes/productos');
const categoriasRoutes = require('./routes/categorias');
const pedidosRoutes = require('./routes/pedidos');
const cuponesRoutes = require('./routes/cupones');

// Usar rutas
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/cupones', cuponesRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: '🏪 API de Abarrotes Osornio',
    version: '2.0',
    fecha: new Date().toLocaleString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `${req.method} ${req.url}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🏪 SERVIDOR ABARROTES OSORNIO v2.0       ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME || 'abarrotes_osornio'}`);
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});