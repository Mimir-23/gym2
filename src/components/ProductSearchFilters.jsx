import React, { useRef, useEffect, useState } from "react";
import Fuse from "fuse.js";
import { FaSearch, FaArrowLeft, FaFire, FaTag, FaBoxes, FaBuilding, FaThLarge, FaTrash } from "react-icons/fa";

export default function ProductSearchSidebar({
  busqueda,
  setBusqueda,
  marcas,
  categorias,
  categoriasPorMarca,
  setMarcaActiva,
  setCategoriaActiva,
  setMostrarMasVendidos,
  setMostrarOfertas,
  setPaginaActual,
  clearAllFilters,
  setShowSidebar,
  onFilterApplied,
  productos, // ← productos recibidos para sugerencias
}) {
  const searchRef = useRef();
  const [activeMenu, setActiveMenu] = useState("main");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [sugerencias, setSugerencias] = useState([]);

  const fuse = new Fuse(productos, {
    keys: ["nombre"],
    threshold: 0.4,
  });

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBusqueda(value);
    setPaginaActual(1);

    if (value.trim() === "") {
      setSugerencias([]);
    } else {
      const resultados = fuse.search(value).slice(0, 5); // máximo 5 sugerencias
      setSugerencias(resultados.map((r) => r.item.nombre));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setBusqueda(suggestion);
    setSugerencias([]);
    setPaginaActual(1);
    setTimeout(() => {
      onFilterApplied();
    }, 100);
  };

  const handleCloseSidebarAndScroll = () => {
    setShowSidebar(false);
    setTimeout(() => {
      onFilterApplied();
    }, 0);
  };

  const applyMarca = (marca) => {
    setMarcaSeleccionada(marca);
    if (categoriasPorMarca[marca]?.length > 0) {
      setActiveMenu("categoriasPorMarca");
    } else {
      setMarcaActiva(marca);
      setCategoriaActiva("Todas");
      setMostrarMasVendidos(false);
      setMostrarOfertas(false);
      setPaginaActual(1);
      handleCloseSidebarAndScroll();
    }
  };

  const applyCategoriaByMarca = (categoria) => {
    setMarcaActiva(marcaSeleccionada);
    setCategoriaActiva(categoria);
    setMostrarMasVendidos(false);
    setMostrarOfertas(false);
    setPaginaActual(1);
    handleCloseSidebarAndScroll();
  };

  const applyCategoriaGeneral = (categoria) => {
    setMarcaActiva("Todas");
    setCategoriaActiva(categoria);
    setMostrarMasVendidos(false);
    setMostrarOfertas(false);
    setPaginaActual(1);
    handleCloseSidebarAndScroll();
  };

  const applyMasVendidos = () => {
    setMarcaActiva("Todas");
    setCategoriaActiva("Todas");
    setMostrarMasVendidos(true);
    setMostrarOfertas(false);
    setPaginaActual(1);
    handleCloseSidebarAndScroll();
  };

  const applyOfertas = () => {
    setMarcaActiva("Todas");
    setCategoriaActiva("Todas");
    setMostrarMasVendidos(false);
    setMostrarOfertas(true);
    setPaginaActual(1);
    handleCloseSidebarAndScroll();
  };

  const applyClearFilters = () => {
    clearAllFilters();
    setActiveMenu("main");
    handleCloseSidebarAndScroll();
  };

  const BotonLimpiar = () => (
    <button
      onClick={applyClearFilters}
      className="flex items-center justify-center gap-2 w-full px-5 py-3 mt-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition"
    >
      <FaTrash /> Limpiar filtros
    </button>
  );

  return (
    <aside className="w-full bg-white h-fit p-6 font-sans">
      {/* Buscador */}
      <div className="relative mb-8">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          ref={searchRef}
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCloseSidebarAndScroll();
            }
          }}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />

        {/* Sugerencias */}
        {sugerencias.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white shadow-md rounded-lg z-50 max-h-60 overflow-auto">
            {sugerencias.map((sugerencia, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sugerencia)}
                className="w-full text-left px-4 py-2 hover:bg-primary/20 text-secondary font-medium text-sm transition"
              >
                {sugerencia}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menú Principal */}
      {activeMenu === "main" && (
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-display mb-4 text-secondary">Filtros</h3>

          <button onClick={() => setActiveMenu("marcas")} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-primary/10 text-secondary font-semibold text-lg transition">
            <FaBuilding className="text-primary" /> Marcas
          </button>

          <button onClick={() => setActiveMenu("categorias")} className="w-full flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-primary/10 text-secondary font-semibold text-lg transition">
            <FaThLarge className="text-primary" /> Categorías
          </button>

          <button onClick={applyMasVendidos} className="flex items-center gap-3 w-full px-5 py-3 rounded-xl hover:bg-primary/10 text-secondary font-semibold text-lg transition">
            <FaFire className="text-primary" /> Más vendidos
          </button>

          <button onClick={applyOfertas} className="flex items-center gap-3 w-full px-5 py-3 rounded-xl hover:bg-primary/10 text-secondary font-semibold text-lg transition">
            <FaTag className="text-primary" /> En oferta
          </button>

          <BotonLimpiar />
        </div>
      )}

      {/* Menú Marcas */}
      {activeMenu === "marcas" && (
        <div className="flex flex-col gap-4">
          <button onClick={() => setActiveMenu("main")} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-4 text-lg">
            <FaArrowLeft /> Volver
          </button>

          <h3 className="text-2xl font-display mb-4 text-secondary">Selecciona una Marca</h3>

          {marcas.map((marca) => (
            <button
              key={marca}
              onClick={() => applyMarca(marca)}
              className="w-full text-left px-5 py-3 rounded-xl hover:bg-gray-100 text-secondary font-semibold text-base transition"
            >
              {marca}
            </button>
          ))}

          <BotonLimpiar />
        </div>
      )}

      {/* Menú Categorías por Marca */}
      {activeMenu === "categoriasPorMarca" && (
        <div className="flex flex-col gap-4">
          <button onClick={() => setActiveMenu("marcas")} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-4 text-lg">
            <FaArrowLeft /> Volver
          </button>

          <h3 className="text-2xl font-display mb-4 text-secondary">Categorías de {marcaSeleccionada}</h3>

{categoriasPorMarca[marcaSeleccionada]?.length > 0 ? (
  <>
    <button
      onClick={() => {
        setMarcaActiva(marcaSeleccionada);
        setCategoriaActiva("Todas");
        setMostrarMasVendidos(false);
        setMostrarOfertas(false);
        setPaginaActual(1);
        handleCloseSidebarAndScroll();
      }}
      className="w-full text-left px-5 py-3 rounded-xl hover:bg-gray-100 text-secondary font-semibold text-base transition"
    >
      TODOS LOS PRODUCTOS
    </button>

    {categoriasPorMarca[marcaSeleccionada].map((categoria) => (
      <button
        key={categoria}
        onClick={() => applyCategoriaByMarca(categoria)}
        className="w-full text-left px-5 py-3 rounded-xl hover:bg-gray-100 text-secondary font-semibold text-base transition"
      >
        {categoria}
      </button>
    ))}
  </>
) : (
  <p className="text-gray-500">No hay categorías para esta marca.</p>
)}


          <BotonLimpiar />
        </div>
      )}

      {/* Menú Categorías generales */}
      {activeMenu === "categorias" && (
        <div className="flex flex-col gap-4">
          <button onClick={() => setActiveMenu("main")} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-4 text-lg">
            <FaArrowLeft /> Volver
          </button>

          <h3 className="text-2xl font-display mb-4 text-secondary">Todas las Categorías</h3>

          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => applyCategoriaGeneral(categoria)}
              className="w-full text-left px-5 py-3 rounded-xl hover:bg-gray-100 text-secondary font-semibold text-base transition"
            >
              {categoria}
            </button>
          ))}

          <BotonLimpiar />
        </div>
      )}
    </aside>
  );
}
