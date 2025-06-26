// components/CompletarPerfilModal.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { toast } from "react-hot-toast";

export default function CompletarPerfilModal({ userId, onClose }) {
  const [form, setForm] = useState({ nombre: "", direccion: "", telefono: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { nombre, direccion, telefono } = form;

    const { error } = await supabase
      .from("usuarios")
      .update({ nombre, direccion, telefono })
      .eq("user_id", userId);

    setLoading(false);

    if (error) {
      toast.error("Error al guardar");
    } else {
      toast.success("Perfil actualizado");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleGuardar}
        className="bg-white text-secondary p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Completa tu perfil</h2>

        <input
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-accent text-secondary font-bold py-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
