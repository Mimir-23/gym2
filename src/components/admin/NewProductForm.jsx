import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import ImageUploader from "./ImageUploader";
import { toast } from "react-hot-toast";

// Formato de moneda COP
const formatCOP = (value) => {
  if (!value) return "";
  const number = parseInt(value.replace(/\D/g, ""), 10);
  return number.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
};

export default function NewProductForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    descripcion: "",
    agotado: false,
    mas_vendido: false,
    imagen_url: "",
  });

  const [precioRaw, setPrecioRaw] = useState("");
  const [precioDisplay, setPrecioDisplay] = useState("");
  const [descuentoRaw, setDescuentoRaw] = useState("");
  const [descuentoDisplay, setDescuentoDisplay] = useState("");
  const [precioFinal, setPrecioFinal] = useState("0");

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mostrarNuevaMarca, setMostrarNuevaMarca] = useState(false);
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarMarcas();
    cargarCategorias();
  }, []);

  const cargarMarcas = async () => {
    const { data } = await supabase.from("marcas").select("*");
    if (data) setMarcas(data);
  };

  const cargarCategorias = async () => {
    const { data } = await supabase.from("categorias").select("*");
    if (data) setCategorias(data);
  };

  useEffect(() => {
    const precio = parseInt(precioRaw || "0", 10);
    const descuento = parseInt(descuentoRaw || "0", 10);
    const final = precio - Math.floor((precio * descuento) / 100);
    setPrecioFinal(final.toString());
  }, [precioRaw, descuentoRaw]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrecioChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPrecioRaw(digits);
    setPrecioDisplay(formatCOP(digits));
  };

  const handleDescuentoChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setDescuentoRaw(digits);
    setDescuentoDisplay(digits);
  };

  const crearMarca = async () => {
    if (!nuevaMarca.trim()) return;
    const { error } = await supabase.from("marcas").insert({ nombre: nuevaMarca.trim() });
    if (!error) {
      toast.success("Marca creada");
      setForm((f) => ({ ...f, marca: nuevaMarca.trim() }));
      cargarMarcas();
      setNuevaMarca("");
      setMostrarNuevaMarca(false);
    } else {
      toast.error("Error creando marca");
    }
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    const { error } = await supabase.from("categorias").insert({ nombre: nuevaCategoria.trim() });
    if (!error) {
      toast.success("Categoría creada");
      setForm((f) => ({ ...f, categoria: nuevaCategoria.trim() }));
      cargarCategorias();
      setNuevaCategoria("");
      setMostrarNuevaCategoria(false);
    } else {
      toast.error("Error creando categoría");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("productos").insert([
      {
        ...form,
         promocion: form.promocion || false,
        precio: parseInt(precioRaw) || 0,
        descuento: parseInt(descuentoRaw) || 0,
        precio_final: parseInt(precioFinal) || 0,
      },
    ]);

    setSaving(false);

    if (error) {
      toast.error("Error al crear producto");
      console.error(error);
    } else {
      toast.success("Producto creado exitosamente");
      onCreated();
    }
  };

  return (
    <div className="bg-secondary bg-opacity-90 p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
      <h2 className="text-3xl font-display font-bold text-primary mb-6 text-center">Crear Nuevo Producto</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre */}
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="w-full bg-light text-secondary p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />

        {/* Categoría */}
        <div className="flex gap-2">
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="flex-1 bg-light text-secondary p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMostrarNuevaCategoria(true)}
            className="bg-accent hover:bg-green-500 text-secondary px-4 py-2 rounded-2xl text-sm font-bold transition"
          >
            + Nueva
          </button>
        </div>

        {mostrarNuevaCategoria && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Nueva Categoría"
              value={nuevaCategoria}
              onChange={(e) => setNuevaCategoria(e.target.value)}
              className="flex-1 bg-light text-secondary p-3 rounded-2xl"
            />
            <button type="button" onClick={crearCategoria} className="bg-primary hover:bg-yellow-400 text-secondary px-4 py-2 rounded-2xl font-bold">
              Guardar
            </button>
          </div>
        )}

        {/* Marca */}
        <div className="flex gap-2">
          <select
            name="marca"
            value={form.marca}
            onChange={handleChange}
            className="flex-1 bg-light text-secondary p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMostrarNuevaMarca(true)}
            className="bg-accent hover:bg-green-500 text-secondary px-4 py-2 rounded-2xl text-sm font-bold transition"
          >
            + Nueva
          </button>
        </div>

        {mostrarNuevaMarca && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              placeholder="Nueva Marca"
              value={nuevaMarca}
              onChange={(e) => setNuevaMarca(e.target.value)}
              className="flex-1 bg-light text-secondary p-3 rounded-2xl"
            />
            <button type="button" onClick={crearMarca} className="bg-primary hover:bg-yellow-400 text-secondary px-4 py-2 rounded-2xl font-bold">
              Guardar
            </button>
          </div>
        )}

        {/* Descripción */}
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción del producto"
          rows={4}
          className="w-full bg-light text-secondary p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />

        {/* Precio, Descuento y Final */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="precio"
            inputMode="numeric"
            value={precioDisplay}
            onChange={handlePrecioChange}
            placeholder="Precio $"
            className="bg-light text-secondary p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="text"
            name="descuento"
            inputMode="numeric"
            value={descuentoDisplay}
            onChange={handleDescuentoChange}
            placeholder="Descuento %"
            className="bg-light text-secondary p-3 rounded-2xl"
          />
          <input
            type="text"
            value={formatCOP(precioFinal)}
            disabled
            className="bg-light text-secondary p-3 rounded-2xl font-bold"
          />
        </div>

        {/* Estado de Producto */}
{/* Estado de Producto */}
<div className="flex flex-wrap gap-6">
  <label className="flex items-center gap-2">
    <input type="checkbox" name="agotado" checked={form.agotado} onChange={handleChange} className="accent-red-500" />
    <span className="text-white">Agotado</span>
  </label>
  <label className="flex items-center gap-2">
    <input type="checkbox" name="mas_vendido" checked={form.mas_vendido} onChange={handleChange} className="accent-yellow-400" />
    <span className="text-white">Más vendido</span>
  </label>
  <label className="flex items-center gap-2">
    <input type="checkbox" name="promocion" checked={form.promocion || false} onChange={handleChange} className="accent-green-500" />
    <span className="text-white">Promoción</span>
  </label>
</div>

        {/* Subir Imagen */}
        <ImageUploader
          currentImage={form.imagen_url}
          onUpload={(url) => setForm((f) => ({ ...f, imagen_url: url }))}
        />

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-2xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary hover:bg-yellow-400 text-secondary font-bold px-6 py-2 rounded-2xl"
          >
            {saving ? "Guardando..." : "Crear Producto"}
          </button>
        </div>

      </form>
    </div>
  );
}
