import { useState, useEffect } from 'react';  // ✅ IMPORTANTE: Importar useState
import { useLocation } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Componente para hacer scroll al inicio al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Componente para el botón flotante de subir
export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      onClick={scrollToTop}
      className="position-fixed bottom-0 end-0 m-4 btn btn-primary rounded-circle shadow-lg"
      style={{ 
        width: '50px', 
        height: '50px', 
        zIndex: 999,
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaArrowUp />
    </motion.button>
  );
};

export default ScrollToTop;