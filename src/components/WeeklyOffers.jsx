import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { Flame, Percent, ArrowRightCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function WeeklyOffers() {
  const [ofertas, setOfertas] = useState([]);
  const [countdown, setCountdown] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { setShowLogin, setPostLoginAction } = useUI();

  const getEndOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = (7 - day) % 7;
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + diff);
    sunday.setHours(23, 59, 59, 999);
    return sunday;
  };

  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .then(({ data }) => {
        const filtrados = (data || []).filter((p) => p.promocion === true);
        setOfertas(filtrados.slice(0, 3)); // Solo 3
      });
  }, []);

  useEffect(() => {
    const endTime = getEndOfWeek();
    const updateCountdown = () => {
      const now = new Date();
      const diff = endTime - now;
      if (diff <= 0) {
        setCountdown("Ofertas finalizadas");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyNow = async (producto) => {
    if (!user) {
      setPostLoginAction("checkout");
      setShowLogin(true);
      return;
    }

    const precio = producto.precio_final ?? producto.precio;
    const mensaje = `Hola, quiero comprar el siguiente producto:%0A• ${producto.nombre} = ${formatCOP(precio)}`;
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

  if (ofertas.length === 0) return null;

  return (
    <section className="relative text-white py-20 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full flex justify-center opacity-5 text-primary text-[180px] pointer-events-none">
        <Percent size={160} />
      </div>

      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-display font-black text-accent uppercase flex justify-center items-center gap-2"
        >
          <Flame className="text-primary animate-pulse" />
          Ofertas de la Semana
        </motion.h2>
        <div className="flex justify-center items-center gap-2 mt-4 text-secondary font-bold text-lg">
          <Clock className="text-primary" />
          {countdown === "Ofertas finalizadas" ? (
            <span className="text-red-600">Ofertas finalizadas</span>
          ) : (
            <>
              <span>Termina en:</span>
              <span className="text-accent">{countdown}</span>
            </>
          )}
        </div>
        <p className="mt-4 text-gray-200 text-base sm:text-lg max-w-2xl mx-auto font-medium">
          ¡Promociones explosivas en tus suplementos favoritos por tiempo limitado!
        </p>
      </div>

      {/* Cards responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {ofertas.map((producto) => (
<motion.div
  key={producto.id}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
  className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full bg-gradient-to-br from-black via-zinc-900 to-black"
>
  {/* Sección superior: fondo + imagen */}
  <div
    className="relative h-[360px] sm:h-[420px] md:h-[460px] bg-cover bg-center"
    style={{ backgroundImage: `url('/bg-ofertas.png')` }}
  >
    <div className="absolute inset-0 bg-black/60 z-0" />

    {/* Imagen centrada más grande y más abajo */}
    <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-40 sm:w-48 md:w-56 h-auto drop-shadow-2xl">
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        className="w-full h-full object-contain"
      />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black/80 z-20 pointer-events-none rounded-b-3xl" />
    </div>
  </div>

  {/* Contenido: título, precio y botones */}
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
</motion.div>



        ))}
      </div>

      <div className="relative z-10 mt-16 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/ofertas")}
          className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-secondary font-bold py-3 px-6 rounded-xl transition text-lg shadow-md"
        >
          Ver todos los productos en Promocion <ArrowRightCircle className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
}
