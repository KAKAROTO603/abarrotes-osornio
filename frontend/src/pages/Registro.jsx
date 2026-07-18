import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.password !== formData.confirmPassword) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  if (formData.password.length < 6) {
    toast.error('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  setLoading(true);

  try {
    const response = await api.post('/api/auth/registro', {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password
    });

    if (response.data.exito) {
      toast.success('✅ Cuenta creada exitosamente. Ahora inicia sesión.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    
  } catch (error) {
    toast.error('Error al crear cuenta: ' + (error.response?.data?.error || 'Error desconocido'));
  } finally {
    setLoading(false);
  }
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
        style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="mb-3"
            >
              <FaUser className="text-primary" style={{ fontSize: '3rem' }} />
            </motion.div>
            <h2 className="fw-bold text-dark mb-2">Crear Cuenta</h2>
            <p className="text-muted">Únete a Abarrotes Osornio</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                <FaUser className="me-2 text-primary" />
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <FaEnvelope className="me-2 text-primary" />
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <FaPhone className="me-2 text-primary" />
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="55 1234 5678"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                <FaLock className="me-2 text-primary" />
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                <FaLock className="me-2 text-primary" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repite tu contraseña"
                required
              />
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
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </motion.button>
          </form>

          <div className="text-center">
            <p className="text-muted mb-0">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-decoration-none fw-bold">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Registro;