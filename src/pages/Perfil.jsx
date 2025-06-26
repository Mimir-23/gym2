import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Home, Phone, Mail, Save, LogOut } from "lucide-react";
import HistorialDeCompras from "../components/HistorialDeCompras";

export default function Perfil() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    async function loadUserData() {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Error al cargar tus datos");
      } else if (!data) {
        toast.error("No se encontraron datos de perfil.");
      } else {
        setForm({
          nombre: data.nombre || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          email: data.email || user.email,
        });
      }

      setLoading(false);
    }

    loadUserData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("usuarios")
      .update({
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Hubo un problema al guardar cambios");
    } else {
      toast.success("Cambios guardados correctamente ✅");
    }
  };

  const confirmLogout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) {
      toast.error("Error al cerrar sesión");
    } else {
      toast.success("Sesión cerrada 👋");
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <section className="min-h-screen pt-32 md:pt-24 lg:pt-20 relative bg-[url('/src/assets/hero.webp')] bg-cover bg-center text-white font-sans px-6 pb-20">


      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* PERFIL */}
        <div className="bg-secondary border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold text-primary">Mi Perfil</h1>
            <button
              onClick={() => setShowConfirmLogout(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl transition"
            >
              <LogOut size={18} /> Cerrar sesión
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Correo electrónico</label>
                <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3">
                  <Mail className="text-gray-400 mr-3" size={18} />
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="bg-transparent w-full text-white outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Nombre completo</label>
                <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3">
                  <User className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="bg-transparent w-full text-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Dirección</label>
                <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3">
                  <Home className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    className="bg-transparent w-full text-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                <div className="flex items-center bg-gray-800 rounded-xl px-4 py-3">
                  <Phone className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="bg-transparent w-full text-white outline-none"
                    required
                  />
                </div>
              </div>

              {/* Botón Guardar */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-xl transition"
              >
                <Save size={20} /> Guardar cambios
              </button>
            </form>
          )}
        </div>

        {/* HISTORIAL DE COMPRAS */}
        <div className="bg-secondary border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 text-primary text-center">
            Mis Compras
          </h2>
          <div className="flex-1 overflow-y-auto">
            <HistorialDeCompras />
          </div>
        </div>

      </div>

      {/* MODAL CONFIRMAR LOGOUT */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-secondary p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-6">
            <h2 className="text-xl font-display font-bold text-white">¿Cerrar sesión?</h2>
            <p className="text-gray-400 text-sm">¿Estás seguro de salir de tu cuenta?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-6 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
