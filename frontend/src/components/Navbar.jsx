import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBox } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, getTotal } = useCart(); // ✅ Usar cart directamente
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calcular total de items en el carrito
  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" 
         style={{
           background: 'linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)',
           boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
         }}>
          <button 
    className="btn btn-outline-light btn-sm me-3"
    onClick={toggleDarkMode}
    title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
  >
    {darkMode ? <FaSun /> : <FaMoon />}
  </button>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: '1.5rem' }}>
          🛒 Abarrotes Osornio
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                {user.rol === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      <FaBox className="me-1" /> Panel Admin
                    </Link>
                  </li>
                )}
                {user.rol === 'cliente' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/home">
                      Productos
                    </Link>
                  </li>
                )}
                {user.rol === 'cliente' && (
                  <li className="nav-item">
                    <Link className="nav-link position-relative" to="/carrito">
                      <FaShoppingCart />
                      {getItemCount() > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {getItemCount()}
                        </span>
                      )}
                    </Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '35px', height: '35px' }}>
                      <strong>{user.nombre.charAt(0).toUpperCase()}</strong>
                    </div>
                    <span className="d-none d-md-inline">{user.nombre}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-warning fw-bold" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;