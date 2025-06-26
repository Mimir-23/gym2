import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import ProductList from '../components/ProductList';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import RegisterModal from '../components/RegisterModal';
import WeeklyOffers from "../components/WeeklyOffers";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate(); // 👉 ahora usamos navigate también
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
  
    // Detectar si se llegó por navegación (no refresh ni acceso directo)
    const isClientNavigation = window.performance
      .getEntriesByType("navigation")[0]?.type === "navigate";
  
    if (scrollTo && isClientNavigation) {
      const element = document.getElementById(scrollTo);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
  
      // Limpiar el state
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  
  return (
    <div className="bg-black text-white">
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      <Header />
      <Hero onRegisterClick={() => setShowRegister(true)} />
      <WeeklyOffers />
      <ProductList />
      <About />
      <ContactSection />
      <Footer />
    </div>
  );
}
