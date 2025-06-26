import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleNav = (destination) => {
    if (destination === "/") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else if (destination.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: destination.slice(1) } });
      } else {
        scrollToElement(destination.slice(1));
      }
    }
  };

  return (
    <footer className="bg-secondary text-white pt-16 pb-6 px-6 sm:px-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        {/* Logo / Info */}
        <div>
          <h2 className="text-2xl font-display font-bold text-accent mb-4 uppercase">
            PRO ACTIVE NUTRITION
          </h2>
          <div className="mb-4">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </div>
          <p className="text-gray-400">
            Suplementación deportiva de calidad. Con asesoría profesional y productos certificados.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-lg font-display font-bold text-primary mb-4">Navegación</h3>
          <ul className="space-y-2 text-gray-300">
            <li><button onClick={() => handleNav("/")} className="hover:text-accent transition text-left w-full">Inicio</button></li>
            <li><button onClick={() => handleNav("#productos")} className="hover:text-accent transition text-left w-full">Productos</button></li>
            <li><button onClick={() => handleNav("#nosotros")} className="hover:text-accent transition text-left w-full">Nosotros</button></li>
            <li><button onClick={() => handleNav("#contacto")} className="hover:text-accent transition text-left w-full">Contacto</button></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-display font-bold text-primary mb-4">Contacto</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Cra. 97c #69A-08 Sur, Bogotá Piso 2
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> 302 7566370
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> contacto@proactivenutrition.com
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-lg font-display font-bold text-primary mb-4">Síguenos</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="https://facebook.com" target="_blank" className="hover:text-accent transition" rel="noreferrer"><Facebook /></a>
            <a href="https://instagram.com" target="_blank" className="hover:text-accent transition" rel="noreferrer"><Instagram /></a>
            <a href="https://tiktok.com" target="_blank" className="hover:text-accent transition" rel="noreferrer"><SiTiktok size={20} /></a>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-500 space-y-2">
        <div>© {new Date().getFullYear()} Pro Active Nutrition. Todos los derechos reservados.</div>
        <div>
          Sitio desarrollado por{" "}
          <a href="https://landingdevs.online/" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline">
            LandingDevs
          </a>
        </div>
      </div>
    </footer>
  );
}
