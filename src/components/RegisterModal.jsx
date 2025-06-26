import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";
import { X, Mail, Lock, User, MapPin, Phone } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function RegisterModal({ onClose }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    direccion: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, nombre, direccion, telefono } = form;

    if (!email || !password || !nombre) {
      toast.error("Por favor completa todos los campos obligatorios");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, direccion, telefono },
      },
    });

    if (signUpError) {
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      toast.success("Cuenta creada. Revisa tu correo para confirmarla 📩");
      setLoading(false);
      onClose();
      return;
    }

    const { error: insertError } = await supabase.from("usuarios").insert({
      user_id: data.user.id,
      email,
      role: "user",
      nombre,
      direccion: direccion || "No disponible",
      telefono: telefono || "No disponible",
    });

    if (insertError) {
      toast.error("No se pudo crear el perfil correctamente");
      setLoading(false);
      return;
    }

    toast.success("Registro exitoso 🎉");
    setLoading(false);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    setLoading(false);

    if (error) {
      toast.error("Error al registrarse con Google");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div ref={modalRef} className="relative bg-secondary border border-primary rounded-2xl shadow-2xl p-8 w-full max-w-md text-white space-y-6">
        
        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-primary hover:text-accent transition">
          <X size={24} />
        </button>

        {/* Título */}
        <h2 className="text-3xl font-display font-bold text-primary text-center">
          Crear Cuenta
        </h2>

        {/* Botón Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-light text-secondary font-bold py-3 rounded-2xl hover:bg-primary hover:text-secondary transition"
        >
          <FcGoogle size={24} />
          Registrarme con Google
        </button>

        {/* Separador */}
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <hr className="flex-1 border-gray-600" />
          O registrándote manualmente
          <hr className="flex-1 border-gray-600" />
        </div>

        {/* Formulario de registro */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          {/* Nombre */}
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              name="nombre"
              type="text"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Dirección */}
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              name="direccion"
              type="text"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Teléfono */}
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              name="telefono"
              type="text"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Botón de Registrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-2xl transition"
          >
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>
      </div>
    </div>
  );
}
