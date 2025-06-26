import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // ✅ Asegúrate de importar esto

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuth(); // ✅ usamos el contexto de sesión

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error("Error al cambiar la contraseña");
    } else {
      toast.success("Contraseña actualizada ✅");

      // ✅ Obtener sesión actual de nuevo y actualizar el contexto
      const { data } = await supabase.auth.getSession();
      setSession?.(data?.session);

      setRedirecting(true);

      setTimeout(() => {
        navigate("/"); // ✅ redirige correctamente al Home
      }, 2500);
    }
  };

  return (
    <section className="min-h-screen bg-secondary text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">

        <form
          onSubmit={handleReset}
          className="bg-white/10 p-8 rounded-2xl border border-gray-700 space-y-6"
        >
          <h3 className="text-xl font-bold text-primary text-center">
            Ingresa tu nueva contraseña
          </h3>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-light text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-xl transition"
          >
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </form>

        {redirecting && (
          <p className="text-center text-primary font-bold">
            Redirigiendo a la página principal...
          </p>
        )}
      </div>
    </section>
  );
}
