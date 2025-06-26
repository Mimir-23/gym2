// src/components/HistorialDeCompras.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";     // 👈 traer el user
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";
import { CalendarDays } from "lucide-react";

export default function HistorialDeCompras() {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no hay user o no está logueado, paramos
    if (!user?.id) {
      setCompras([]);
      setLoading(false);
      return;
    }

    const fetchCompras = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("compras")
        .select("*")
        .eq("user_id", user.id)
        .order("creado_en", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("No se pudo cargar tu historial");
        setCompras([]);
      } else {
        setCompras(data);
      }
      setLoading(false);
    };

    fetchCompras();
  }, [user]);

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  if (loading) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Cargando historial…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Debes iniciar sesión para ver tu historial.
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Aún no has realizado compras.
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      {compras.map((c) => (
        <div key={c.id} className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CalendarDays size={16} />{" "}
              {new Date(c.creado_en).toLocaleString("es-CO")}
            </div>
            <div className="text-sm font-semibold text-primary">
              Total: {formatCOP(c.total)}
            </div>
          </div>
          <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
            {c.items.map((item, i) => (
              <li key={i}>
                {item.nombre} x{item.cantidad} — {formatCOP(item.precio * item.cantidad)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
