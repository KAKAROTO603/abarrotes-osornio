import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaCheckCircle, FaTag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';

const Carrito = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [cuponCodigo, setCuponCodigo] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [descuento, setDescuento] = useState(0);

  const handleAplicarCupon = async () => {
    if (!cuponCodigo) {
      toast.error('Ingresa un código de cupón');
      return;
    }

    try {
      const response = await api.post('/api/cupones/validar', { codigo: cuponCodigo });
      
      if (response.data.exito) {
        const cupon = response.data.cupon;
        const total = getTotal();
        const descuentoCalculado = total * (cupon.porcentaje_descuento / 100);
        
        setCuponAplicado(cupon);
        setDescuento(descuentoCalculado);
        toast.success(`✅ Cupón aplicado: ${cupon.porcentaje_descuento}% de descuento`);
      }
    } catch (error) {
      toast.error('❌ ' + (error.response?.data?.error || 'Cupón inválido'));
    }
  };

  const handleFinalizarCompra = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para comprar');
      return;
    }

    if (!window.confirm('¿Confirmas que deseas realizar este pedido?')) return;

    try {
      const productosParaPedido = cart.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio: parseFloat(item.precio)
      }));

      const totalConDescuento = getTotal() - descuento;

      const payload = {
        usuario_id: user.id,
        productos: productosParaPedido,
        total: totalConDescuento,
        cupon_id: cuponAplicado?.id || null
      };

      const response = await api.post('/api/pedidos', payload);

      if (response.data.exito) {
        toast.success(`🎉 ¡Pedido realizado con éxito! #${response.data.pedido_id}`, {
          autoClose: 5000
        });
        clearCart();
        setCuponAplicado(null);
        setDescuento(0);
        setCuponCodigo('');
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
      const detalle = error.response?.data?.detalle || error.response?.data?.error || 'Error desconocido';
      toast.error('❌ Error al procesar el pedido: ' + detalle);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <FaShoppingBag className="text-muted mb-3" style={{ fontSize: '4rem' }} />
        <h3>Tu carrito está vacío</h3>
        <p className="text-muted">¡Agrega algunos productos deliciosos!</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 fw-bold">
        🛒 Tu Carrito de Compras
      </motion.h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item, index) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }} 
              className="card mb-3 shadow-sm border-0"
            >
              <div className="card-body d-flex align-items-center">
                <img 
                  src={item.imagen_url || 'https://via.placeholder.com/80'} 
                  alt={item.nombre} 
                  className="rounded me-3" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1 fw-bold">{item.nombre}</h5>
                  <p className="text-muted mb-0">${parseFloat(item.precio).toFixed(2)} c/u</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.cantidad - 1)}>
                    <FaMinus />
                  </button>
                  <span className="fw-bold mx-2">{item.cantidad}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.cantidad + 1)}>
                    <FaPlus />
                  </button>
                </div>
                <div className="text-end ms-4" style={{ minWidth: '100px' }}>
                  <div className="fw-bold text-primary fs-5">
                    ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                  </div>
                  <button className="btn btn-sm btn-link text-danger p-0" onClick={() => removeFromCart(item.id)}>
                    <FaTrash className="me-1" /> Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card shadow border-0 sticky-top" style={{ top: '100px' }}>
            <div className="card-body">
              <h4 className="fw-bold mb-4">Resumen del Pedido</h4>
              
              {/* CUPÓN */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  <FaTag className="me-2" /> Código de Cupón
                </label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej: BIENVENIDO10"
                    value={cuponCodigo}
                    onChange={(e) => setCuponCodigo(e.target.value.toUpperCase())}
                  />
                  <button className="btn btn-outline-primary" onClick={handleAplicarCupon}>
                    Aplicar
                  </button>
                </div>
                {cuponAplicado && (
                  <small className="text-success mt-1 d-block">
                    ✅ {cuponAplicado.codigo} aplicado ({cuponAplicado.porcentaje_descuento}% descuento)
                  </small>
                )}
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span className="fw-bold">${getTotal().toFixed(2)}</span>
              </div>
              
              {descuento > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento</span>
                  <span className="fw-bold">-${descuento.toFixed(2)}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-3">
                <span>Envío</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total</span>
                <span className="fs-4 fw-bold text-primary">${(getTotal() - descuento).toFixed(2)}</span>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                className="btn btn-success w-100 btn-lg fw-bold mb-2" 
                onClick={handleFinalizarCompra}
              >
                <FaCheckCircle className="me-2" /> Finalizar Compra
              </motion.button>
              
              <button 
                className="btn btn-outline-secondary w-100" 
                onClick={() => { if(window.confirm('¿Vaciar carrito?')) clearCart(); }}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;