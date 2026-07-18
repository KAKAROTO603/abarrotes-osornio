import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`✅ ${product.nombre} agregado al carrito`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, backdropFilter: 'blur(5px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="card shadow-lg border-0"
          style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro
        >
          <div className="card-body p-4">
            <button 
              className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-3 rounded-circle"
              style={{ width: '40px', height: '40px' }}
              onClick={onClose}
            >
              <FaTimes />
            </button>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                  <img 
                    src={product.imagen_url || 'https://via.placeholder.com/400x400?text=Sin+Imagen'} 
                    alt={product.nombre} 
                    className="img-fluid" 
                    style={{ maxHeight: '280px', objectFit: 'contain' }} 
                  />
                </div>
              </div>
              
              <div className="col-md-6 d-flex flex-column">
                <span className="badge bg-primary align-self-start mb-2">{product.categoria_nombre}</span>
                <h2 className="fw-bold mb-2">{product.nombre}</h2>
                
                <div className="d-flex align-items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-warning me-1" />
                  ))}
                  <span className="text-muted ms-2 small">(Reseñas simuladas)</span>
                </div>

                <h3 className="text-primary fw-bold mb-3">${parseFloat(product.precio).toFixed(2)}</h3>
                
                <p className="text-muted flex-grow-1">{product.descripcion || 'Sin descripción disponible.'}</p>
                
                <div className="mt-auto">
                  <div className="d-flex align-items-center mb-3">
                    <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'} me-2`}>
                      {product.stock > 10 ? 'En Stock' : product.stock > 0 ? `¡Solo ${product.stock} restantes!` : 'Agotado'}
                    </span>
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-lg w-100 fw-bold"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart className="me-2" /> Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
