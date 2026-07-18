import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaShoppingCart, FaDollarSign, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalPedidos: 0,
    totalVentas: 0,
    stockBajo: 0,
    totalClientes: 0
  });
  
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos
      const productosRes = await api.get('/api/productos');
      const productos = productosRes.data.productos || [];
      
      // Cargar pedidos
      const pedidosRes = await api.get('/api/pedidos');
      const pedidos = pedidosRes.data.pedidos || [];
      
      // Calcular estadísticas
      const totalProductos = productos.length;
      const totalPedidos = pedidos.length;
      const totalVentas = pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      const stockBajo = productos.filter(p => p.stock < 10).length;
      
      setStats({
        totalProductos,
        totalPedidos,
        totalVentas,
        stockBajo,
        totalClientes: 1 // Simulado (en producción vendría de la BD)
      });
      
      // Calcular ventas por día (últimos 7 días)
      const ventasPorDiaData = calcularVentasPorDia(pedidos);
      setVentasPorDia(ventasPorDiaData);
      
      // Calcular productos más vendidos
      const masVendidos = calcularProductosMasVendidos(pedidos, productos);
      setProductosMasVendidos(masVendidos);
      
      // Obtener productos con stock bajo
      const stockBajoList = productos.filter(p => p.stock < 10).slice(0, 5);
      setProductosStockBajo(stockBajoList);
      
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      toast.error('Error al cargar estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const calcularVentasPorDia = (pedidos) => {
    const dias = [];
    const hoy = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const ventasDia = pedidos
        .filter(p => p.fecha_pedido?.startsWith(fechaStr))
        .reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      
      dias.push({
        fecha: fecha.toLocaleDateString('es-MX', { weekday: 'short' }),
        ventas: ventasDia
      });
    }
    
    return dias;
  };

  const calcularProductosMasVendidos = (pedidos, productos) => {
    const conteo = {};
    
    pedidos.forEach(pedido => {
      if (pedido.productos) {
        const productosList = pedido.productos.split(', ');
        productosList.forEach(prod => {
          const match = prod.match(/(.+?) x(\d+)/);
          if (match) {
            const nombre = match[1];
            const cantidad = parseInt(match[2]);
            conteo[nombre] = (conteo[nombre] || 0) + cantidad;
          }
        });
      }
    });
    
    return Object.entries(conteo)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="mb-4 fw-bold text-primary"
      >
         Dashboard de Administración
      </motion.h2>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="row g-4 mb-4">
        <motion.div 
          className="col-md-6 col-lg-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Productos</p>
                  <h3 className="fw-bold mb-0">{stats.totalProductos}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FaBox className="text-primary fs-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-6 col-lg-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Pedidos</p>
                  <h3 className="fw-bold mb-0">{stats.totalPedidos}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FaShoppingCart className="text-success fs-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-6 col-lg-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Total Ventas</p>
                  <h3 className="fw-bold mb-0 text-success">${stats.totalVentas.toFixed(2)}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <FaDollarSign className="text-warning fs-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-6 col-lg-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Stock Bajo</p>
                  <h3 className="fw-bold mb-0 text-danger">{stats.stockBajo}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <FaExclamationTriangle className="text-danger fs-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* GRÁFICOS */}
      <div className="row g-4 mb-4">
        {/* Ventas por día */}
        <motion.div 
          className="col-lg-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">
              📈 Ventas de los Últimos 7 Días
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ventasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventas" fill="#0d6efd" name="Ventas ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Productos más vendidos */}
        <motion.div 
          className="col-lg-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-bold">
               Productos Más Vendidos
            </div>
            <div className="card-body">
              {productosMasVendidos.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productosMasVendidos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, cantidad }) => `${nombre}: ${cantidad}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                    >
                      {productosMasVendidos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  <p>No hay datos de ventas disponibles</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ALERTAS DE STOCK BAJO */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-danger text-white fw-bold">
            <FaExclamationTriangle className="me-2" /> Alertas de Stock Bajo
          </div>
          <div className="card-body">
            {productosStockBajo.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Stock Actual</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosStockBajo.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.imagen_url || 'https://via.placeholder.com/40'} 
                              alt={product.nombre}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-bold">{product.nombre}</div>
                              <small className="text-muted">${parseFloat(product.precio).toFixed(2)}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">{product.categoria_nombre}</span>
                        </td>
                        <td>
                          <span className={`fw-bold ${product.stock < 5 ? 'text-danger' : 'text-warning'}`}>
                            {product.stock} unidades
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${product.stock === 0 ? 'bg-danger' : product.stock < 5 ? 'bg-warning text-dark' : 'bg-info'}`}>
                            {product.stock === 0 ? 'Agotado' : product.stock < 5 ? 'Crítico' : 'Bajo'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-primary">
                            Reordenar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-success py-4">
                <FaExclamationTriangle className="mb-2" style={{ fontSize: '3rem' }} />
                <p className="mb-0 fw-bold">¡Todo en orden! No hay productos con stock bajo</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
