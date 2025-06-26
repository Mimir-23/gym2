import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [perfilIncompleto, setPerfilIncompleto] = useState(false);

  useEffect(() => {
    // Procesar tokens de OAuth (Google, etc.)
    supabase.auth.exchangeCodeForSession().then(({ data, error }) => {
      if (error) {
        console.error("❌ Error al procesar sesión OAuth:", error.message);
      }
      if (data?.session) {
        console.log("🎯 Sesión obtenida desde redirección:", data.session);
      }
    });

    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false); // 🚀 mostramos la app rápido

      if (data?.session?.user) {
        crearPerfilSiFalta(data.session.user); // 🚀 crear perfil en segundo plano
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔄 Cambio de sesión detectado:", session);
      setUser(session?.user || null);

      if (session?.user) {
        crearPerfilSiFalta(session.user); // 🚀 en segundo plano
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function crearPerfilSiFalta(user) {
    try {
      console.log("👤 Verificando perfil en 'usuarios' para:", user.id);

      const { data: existingUser, error: selectError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (existingUser) {
        console.log("✅ Perfil ya existe");

        const faltaNombre = !existingUser.nombre || existingUser.nombre === "Sin nombre";
        const faltaDireccion = !existingUser.direccion || existingUser.direccion === "No disponible";
        const faltaTelefono = !existingUser.telefono || existingUser.telefono === "No disponible";

        if (faltaNombre || faltaDireccion || faltaTelefono) {
          console.warn("⚠️ Perfil incompleto detectado");
          setPerfilIncompleto(true);
        } else {
          setPerfilIncompleto(false);
        }

        return;
      }

      if (selectError && selectError.code !== "PGRST116") {
        console.error("❌ Error buscando usuario:", selectError.message);
        return;
      }

      console.log("📥 Usuario nuevo, creando perfil en 'usuarios'...");

      setTimeout(async () => {
        const { error: insertError } = await supabase
          .from("usuarios")
          .insert({
            user_id: user.id,
            email: user.email,
            role: "user",
            nombre: user.user_metadata?.nombre || user.email?.split("@")[0] || "Sin nombre",
            direccion: "No disponible",
            telefono: "No disponible",
          })
          .select();

        if (insertError) {
          console.error("❌ Error insertando usuario:", insertError.message);
        } else {
          console.log("✅ Perfil creado correctamente");
          setPerfilIncompleto(true); // perfil está por defecto incompleto
        }
      }, 500);
    } catch (error) {
      console.error("❌ Error general creando perfil:", error.message);
    }
  }

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, perfilIncompleto }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
