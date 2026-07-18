import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Footer = () => {
  const { cart, getTotal } = useCart();
  return (
    <>
      {/* FOOTER PRINCIPAL */}
      <footer 
        className="text-white pt-5 pb-3"
        style={{
          background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
          borderTop: '4px solid #ffc107'
        }}
      >
        <div className="container">
          <div className="row g-4">
            {/* COLUMNA 1: Información de la tienda */}
            <div className="col-lg-4 col-md-6" data-aos="fade-up">
              <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
                🛒 Abarrotes Osornio
              </h4>
              <p className="mb-3">
                Tu tienda de confianza con los mejores productos al mejor precio. 
                Atendiendo a la comunidad con calidad y servicio desde hace más de 20 años.
              </p>
              <div className="mb-2">
                <FaMapMarkerAlt className="me-2" style={{ color: '#ffc107' }} />
                <span>Carretera Aculco, Estado de México</span>
              </div>
              <div className="mb-2">
                <FaPhone className="me-2" style={{ color: '#ffc107' }} />
                <span>71 2202 4741</span>
              </div>
              <div className="mb-2">
                <FaEnvelope className="me-2" style={{ color: '#ffc107' }} />
                <span>josemanuellaraosornio7@gmail.com</span>
              </div>
            </div>

            {/* COLUMNA 2: Enlaces Rápidos */}
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
                Enlaces Rápidos
              </h4>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/home" className="text-white text-decoration-none">
                    <span className="me-2">›</span> Inicio
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/home" className="text-white text-decoration-none">
                    <span className="me-2">›</span> Productos
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/carrito" className="text-white text-decoration-none">
                    <span className="me-2">›</span> Mi Carrito
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin" className="text-white text-decoration-none">
                    <span className="me-2">›</span> Panel Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMNA 3: Redes Sociales */}
            <div className="col-lg-4 col-md-12" data-aos="fade-up" data-aos-delay="200">
              <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
                Síguenos
              </h4>
              <p className="mb-3">Entérate de nuestras promociones y ofertas especiales</p>
              <div className="d-flex gap-3 mb-4">
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '45px', height: '45px' }}
                >
                  <FaFacebook className="text-primary" style={{ fontSize: '1.3rem' }} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '45px', height: '45px' }}
                >
                  <FaInstagram className="text-danger" style={{ fontSize: '1.3rem' }} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '45px', height: '45px' }}
                >
                  <FaYoutube className="text-danger" style={{ fontSize: '1.3rem' }} />
                </motion.a>
              </div>
              <p className="small mb-0">
                © {new Date().getFullYear()} Abarrotes Osornio<br />
                Todos los derechos reservados
              </p>
            </div>
          </div>

          {/* LÍNEA SEPARADORA */}
          <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* POLÍTICAS LEGALES */}
          <div className="text-center">
            <Link to="/privacidad" className="text-white text-decoration-none me-4 small">
              Aviso de Privacidad
            </Link>
            <Link to="/terminos" className="text-white text-decoration-none small">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <motion.a
  href={`https://wa.me/5217122024741?text=${encodeURIComponent(
    'Hola Abarrotes Osornio, quiero hacer un pedido:\n\n' +
    (cart.length > 0 ? cart.map(item => `- ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}`).join('\n') + `\n\n*Total: $${getTotal().toFixed(2)}*` : 'Estoy viendo tu catálogo')
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center rounded-circle shadow-lg"
  style={{
    width: '60px',
    height: '60px',
    backgroundColor: '#25D366',
    color: 'white',
    fontSize: '2rem',
    textDecoration: 'none',
    zIndex: 1000
  }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  title="Hacer pedido por WhatsApp"
>
  <FaWhatsapp />
  <span
    className="position-absolute top-0 start-0 rounded-circle"
    style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#25D366',
      animation: 'pulse 2s infinite',
      zIndex: -1
    }}
  />
</motion.a>

      {/* Estilos para la animación de pulso */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;