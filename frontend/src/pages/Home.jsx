import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext'; // ✅ Ya lo tenías
import { motion, AnimatePresence } from 'framer-motion';
// ✅ Agregamos FaHeart y FaStar a los imports
import { FaShoppingCart, FaSearch, FaUtensils, FaWineBottle, FaCookieBite, FaSoap, FaAppleAlt, FaTh, FaEye, FaSortAmountDown, FaSortAmountUp, FaHeart, FaStar } from 'react-icons/fa';
import api from '../services/api';
import ProductSkeleton from '../components/ProductSkeleton';
import QuickViewModal from '../components/QuickViewModal';

const categoryIcons = {
  'Todas': <FaTh />,
  'Bebidas': <FaWineBottle />,
  'Alimentos': <FaCookieBite />,
  'Lácteos': <FaAppleAlt />,
  'Limpieza': <FaSoap />,
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState(['Todas']);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortOrder, setSortOrder] = useState('default');
  
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const { addToCart } = useCart();
  // ✅ Extraemos las funciones de favoritos
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, maxPrice, sortOrder, products]);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/api/productos'),
        api.get('/api/categorias')
      ]);
      
      setProducts(prodRes.data.productos || []);
      
      const cats = ['Todas', ...(catRes.data.categorias || []).map(c => c.nombre)];
      setCategorias(cats);
      
      if (prodRes.data.productos?.length > 0) {
        const max = Math.max(...prodRes.data.productos.map(p => p.precio));
        setMaxPrice(Math.ceil(max));
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(p => p.categoria_nombre === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.precio <= maxPrice);

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (sortOrder === 'desc') {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    setFilteredProducts(filtered);
  };

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="container py-5">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3"><FaUtensils className="me-2 text-primary" />Nuestros Productos</h1>
        <p className="lead text-muted">Los mejores abarrotes al mejor precio</p>
      </motion.div>

      {/* BARRA DE BÚSQUEDA Y FILTROS AVANZADOS */}
      <div className="card shadow-sm border-0 mb-4 p-3">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-bold small text-muted">Buscar</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
              <input type="text" className="form-control border-start-0" placeholder="Nombre o descripción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          
          <div className="col-md-3">
            <label className="form-label fw-bold small text-muted">Precio Máximo: ${maxPrice}</label>
            <input 
              type="range" 
              className="form-range" 
              min="0" 
              max={Math.max(100, maxPrice + 50)} 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold small text-muted">Ordenar por</label>
            <select className="form-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Relevancia</option>
              <option value="asc">Precio: Menor a Mayor <FaSortAmountDown className="ms-1" /></option>
              <option value="desc">Precio: Mayor a Menor <FaSortAmountUp className="ms-1" /></option>
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => {setSearchTerm(''); setSelectedCategory('Todas'); setMaxPrice(1000); setSortOrder('default');}}>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {categorias.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`btn px-4 py-2 fw-bold rounded-pill ${selectedCategory === category ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ background: selectedCategory === category ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '', border: selectedCategory === category ? 'none' : '' }}
              >
                <span className="me-2">{categoryIcons[category] || <FaTh />}</span>{category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN DE PRODUCTOS DESTACADOS */}
      {!loading && selectedCategory === 'Todas' && !searchTerm && featuredProducts.length > 0 && (
        <div className="mb-5">
          <h3 className="fw-bold mb-3 text-primary"><FaStar className="me-2 text-warning" />Productos Destacados</h3>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <motion.div key={`feat-${product.id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="col-md-4">
                <div className="card h-100 shadow border-warning position-relative" style={{ borderWidth: '2px' }}>
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-warning text-dark">🔥 Destacado</span>
                  </div>
                  
                  {/* ✅ BOTÓN DE FAVORITOS EN DESTACADOS */}
                  <div className="position-absolute top-0 start-0 m-2 z-3">
                    <button 
                      className="btn btn-light btn-sm rounded-circle shadow-sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFavorite(product.id)) {
                          removeFromFavorites(product.id);
                        } else {
                          addToFavorites(product);
                        }
                      }}
                      title={isFavorite(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <FaHeart className={isFavorite(product.id) ? 'text-danger' : 'text-muted'} />
                    </button>
                  </div>

                  <div className="d-flex align-items-center justify-content-center p-3" style={{ height: '200px', backgroundColor: '#fff3cd' }}>
                    <img src={product.imagen_url || 'https://via.placeholder.com/300x200'} alt={product.nombre} style={{ maxHeight: '160px', objectFit: 'contain' }} />
                  </div>
                  <div className="card-body text-center">
                    <h5 className="fw-bold">{product.nombre}</h5>
                    <p className="text-primary fw-bold fs-4">${parseFloat(product.precio).toFixed(2)}</p>
                    <button className="btn btn-warning fw-bold w-100" onClick={() => setQuickViewProduct(product)}>
                      <FaEye className="me-2" /> Vista Rápida
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <hr className="my-5" />
        </div>
      )}

      {/* GRID DE PRODUCTOS PRINCIPAL */}
      <h3 className="fw-bold mb-3">
        {selectedCategory === 'Todas' && !searchTerm ? 'Todos los Productos' : `Resultados para "${selectedCategory !== 'Todas' ? selectedCategory : searchTerm}"`}
        <span className="text-muted fs-6 ms-2">({filteredProducts.length} encontrados)</span>
      </h3>

      <div className="row g-4">
        {loading ? (
          [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
        ) : filteredProducts.length > 0 ? (
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="col-md-6 col-lg-4">
                <motion.div whileHover={{ y: -10 }} className="card h-100 shadow-sm border-0 position-relative">
                  
                  {/* ✅ BOTONES DE FAVORITOS Y VISTA RÁPIDA AGRUPADOS */}
                  <div className="position-absolute top-0 end-0 m-2 z-3 d-flex flex-column gap-2">
                    <button 
                      className="btn btn-light btn-sm rounded-circle shadow-sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFavorite(product.id)) {
                          removeFromFavorites(product.id);
                        } else {
                          addToFavorites(product);
                        }
                      }}
                      title={isFavorite(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      <FaHeart className={isFavorite(product.id) ? 'text-danger' : 'text-muted'} />
                    </button>
                    <button 
                      className="btn btn-light btn-sm rounded-circle shadow-sm" 
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }} 
                      title="Vista rápida"
                    >
                      <FaEye className="text-primary" />
                    </button>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-center p-3" style={{ height: '220px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setQuickViewProduct(product)}>
                    <img src={product.imagen_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'} alt={product.nombre} style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-primary align-self-start mb-2">{product.categoria_nombre}</span>
                    <h5 className="card-title fw-bold">{product.nombre}</h5>
                    <p className="card-text text-muted flex-grow-1 small">{product.descripcion}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="h4 mb-0 text-primary fw-bold">${parseFloat(product.precio).toFixed(2)}</span>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                        <FaShoppingCart className="me-2" />Agregar
                      </motion.button>
                    </div>
                    <small className={`text-muted mt-2 ${product.stock < 10 ? 'text-danger fw-bold' : ''}`}>
                      Stock: {product.stock} disponibles
                    </small>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-12 text-center py-5">
            <FaSearch className="text-muted mb-3" style={{ fontSize: '3rem' }} />
            <p className="text-muted lead">No se encontraron productos con esos filtros</p>
            <button className="btn btn-primary mt-3" onClick={() => {setSearchTerm(''); setSelectedCategory('Todas'); setMaxPrice(1000); setSortOrder('default');}}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE VISTA RÁPIDA */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
};

export default Home;
