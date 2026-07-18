import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUserPlus, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success(`¡Bienvenido, ${result.user.nombre}!`);
      navigate(result.user.rol === 'admin' ? '/admin' : '/home');
    } else {
      toast.error(result.error || 'Credenciales inválidas');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card shadow-lg border-0"
        style={{ maxWidth: '450px', width: '90%' }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="mb-3"
            >
              <FaEnvelope className="text-primary" style={{ fontSize: '3rem' }} />
            </motion.div>
            <h2 className="fw-bold text-dark mb-2">Abarrotes Osornio</h2>
            <p className="text-muted">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <FaEnvelope className="me-2 text-primary" />
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                <FaLock className="me-2 text-primary" />
                Contraseña
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-end mb-3">
              <Link to="/recuperar-password" className="text-decoration-none small">
                <FaKey className="me-1" />
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-primary btn-lg w-100 mb-3"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </motion.button>
          </form>

          <hr className="my-4" />

          <div className="text-center">
            <p className="text-muted mb-2">¿No tienes una cuenta?</p>
            <Link to="/registro" className="btn btn-outline-primary w-100">
              <FaUserPlus className="me-2" />
              Crear cuenta nueva
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;