import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Menu, X, Search, LogOut, User } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useUI } from "../context/UIContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = useAuth();
  const { toggleFilters } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleMobileNav = (destination) => {
    setMenuOpen(false);

    if (destination === "#productos") {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: "seccion-productos" } });
      } else {
        scrollToElement("seccion-productos");
      }
      return;
    }

    if (destination === "/") {
      if (location.pathname === "/") {
        scrollToTop();
      } else {
        navigate("/");
      }
    } else if (destination.startsWith("#")) {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: destination.slice(1) } });
      } else {
        scrollToElement(destination.slice(1));
      }
    } else {
      navigate(destination);
    }
  };

  const handleSearchClick = () => {
    toggleFilters();
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  const links = [
    { label: "Inicio", path: "/" },
    { label: "Nosotros", path: "#nosotros" },
    { label: "Productos", path: "#productos" },
    { label: "Contacto", path: "#contacto" },
  ];

  return (
    <>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
className={`fixed top-0 left-0 w-full z-40 px-6 py-4 transition-all duration-700 ease-in-out ${
  isHome
    ? scrolled
      ? "bg-secondary text-white"
      : "bg-transparent text-white"
    : "bg-secondary text-white"
}`}

      >
        <div className="relative flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-3xl font-display font-bold uppercase cursor-pointer"
            onClick={() =>
              location.pathname === "/"
                ? scrollToTop()
                : navigate("/", { state: {} })
            }
          >
            PRO ACTIVE <span className="text-primary">NUTRITION</span>
          </div>

          {/* Navegación de escritorio */}
          <nav className="space-x-6 font-medium hidden md:flex">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleMobileNav(link.path)}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Botones derechos */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSearchClick}
              className="hover:text-primary"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>

            {/* Icono perfil en móvil */}
            {user && (
              <button
                onClick={() => navigate("/perfil")}
                className="md:hidden hover:text-primary"
                aria-label="Mi perfil"
              >
                <User size={22} />
              </button>
            )}

            {/* Desktop login/logout */}
            {!user ? (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden md:block bg-primary text-secondary px-4 py-2 rounded font-bold hover:bg-accent transition"
              >
                Iniciar sesión
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => navigate("/perfil")}
                  className="hover:text-primary font-semibold flex items-center gap-2"
                >
                  <User size={18} /> Mi perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-400 font-semibold flex items-center gap-2"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </div>
            )}

            {/* Botón menú móvil */}
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden">
              {menuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Menú hamburguesa móvil */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-black bg-opacity-90 backdrop-blur-md px-6 py-4 space-y-4 flex flex-col md:hidden"
          >
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => handleMobileNav(link.path)}
                className="text-left hover:text-primary"
              >
                {link.label}
              </button>
            ))}

            {!user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowLogin(true);
                }}
                className="bg-primary text-secondary px-4 py-2 rounded font-bold hover:bg-accent"
              >
                Iniciar sesión
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleMobileNav("/perfil")}
                  className="bg-white text-secondary px-4 py-2 rounded font-bold hover:bg-gray-300"
                >
                  Mi perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </motion.div>
        )}
      </motion.header>
    </>
  );
}
