import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaBox, FaShoppingCart, FaChartLine, FaWineBottle, FaCookieBite, FaAppleAlt, FaSoap } from 'react-icons/fa';
import api from '../services/api';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'productos', 'pedidos'
  const [products, setProducts] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria_id: '',
    imagen_url: ''
  });

  const categoryIcons = {
    'Bebidas': <FaWineBottle className="me-2" />,
    'Alimentos': <FaCookieBite className="me-2" />,
    'Lácteos': <FaAppleAlt className="me-2" />,
    'Limpieza': <FaSoap className="me-2" />,
  };

  useEffect(() => {
    if (activeTab === 'productos' || activeTab === 'pedidos') {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      const [prodRes, catRes, pedRes] = await Promise.all([
        api.get('/api/productos'),
        api.get('/api/categorias'),
        api.get('/api/pedidos')
      ]);
      
      setProducts(prodRes.data.productos || []);
      setCategorias(catRes.data.categorias || []);
      setPedidos(pedRes.data.pedidos || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post('/api/productos', {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoria_id: parseInt(formData.categoria_id)
      });
      
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria_id: '',
        imagen_url: ''
      });
      loadData();
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await api.delete(`/api/productos/${id}`);
      loadData();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const getCategoryName = (id) => {
    const cat = categorias.find(c => c.id === parseInt(id));
    return cat ? cat.nombre : 'Sin categoría';
  };

  return (
    <div className="container-fluid py-4">
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 fw-bold text-primary">
        <FaBox className="me-2" /> Panel de Administración
      </motion.h2>

      {/* Tabs de navegación */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartLine className="me-2" />Dashboard
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'productos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('productos')}
          >
            <FaBox className="me-2" />Productos
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'pedidos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveTab('pedidos')}
          >
            <FaShoppingCart className="me-2" />Pedidos ({pedidos.length})
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'dashboard' ? (
        <AdminDashboard />
      ) : activeTab === 'productos' ? (
        <div className="row g-4">
          {/* Formulario de Producto */}
          <div className="col-lg-4">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white fw-bold">
                <FaPlus className="me-2" /> Nuevo Producto
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Categoría *</label>
                    <select
                      name="categoria_id"
                      className="form-select"
                      value={formData.categoria_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {categoryIcons[cat.nombre]}{cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold">Precio ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        name="precio"
                        className="form-control"
                        value={formData.precio}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold">Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Descripción</label>
                    <textarea
                      name="descripcion"
                      className="form-control"
                      rows="2"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">URL de la imagen</label>
                    <input
                      type="url"
                      name="imagen_url"
                      className="form-control"
                      value={formData.imagen_url}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <button type="submit" className="btn btn-success w-100 fw-bold">
                    <FaPlus className="me-2" /> Guardar Producto
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="col-lg-8">
            <div className="card shadow border-0">
              <div className="card-header bg-dark text-white fw-bold">
                Inventario Actual ({products.length} productos)
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            No hay productos registrados
                          </td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id}>
                            <td>
                              <img
                                src={product.imagen_url || 'https://via.placeholder.com/50'}
                                alt={product.nombre}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>
                              <div className="fw-bold">{product.nombre}</div>
                              <small className="text-muted">{product.descripcion}</small>
                            </td>
                            <td>
                              <span className="badge bg-primary">{getCategoryName(product.categoria_id)}</span>
                            </td>
                            <td className="fw-bold text-success">${parseFloat(product.precio).toFixed(2)}</td>
                            <td>
                              <span className={`badge ${product.stock < 10 ? 'bg-danger' : 'bg-info'}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(product.id)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tabla de Pedidos */
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white fw-bold">
            <FaShoppingCart className="me-2" /> Pedidos Realizados ({pedidos.length})
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID Pedido</th>
                    <th>Cliente</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No hay pedidos registrados
                      </td>
                    </tr>
                  ) : (
                    pedidos.map(pedido => (
                      <tr key={pedido.id}>
                        <td>#{pedido.id}</td>
                        <td>
                          <div className="fw-bold">{pedido.cliente_nombre}</div>
                          <small className="text-muted">{pedido.cliente_email}</small>
                        </td>
                        <td>{pedido.productos}</td>
                        <td className="fw-bold text-success">${parseFloat(pedido.total).toFixed(2)}</td>
                        <td>
                          <span className={`badge ${
                            pedido.estado === 'entregado' ? 'bg-success' :
                            pedido.estado === 'pendiente' ? 'bg-warning text-dark' :
                            'bg-info text-dark'
                          }`}>
                            {pedido.estado.toUpperCase()}
                          </span>
                        </td>
                        <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
