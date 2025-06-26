import { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import ProductSearchSidebar from "./ProductSearchFilters";
import { useUI } from "../context/UIContext";

export default function FiltersSidebar({
  busqueda,
  setBusqueda,
  categorias,
  marcas,
  categoriasPorMarca,
  categoriaActiva,
  marcaActiva,
  mostrarMasVendidos,
  setCategoriaActiva,
  setMarcaActiva,
  setMostrarMasVendidos,
  setMostrarOfertas,
  setPaginaActual,
  clearAllFilters,
  onFilterApplied,
}) {
  const { isFiltersOpen, toggleFilters } = useUI();
  const sidebarRef = useRef();

  // Detectar click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFiltersOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleFilters();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersOpen, toggleFilters]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 w-80 bg-white h-full z-50 shadow-lg transition-transform duration-300 ${
        isFiltersOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b">
        <h3 className="text-xl font-bold">Filtros</h3>
        <button onClick={toggleFilters}>
          <IoMdClose size={24} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        <ProductSearchSidebar
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          categorias={categorias}
          marcas={marcas}
          categoriasPorMarca={categoriasPorMarca}
          categoriaActiva={categoriaActiva}
          marcaActiva={marcaActiva}
          mostrarMasVendidos={mostrarMasVendidos}
          setCategoriaActiva={setCategoriaActiva}
          setMarcaActiva={setMarcaActiva}
          setMostrarMasVendidos={setMostrarMasVendidos}
          setMostrarOfertas={setMostrarOfertas}
          setPaginaActual={setPaginaActual}
          clearAllFilters={clearAllFilters}
          setShowSidebar={toggleFilters}
          onFilterApplied={onFilterApplied}
        />
      </div>
    </div>
  );
}
