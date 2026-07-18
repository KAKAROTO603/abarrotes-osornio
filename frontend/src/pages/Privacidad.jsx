import { motion } from 'framer-motion';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Privacidad = () => {
  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="btn btn-outline-primary mb-4">
          <FaArrowLeft className="me-2" /> Volver al inicio
        </Link>

        <div className="card shadow border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <FaShieldAlt className="text-primary mb-3" style={{ fontSize: '3rem' }} />
              <h1 className="fw-bold">Aviso de Privacidad</h1>
              <p className="text-muted">Última actualización: Julio 2026</p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">1. Responsable de los datos</h3>
              <p>
                <strong>Abarrotes Osornio</strong>, con domicilio en Calle Principal #123, 
                Colonia Centro, es responsable del tratamiento de sus datos personales.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">2. Datos que recopilamos</h3>
              <p>Para prestarle nuestros servicios, podemos recabar los siguientes datos personales:</p>
              <ul>
                <li><strong>Datos de identificación:</strong> nombre, correo electrónico, teléfono.</li>
                <li><strong>Datos de contacto:</strong> domicilio para entregas.</li>
                <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas.</li>
                <li><strong>Datos de compra:</strong> historial de pedidos y productos adquiridos.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">3. Finalidad del tratamiento</h3>
              <p>Sus datos personales serán utilizados para:</p>
              <ul>
                <li>Procesar y entregar sus pedidos.</li>
                <li>Enviarle promociones y ofertas especiales (con su consentimiento).</li>
                <li>Mejorar nuestros servicios y experiencia de compra.</li>
                <li>Cumplir con obligaciones legales.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">4. Transferencia de datos</h3>
              <p>
                Sus datos personales no serán compartidos con terceros, salvo en los casos 
                previstos por la ley o cuando sea necesario para completar su pedido 
                (por ejemplo, con empresas de mensajería).
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">5. Derechos ARCO</h3>
              <p>
                Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse</strong> 
                al tratamiento de sus datos personales. Para ejercer estos derechos, puede 
                enviarnos un correo a: <strong>privacidad@abarrotesosornio.com</strong>
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">6. Uso de cookies</h3>
              <p>
                Nuestro sitio web utiliza cookies para mejorar su experiencia. Puede 
                configurar su navegador para rechazar las cookies, aunque esto puede 
                afectar el funcionamiento del sitio.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">7. Cambios al aviso de privacidad</h3>
              <p>
                Nos reservamos el derecho de efectuar modificaciones al presente aviso de 
                privacidad en cualquier momento. Los cambios estarán disponibles en esta página.
              </p>
            </div>

            <div className="text-center mt-5">
              <p className="text-muted">
                ¿Tienes dudas sobre este aviso? Contáctanos al <strong>55 1234 5678</strong>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Privacidad;