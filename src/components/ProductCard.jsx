import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { useState } from "react";
import { supabase } from "../supabase";

export default function ProductCard({ producto }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { setShowLogin, setPostLoginAction } = useUI();
  const [showModal, setShowModal] = useState(false);
  const [cargandoImagen, setCargandoImagen] = useState(true);
  const [cargandoModalImagen, setCargandoModalImagen] = useState(true);

  const agotado = producto.agotado;
  const tieneDescuento = Number(producto.descuento) > 0;

  const precioDescuento = producto.precio_final
    ? producto.precio_final
    : tieneDescuento
    ? producto.precio - (producto.precio * producto.descuento) / 100
    : producto.precio;

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  const descripcionCorta =
    producto.descripcion.length > 100
      ? `${producto.descripcion.slice(0, 100)}...`
      : producto.descripcion;

  const handleAddToCart = () => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      imagen_url: producto.imagen_url,
      cantidad: 1,
      precio: precioDescuento,
    });
    setShowModal(false);
  };

  const handleBuyNow = async () => {
    if (!user) {
      setPostLoginAction("checkout");
      setShowLogin(true);
      return;
    }

    const mensaje = `Hola, quiero comprar el siguiente producto:%0A• ${producto.nombre} = ${formatCOP(precioDescuento)}`;

    await supabase.from("compras").insert({
      user_id: user.id,
      items: [{ id: producto.id, nombre: producto.nombre, precio: precioDescuento, cantidad: 1 }],
      total: precioDescuento,
    });

    const telefonoTienda = "573027566270";
    const url = `https://wa.me/${telefonoTienda}?text=${mensaje}`;
    window.open(url, "_blank");
  };

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        data-producto-card
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={handleCardClick}
        className="bg-white border border-gray-200 rounded-3xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-sm relative p-5 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="relative w-full h-40 sm:h-64 overflow-hidden rounded-xl bg-gray-100">
          {cargandoImagen && (
            <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
              <img src="/logo.png" alt="Cargando" className="h-12 w-auto animate-pulse" />
            </div>
          )}

          {tieneDescuento && (
            <span className="absolute top-2 left-2 bg-accent text-black text-xs font-bold px-3 py-1 rounded-full shadow">
              -{producto.descuento}%
            </span>
          )}

          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            onLoad={() => setCargandoImagen(false)}
            onError={() => setCargandoImagen(false)}
            className={`w-full h-full object-cover transition duration-300 ${
              agotado ? "grayscale" : ""
            } ${cargandoImagen ? "opacity-0" : "opacity-100"}`}
          />

          {agotado && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
              <p className="text-white font-bold text-lg">AGOTADO</p>
            </div>
          )}
        </div>

        <div className="space-y-1 mt-2 mb-2 text-gray-900">
          <h2 className="text-lg font-bold leading-tight font-display uppercase break-words whitespace-normal">
            {producto.nombre}
          </h2>
          <p className="text-sm text-accent font-semibold">{producto.categoria}</p>
          <p className="hidden sm:block text-sm text-gray-600 leading-snug font-sans">
            {descripcionCorta}
          </p>
          <div className="mt-2 space-x-2">
            {tieneDescuento && (
              <span className="text-sm text-gray-400 line-through">{formatCOP(producto.precio)}</span>
            )}
            <span className="text-base font-bold text-accent">{formatCOP(precioDescuento)}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={agotado}
          className={`mt-2 w-full py-2 rounded-xl font-bold text-sm uppercase tracking-wide transition ${
            agotado
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-primary text-secondary hover:bg-accent"
          }`}
        >
          {agotado ? "No disponible" : "Agregar al carrito"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleBuyNow();
          }}
          disabled={agotado}
          className={`mt-2 w-full py-2 rounded-xl font-bold text-sm uppercase tracking-wide transition ${
            agotado
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-accent text-secondary hover:bg-primary"
          }`}
        >
          {agotado ? "No disponible" : "Comprar ahora"}
        </button>
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 overflow-auto"
        >
          <div className="bg-white text-gray-900 rounded-2xl w-full max-w-2xl mx-auto p-4 md:p-6 relative flex flex-col md:flex-row gap-6 font-sans max-h-[90vh] overflow-y-auto">
            <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center items-center relative">
              {cargandoModalImagen && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl">
                  <img src="/logo.png" alt="Cargando" className="h-16 w-auto animate-pulse" />
                </div>
              )}
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                onLoad={() => setCargandoModalImagen(false)}
                onError={() => setCargandoModalImagen(false)}
                className={`rounded-xl object-contain max-h-64 md:max-h-80 w-full ${
                  cargandoModalImagen ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-display break-words whitespace-normal">
                {producto.nombre}
              </h2>
              <p className="text-sm md:text-base text-accent font-semibold mb-2">
                {producto.categoria}
              </p>
              <div className="mb-4">
                <p className="text-gray-700 text-sm md:text-base">{producto.descripcion}</p>
              </div>
              <div className="mb-6">
                {tieneDescuento && (
                  <span className="text-base md:text-lg text-gray-400 line-through mr-2">
                    {formatCOP(producto.precio)}
                  </span>
                )}
                <span className="text-xl md:text-2xl font-bold text-primary">
                  {formatCOP(precioDescuento)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={agotado}
                className={`mt-2 w-full py-3 rounded-xl font-bold text-base uppercase tracking-wide transition font-display ${
                  agotado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-secondary hover:bg-accent hover:text-secondary"
                }`}
              >
                {agotado ? "No disponible" : "Agregar al carrito"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={agotado}
                className={`mt-2 w-full py-3 rounded-xl font-bold text-base uppercase tracking-wide transition font-display ${
                  agotado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-accent text-secondary hover:bg-primary"
                }`}
              >
                {agotado ? "No disponible" : "Comprar ahora"}
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-secondary text-3xl"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
