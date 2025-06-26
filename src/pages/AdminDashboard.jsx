import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import AdminPanel from "../components/admin/AdminPanel";

function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      // Consultar el role del usuario
      const { data, error } = await supabase
        .from("usuarios")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || !data || data.role !== "admin") {
        navigate("/"); // No es admin -> lo mandamos a home
      } else {
        setIsAdmin(true); // Sí es admin
      }
    };

    checkAdmin();
  }, [user, navigate]);

  if (isAdmin === null) return null; // Mientras se valida, no renderiza nada

  return <AdminPanel />;
}

export default AdminDashboard;
