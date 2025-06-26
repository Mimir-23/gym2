import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "../supabase";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const error = await login(email, password);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Usuario no autenticado");
        setLoading(false);
        return;
      }

      const { data, error: roleError } = await supabase
        .from("usuarios")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError) {
        toast.error("Error al verificar rol");
        setLoading(false);
        return;
      }

      if (data?.role !== "admin") {
        toast.success("Bienvenido!");
        navigate("/");
      } else {
        toast.success("Bienvenido al panel de administración ✨");
        navigate("/admin");
      }
    } else {
      toast.error("Login incorrecto");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen relative bg-[url('/src/assets/about.webp')] bg-cover bg-center flex items-center justify-center px-4 font-sans">
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-sm bg-secondary border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-6"
      >
        {/* Título */}
        <h2 className="text-3xl font-display font-black text-primary text-center uppercase">
          Acceso Admin
        </h2>

        {/* Campo email */}
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo contraseña */}
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón ingresar */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-2xl transition"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </motion.form>
    </div>
  );
}
