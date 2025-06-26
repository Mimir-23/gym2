import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { setShowLogin, setPostLoginAction } = useUI();

  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .then(({ data }) => {
        const filtrados = (data || []).filter((p) => p.promocion === true);
        setOfertas(filtrados);
      });
  }, []);

  useEffect(() => {
    if (location.hash === "#inicio-ofertas") {
      const anchor = document.getElementById("inicio-ofertas");
      if (anchor) {
        setTimeout(() => {
          anchor.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  }, [location]);

  const handleBuyNow = async (producto) => {
    if (!user) {
      setPostLoginAction("checkout");
      setShowLogin(true);
      return;
    }

    const precio = producto.precio_final ?? producto.precio;
    const mensaje = `Hola, quiero comprar el siguiente producto:%0A• ${producto.nombre} = ${new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)}`;

    await supabase.from("compras").insert({
      user_id: user.id,
      items: [{ id: producto.id, nombre: producto.nombre, precio, cantidad: 1 }],
      total: precio,
    });

    window.open(`https://wa.me/573027566270?text=${mensaje}`, "_blank");
  };

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  return (
    <div className="bg-black text-white font-sans">
      <Header />

      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary to-accent text-secondary py-4 px-6 text-center shadow-md relative z-20"
      >
        <div className="flex items-center justify-center gap-3 text-lg sm:text-xl font-bold uppercase tracking-wide">
          <Flame className="text-red-600 animate-bounce" size={24} />
          Promociones activas esta semana – ¡No te las pierdas!
          <Flame className="text-red-600 animate-bounce" size={24} />
        </div>
      </motion.div>

      <section className="pt-32 pb-20 px-4 sm:px-6 md:px-10 min-h-screen relative">
        <div id="inicio-ofertas" className="absolute -top-24" />

        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-accent drop-shadow-sm">
            Productos en Promocion
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-medium">
            Seleccionamos nuestras mejores marcas y fórmulas con descuentos únicos para ti.
          </p>
        </div>

        {ofertas.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No hay productos en oferta en este momento.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {ofertas.map((producto) => (
              <div
                key={producto.id}
                className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full bg-gradient-to-br from-black via-zinc-900 to-black"
              >
                {/* Fondo + Imagen */}
                <div
                  className="relative h-[500px] sm:h-[560px] md:h-[600px] bg-cover bg-center"
                  style={{ backgroundImage: `url('/bg-ofertas.png')` }}
                >
                  <div className="absolute inset-0 bg-black/60 z-0" />
                  <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-56 sm:w-64 md:w-72 h-auto drop-shadow-2xl">
                    <img
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black/80 z-20 pointer-events-none rounded-b-3xl" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-col justify-between px-6 py-6 text-center text-white bg-black/80 flex-1 shadow-inner">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase font-display leading-snug break-words">
                      {producto.nombre}
                    </h3>
                    <p className="text-lg sm:text-xl text-accent font-semibold mt-1">
                      {formatCOP(producto.precio_final ?? producto.precio)}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={() =>
                        addToCart({
                          id: producto.id,
                          nombre: producto.nombre,
                          imagen_url: producto.imagen_url,
                          cantidad: 1,
                          precio: producto.precio_final ?? producto.precio,
                        })
                      }
                      className="w-full bg-primary text-secondary font-bold py-3 px-4 rounded-xl hover:bg-accent transition text-sm sm:text-base shadow-md"
                    >
                      Agregar al carrito
                    </button>
                    <button
                      onClick={() => handleBuyNow(producto)}
                      className="w-full bg-accent text-secondary font-bold py-3 px-4 rounded-xl hover:bg-primary transition text-sm sm:text-base shadow-md"
                    >
                      Comprar ahora
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
