import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // duración del loader

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <img
        src="/logo.png"
        alt="Cargando..."
        className="h-36 w-auto animate-pulse drop-shadow-xl mb-6"
      />
      <p className="text-3xl sm:text-4xl text-white font-bold animate-bounce tracking-wide">
        Cargando...
      </p>
    </div>
  );
}
