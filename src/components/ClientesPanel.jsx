import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { toast } from "react-hot-toast";
import { Users, FileText, X } from "lucide-react";

export default function ClientesPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [compras, setCompras] = useState([]);
  const [flatData, setFlatData] = useState([]);
  const [filters, setFilters] = useState({});
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  const cargarClientes = async () => {
    setLoading(true);
    const [{ data: users }, { data: orders }] = await Promise.all([
      supabase.from("usuarios").select("*"),
      supabase.from("compras").select("*"),
    ]);

    if (!users || !orders) {
      toast.error("Error al cargar clientes o compras");
      setLoading(false);
      return;
    }

    const rows = [];
    users.forEach((u) => {
      const userCompras = orders.filter((c) => c.user_id === u.user_id);
      if (userCompras.length === 0) {
        rows.push({
          Nombre: u.nombre,
          Email: u.email,
          Teléfono: u.telefono,
          Dirección: u.direccion,
          "Fecha compra": "",
          Producto: "",
          Cantidad: "",
          "Total compra": "",
        });
      } else {
        userCompras.forEach((c) => {
          c.items.forEach((item) => {
            rows.push({
              Nombre: u.nombre,
              Email: u.email,
              Teléfono: u.telefono,
              Dirección: u.direccion,
              "Fecha compra": c.creado_en, // guardar fecha en formato real
              Producto: item.nombre,
              Cantidad: item.cantidad,
              "Total compra": c.total,
            });
          });
        });
      }
    });

    setFlatData(rows);
    setLoading(false);
  };

  const handleExport = () => {
    const exportData = flatData.map((row) => ({
      ...row,
      "Fecha compra": row["Fecha compra"]
        ? new Date(row["Fecha compra"]).toLocaleDateString()
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "historial_clientes.xlsx");
  };

  const columns = flatData[0] ? Object.keys(flatData[0]) : [];

  const handleFilterChange = (col, value) => {
    setFilters((prev) => ({ ...prev, [col]: value }));
  };

  const filteredData = flatData.filter((row) => {
    const matchesColumns = Object.entries(filters).every(([col, value]) =>
      row[col]?.toString().toLowerCase().includes(value.toLowerCase())
    );

    const fechaCompra = row["Fecha compra"] ? new Date(row["Fecha compra"]).toISOString().slice(0, 10) : "";

    const matchesFechaDesde = !fechaDesde || (fechaCompra && fechaCompra >= fechaDesde);
    const matchesFechaHasta = !fechaHasta || (fechaCompra && fechaCompra <= fechaHasta);

    return matchesColumns && matchesFechaDesde && matchesFechaHasta;
  });

  return (
    <>
      <button
        onClick={() => {
          cargarClientes();
          setShowModal(true);
        }}
        className="flex items-center gap-2 bg-accent hover:bg-yellow-400 text-secondary font-bold px-4 py-2 rounded-2xl transition"
      >
        <Users size={18} />
        Historial de Clientes
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-secondary p-8 rounded-2xl shadow-2xl border border-primary">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-display font-bold text-primary">Historial de Clientes</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Filtro de Fechas */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex flex-col">
                    <label className="text-sm text-primary mb-1">Fecha desde:</label>
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      className="bg-light text-secondary rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-primary mb-1">Fecha hasta:</label>
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      className="bg-light text-secondary rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Contenido tabla */}
                {loading ? (
                  <p className="text-gray-400 text-center py-10">Cargando datos...</p>
                ) : filteredData.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">No hay resultados.</p>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                      <table className="min-w-full text-sm text-left text-white">
                        <thead>
                          <tr>
                            {columns.map((col) => (
                              <th
                                key={col}
                                className="px-4 py-3 bg-gray-800 font-bold uppercase text-primary text-xs tracking-wider"
                              >
                                {col}
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    value={filters[col] || ""}
                                    onChange={(e) => handleFilterChange(col, e.target.value)}
                                    placeholder="Filtrar..."
                                    className="w-full bg-light text-secondary rounded-2xl px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                                  />
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}>
                              {columns.map((col, j) => (
                                <td key={j} className="px-4 py-3 text-gray-300">
                                  {col === "Fecha compra" && row[col]
                                    ? new Date(row[col]).toLocaleDateString()
                                    : row[col]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Botón Exportar */}
                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-primary hover:bg-yellow-400 text-secondary font-bold px-6 py-3 rounded-2xl transition"
                      >
                        <FileText size={20} /> Exportar a Excel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
