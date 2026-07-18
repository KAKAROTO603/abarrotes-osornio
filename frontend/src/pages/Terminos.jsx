import { motion } from 'framer-motion';
import { FaFileContract, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Terminos = () => {
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
              <FaFileContract className="text-primary mb-3" style={{ fontSize: '3rem' }} />
              <h1 className="fw-bold">Términos y Condiciones</h1>
              <p className="text-muted">Última actualización: Julio 2026</p>
            </div>

            <div className="alert alert-info">
              <strong>Importante:</strong> Al usar nuestro sitio web y servicios, usted acepta 
              los siguientes términos y condiciones. Le recomendamos leerlos cuidadosamente.
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">1. Aceptación de los términos</h3>
              <p>
                Al acceder y utilizar el sitio web de <strong>Abarrotes Osornio</strong>, 
                usted acepta estar sujeto a estos términos y condiciones. Si no está de 
                acuerdo con alguno de ellos, le pedimos que no utilice nuestros servicios.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">2. Descripción del servicio</h3>
              <p>
                Nuestro sitio web permite a los usuarios visualizar productos, agregarlos 
                a un carrito de compras y realizar pedidos. Nos reservamos el derecho de 
                modificar, suspender o discontinuar cualquier aspecto del servicio en 
                cualquier momento sin previo aviso.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">3. Registro de usuario</h3>
              <p>Para utilizar ciertas funciones del sitio, deberá crear una cuenta. Usted se compromete a:</p>
              <ul>
                <li>Proporcionar información veraz y actualizada.</li>
                <li>Mantener la confidencialidad de su contraseña.</li>
                <li>Ser responsable de todas las actividades que ocurran bajo su cuenta.</li>
                <li>Notificarnos de cualquier uso no autorizado de su cuenta.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">4. Precios y pagos</h3>
              <p>
                Los precios mostrados en el sitio están en pesos mexicanos (MXN) e incluyen IVA. 
                Nos reservamos el derecho de modificar los precios en cualquier momento. 
                Los pedidos se consideran confirmados una vez que se haya procesado el pago 
                o confirmado el método de pago acordado.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">5. Entregas</h3>
              <ul>
                <li>Los tiempos de entrega son estimados y pueden variar.</li>
                <li>Las entregas se realizan dentro de nuestra zona de cobertura.</li>
                <li>El cliente debe verificar el producto al momento de la entrega.</li>
                <li>No nos hacemos responsables por productos no reclamados en el domicilio.</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">6. Devoluciones y reembolsos</h3>
              <p>
                Aceptamos devoluciones de productos en su empaque original y sin usar dentro 
                de los <strong>3 días hábiles</strong> posteriores a la compra. No se aceptan 
                devoluciones de productos perecederos una vez entregados.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">7. Propiedad intelectual</h3>
              <p>
                Todo el contenido del sitio (logos, imágenes, textos, diseños) es propiedad 
                de Abarrotes Osornio y está protegido por las leyes de propiedad intelectual. 
                Queda prohibida su reproducción sin autorización.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">8. Limitación de responsabilidad</h3>
              <p>
                Abarrotes Osornio no será responsable por daños indirectos, incidentales o 
                consecuentes derivados del uso de nuestro sitio web o servicios.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">9. Ley aplicable</h3>
              <p>
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. 
                Cualquier controversia será sometida a los tribunales competentes.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="fw-bold text-primary">10. Contacto</h3>
              <p>
                Si tiene preguntas sobre estos términos, contáctenos:
              </p>
              <ul>
                <li>📧 Email: <strong>contacto@abarrotesosornio.com</strong></li>
                <li>📞 Teléfono: <strong>55 1234 5678</strong></li>
                <li>📍 Dirección: Calle Principal #123, Colonia Centro</li>
              </ul>
            </div>

            <div className="text-center mt-5">
              <p className="text-muted">
                Al continuar usando nuestro sitio, usted acepta estos términos y condiciones.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terminos;