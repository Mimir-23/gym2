import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import ProductEditor from "./ProductEditor";
import NewProductForm from "./NewProductForm";
import ClientesPanel from "../ClientesPanel";
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiMail, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [mostrarBandeja, setMostrarBandeja] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [marcaFiltro, setMarcaFiltro] = useState("Todos");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      const user = supabase.auth.user();
      if (!user) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("usuarios")
        .select("role")
        .eq("user_id", user.id)
        .single();
      if (error || data?.role !== "admin") navigate("/");
    };
    checkAdminRole();
  }, [navigate]);

  const cargarProductos = async () => {
    const { data, error } = await supabase.from("productos").select("*");
    if (error) toast.error("Error al cargar productos");
    else setProductos(data);
  };

  const cargarMensajes = async () => {
    const { data, error } = await supabase.from("mensajes").select("*");
    if (error) toast.error("Error al cargar mensajes");
    else setMensajes(data);
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    const { data: producto } = await supabase.from("productos").select("imagen_url").eq("id", id).single();
    if (producto?.imagen_url) {
      const path = producto.imagen_url.split("/storage/v1/object/public/")[1];
      await supabase.storage.from("imagenes").remove([path]);
    }
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) toast.error("Error al eliminar");
    else {
      toast.success("Producto eliminado");
      cargarProductos();
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarMensajes();
  }, []);

  const formatCOP = (valor) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(valor);

  const sortedProductos = [...productos].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
    if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const productosFiltrados = sortedProductos.filter((p) => {
    const search = busqueda.toLowerCase();
    const matchBusqueda =
      p.nombre?.toLowerCase().includes(search) ||
      p.categoria?.toLowerCase().includes(search) ||
      p.marca?.toLowerCase().includes(search) ||
      String(p.precio)?.includes(search) ||
      String(p.precio_final)?.includes(search);
    const matchCategoria = categoriaFiltro === "Todos" || p.categoria === categoriaFiltro;
    const matchMarca = marcaFiltro === "Todos" || p.marca === marcaFiltro;
    return matchBusqueda && matchCategoria && matchMarca;
  });

  return (
    <div className="min-h-screen px-4 sm:px-8 bg-[url('/src/assets/hero.webp')] bg-cover bg-center text-white relative">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 pt-10 pb-20">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-black text-primary text-center md:text-left">
            Panel Administrativo
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setMostrarBandeja(!mostrarBandeja)} className="flex items-center gap-2 bg-primary hover:bg-yellow-400 text-secondary px-4 py-2 rounded-2xl font-bold transition">
              <FiMail /> Bandeja
            </button>
            {!productoSeleccionado && (
              <button onClick={() => setProductoSeleccionado({ nuevo: true })} className="flex items-center gap-2 bg-accent hover:bg-green-500 text-secondary px-4 py-2 rounded-2xl font-bold transition">
                <FiPlus /> Nuevo
              </button>
            )}
            <ClientesPanel />
            <button onClick={handleCerrarSesion} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold">
              <FiLogOut /> Salir
            </button>
          </div>
        </div>

        {/* ZONA PRINCIPAL */}
        <div className="space-y-8">
          {productoSeleccionado ? (
            productoSeleccionado.nuevo ? (
              <NewProductForm
                onCreated={() => {
                  toast.success("Producto creado exitosamente");
                  setProductoSeleccionado(null);
                  cargarProductos();
                }}
                onCancel={() => setProductoSeleccionado(null)}
              />
            ) : (
              <ProductEditor
                producto={productoSeleccionado}
                onClose={(actualizado) => {
                  if (actualizado) {
                    toast.success("Producto actualizado");
                    cargarProductos();
                  }
                  setProductoSeleccionado(null);
                }}
              />
            )
          ) : (
            <>
              {/* FILTROS */}
              <div className="flex flex-wrap gap-4 mb-8">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 min-w-[200px] bg-light text-secondary border border-gray-400 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="flex-1 min-w-[200px] bg-light text-secondary border border-gray-400 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Todos">Todas las Categorías</option>
                  {[...new Set(productos.map((p) => p.categoria))].map((categoria) => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <select
                  value={marcaFiltro}
                  onChange={(e) => setMarcaFiltro(e.target.value)}
                  className="flex-1 min-w-[200px] bg-light text-secondary border border-gray-400 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Todos">Todas las Marcas</option>
                  {[...new Set(productos.map((p) => p.marca))].map((marca) => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>

              {/* TABLA DE PRODUCTOS */}
              <div className="w-full overflow-x-auto rounded-2xl bg-gray-900 shadow-lg">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-secondary text-primary">
                    <tr>
                      <th className="px-4 py-4">Imagen</th>
                      {['nombre', 'categoria', 'marca', 'precio'].map((key) => (
                        <th key={key} className="px-4 py-4 cursor-pointer select-none" onClick={() => requestSort(key)}>
                          <div className="flex items-center gap-1">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                            {sortConfig.key === key ? (
                              sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />
                            ) : null}
                          </div>
                        </th>
                      ))}
                      <th className="px-4 py-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="px-4 py-2">
                          {producto.imagen_url ? (
                            <img src={producto.imagen_url} alt={producto.nombre} className="w-16 h-16 object-cover rounded-lg" />
                          ) : (
                            <span className="text-gray-400">Sin imagen</span>
                          )}
                        </td>
                        <td className="px-4 py-4">{producto.nombre}</td>
                        <td className="px-4 py-4">{producto.categoria}</td>
                        <td className="px-4 py-4">{producto.marca}</td>
                        <td className="px-4 py-4">{formatCOP(producto.precio_final || producto.precio)}</td>
                        <td className="px-4 py-4 flex gap-2">
                          <button onClick={() => setProductoSeleccionado(producto)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleEliminar(producto.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* BANDEJA DE MENSAJES */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: mostrarBandeja ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 w-full max-w-md md:max-w-[90vw] h-full bg-secondary z-[9999] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-y-auto border-l border-primary p-6"
        >
          {mostrarBandeja && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">Bandeja de Mensajes</h2>
                <button onClick={() => setMostrarBandeja(false)} className="text-red-400 hover:text-red-300 text-sm font-semibold">
                  <FiX size={18} />
                </button>
              </div>

              {mensajes.length === 0 ? (
                <p className="text-gray-400">No hay mensajes nuevos.</p>
              ) : (
                mensajes.map((msg) => (
                  <div key={msg.id} className="mb-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <p className="text-xs text-gray-400">{new Date(msg.creado_en).toLocaleString()}</p>
                    <p className="font-bold text-primary">{msg.nombre}</p>
                    <p className="text-sm text-gray-300">📱 {msg.telefono}</p>
                    <p className="text-white text-sm">{msg.mensaje}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
