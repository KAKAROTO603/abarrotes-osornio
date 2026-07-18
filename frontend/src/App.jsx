import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Carrito from './pages/Carrito';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import ScrollToTop, { ScrollToTopButton } from './components/ScrollToTop';
import Favoritos from './pages/Favoritos';
import Registro from './pages/Registro';

// Componente para proteger rutas de Admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente para proteger rutas de Cliente
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {user && <Navbar />}
      
      <main className="flex-grow-1">
        <ScrollToTop />
        <ScrollToTopButton />
        <Routes>
          {/* Ruta por defecto */}
          <Route path="/" element={
            user ? (
              user.rol === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/home" />
            ) : (
              <Login />
            )
          } />
          
          <Route path="/login" element={
            user ? <Navigate to="/" /> : <Login />
          } />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/carrito" element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />

          <Route path="/favoritos" element={
            <ProtectedRoute>
              <Favoritos />
            </ProtectedRoute>
          } />
          
          {/* Rutas públicas */}
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar-password" element={<Registro />} />
          
          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {user && <Footer />}
    </div>
  );
}

export default App;
