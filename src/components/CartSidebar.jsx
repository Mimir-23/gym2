import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; // 

export default function CartSidebar() {
  const { cartItems, isOpen, toggleCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { setShowLogin } = useUI();
  const cartRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && cartRef.current && !cartRef.current.contains(event.target)) {
        toggleCart();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleCart]);

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleCheckout = async () => {
    if (!user) {
      toggleCart();
      setShowLogin(true);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }

    const mensaje = cartItems.map((item) =>
      `• ${item.nombre} x${item.cantidad} = ${formatCOP(item.precio * item.cantidad)}`
    ).join("%0A");

    const totalCOP = formatCOP(total);
    const mensajeFinal = `Hola, quiero comprar los siguientes productos:%0A${mensaje}%0A%0ATotal: ${totalCOP}`;

    await supabase.from("compras").insert({
      user_id: user.id,
      items: cartItems,
      total,
    });

    const telefonoTienda = "573027566270"; 
    const url = `https://wa.me/${telefonoTienda}?text=${mensajeFinal}`;
    clearCart();
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Fondo oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
          ></motion.div>

          {/* Sidebar con rebote */}
          <motion.div
            ref={cartRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-80 bg-white h-full shadow-lg font-sans"
          >
            {/* Encabezado */}
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <h3 className="text-2xl font-display font-black text-secondary uppercase">Carrito</h3>
              <button onClick={toggleCart} className="text-gray-500 hover:text-primary transition">
                <IoMdClose size={28} />
              </button>
            </div>

            {/* Lista de productos */}
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-180px)]">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 mt-20 gap-3">
                  <FaShoppingCart size={48} />
                  <p className="text-center text-base">Tu carrito está vacío</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 border-b pb-4">
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary text-sm">{item.nombre}</h4>
                      <p className="text-xs text-gray-600">
                        x{item.cantidad} - {formatCOP(item.precio * item.cantidad)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 transition"
                    >
                      <FaTrashAlt /> Quitar
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total y acciones */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-lg font-bold text-secondary mb-3">
                  Total: {formatCOP(total)}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-xl transition mb-2"
                >
                  Finalizar compra
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-red-500 underline hover:text-red-700 transition"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
