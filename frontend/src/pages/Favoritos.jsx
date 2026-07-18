import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Favoritos = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  if (favorites.length === 0) {
    return (
      <div className="container py-5 text-center">
        <FaHeart className="text-muted mb-3" style={{ fontSize: '4rem' }} />
        <h3>No tienes favoritos</h3>
        <p className="text-muted">Agrega productos a tus favoritos para verlos aquí</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 fw-bold">
        ❤️ Mis Favoritos ({favorites.length})
      </motion.h2>

      <div className="row g-4">
        {favorites.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="col-md-6 col-lg-4"
          >
            <div className="card h-100 shadow-sm border-0">
              <div className="position-absolute top-0 end-0 m-2 z-3">
                <button 
                  className="btn btn-light btn-sm rounded-circle shadow-sm"
                  onClick={() => removeFromFavorites(product.id)}
                >
                  <FaHeart className="text-danger" />
                </button>
              </div>
              
              <div className="d-flex align-items-center justify-content-center p-3" style={{ height: '220px', backgroundColor: '#f8f9fa' }}>
                <img 
                  src={product.imagen_url || 'https://via.placeholder.com/300x200'} 
                  alt={product.nombre} 
                  style={{ maxHeight: '180px', objectFit: 'contain' }} 
                />
              </div>
              
              <div className="card-body d-flex flex-column">
                <span className="badge bg-primary align-self-start mb-2">{product.categoria_nombre}</span>
                <h5 className="card-title fw-bold">{product.nombre}</h5>
                <p className="card-text text-muted flex-grow-1 small">{product.descripcion}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="h4 mb-0 text-primary fw-bold">${parseFloat(product.precio).toFixed(2)}</span>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart(product);
                      toast.success('Agregado al carrito');
                    }}
                  >
                    <FaShoppingCart className="me-2" /> Agregar
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Favoritos;