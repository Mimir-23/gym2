import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { X, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginModal({ onClose, onRegister }) {
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [forgotView, setForgotView] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false); // ✅ Nuevo estado

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: clave,
    });

    setLoading(false);

    if (error) {
      toast.error("Correo o contraseña incorrectos");
    } else {
      toast.success("Bienvenido de nuevo ✨");
      setSession?.(data.session);
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    setLoadingGoogle(false);

    if (error) {
      toast.error("Error al iniciar sesión con Google");
    }
  };

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setRecoveryLoading(false);

    if (error) {
      toast.error("No se pudo enviar el correo de recuperación.");
    } else {
      setRecoverySent(true); // ✅ Mostrar mensaje en lugar del formulario
      setRecoveryEmail("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-md p-8 bg-secondary border border-primary rounded-2xl shadow-2xl flex flex-col gap-6"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-primary hover:text-accent transition">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-display font-bold text-primary text-center">
          {forgotView ? "Recuperar contraseña" : "Iniciar Sesión"}
        </h2>

        {!forgotView ? (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="w-full flex items-center justify-center gap-3 bg-light text-secondary font-bold py-3 rounded-2xl hover:bg-primary hover:text-secondary transition"
            >
              {loadingGoogle ? "Cargando..." : (
                <>
                  <FcGoogle size={24} />
                  Continuar con Google
                </>
              )}
            </button>

            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <hr className="flex-1 border-gray-600" />
              O con tu correo
              <hr className="flex-1 border-gray-600" />
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-2xl transition"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

            <button
              onClick={() => setForgotView(true)}
              className="text-sm text-center text-primary hover:text-accent font-bold hover:underline transition"
            >
              ¿Olvidaste tu contraseña?
            </button>

            <p className="text-sm text-center text-white/70">
              ¿No tienes cuenta?{" "}
              <button onClick={onRegister} className="text-primary hover:text-accent font-bold hover:underline transition">
                Regístrate aquí
              </button>
            </p>
          </>
        ) : (
          recoverySent ? (
            <div className="text-center space-y-4 p-4">
              <h3 className="text-xl font-bold text-primary">📩 Revisa tu bandeja de entrada</h3>
              <p className="text-white/80 text-sm">
                Te hemos enviado un enlace para restablecer tu contraseña.
                Si no lo ves en unos segundos, revisa tu carpeta de spam.
              </p>
              <button
                onClick={() => {
                  setForgotView(false);
                  setRecoverySent(false);
                }}
                className="text-sm text-primary hover:text-accent font-bold hover:underline transition"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : (
            <>
              <form onSubmit={handleRecoverySubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-light text-secondary font-sans focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full bg-primary hover:bg-accent text-secondary font-bold py-3 rounded-2xl transition"
                >
                  {recoveryLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>
              </form>

              <button
                onClick={() => setForgotView(false)}
                className="text-sm text-center text-primary hover:text-accent font-bold hover:underline transition"
              >
                Volver al inicio de sesión
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}
