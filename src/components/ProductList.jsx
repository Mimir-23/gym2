import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import ProductCard from "./ProductCard";
import PaymentBanner from "./UX/PaymentBanner";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FiltersSidebar from "./FiltersSidebar";
import { useUI } from "../context/UIContext";
import Fuse from "fuse.js";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [marcaActiva, setMarcaActiva] = useState("Todas");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [mostrarMasVendidos, setMostrarMasVendidos] = useState(false);
  const [mostrarOfertas, setMostrarOfertas] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);

  const { toggleFilters } = useUI();
  const navigate = useNavigate();
  const productosRef = useRef();

  const productosPorPagina = 8;

  useEffect(() => {
    supabase
      .from("productos")
      .select("*")
      .then(({ data }) => {
        setProductos(data || []);
      });
  }, []);

  const marcas = [...new Set(productos.map((p) => p.marca).filter(Boolean))];
  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  const categoriasPorMarca = {};
  productos.forEach((p) => {
    if (!categoriasPorMarca[p.marca]) {
      categoriasPorMarca[p.marca] = [];
    }
    if (p.categoria && !categoriasPorMarca[p.marca].includes(p.categoria)) {
      categoriasPorMarca[p.marca].push(p.categoria);
    }
  });

  const fuse = new Fuse(productos, {
    keys: ["nombre"],
    threshold: 0.4,
  });

  const tieneDescuento = (p) => {
    const descuento = Number(p.descuento);
    return !isNaN(descuento) && descuento > 0;
  };

  const productosFiltrados = (() => {
    let resultadosBusqueda = productos;

    if (busqueda.trim() !== "") {
      const resultadosFuse = fuse.search(busqueda);
      resultadosBusqueda = resultadosFuse.map((r) => r.item);
    }

    return resultadosBusqueda.filter((p) => {
      const matchMarca = marcaActiva === "Todas" || p.marca === marcaActiva;
      const matchCategoria = categoriaActiva === "Todas" || p.categoria === categoriaActiva;
      const matchMasVendidos = !mostrarMasVendidos || p.mas_vendido;
      const matchOfertas = !mostrarOfertas || tieneDescuento(p);
      return matchMarca && matchCategoria && matchMasVendidos && matchOfertas;
    });
  })();

  const startIndex = (paginaActual - 1) * productosPorPagina;
  const paginados = productosFiltrados.slice(startIndex, startIndex + productosPorPagina);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina) || 1;

  const clearAllFilters = () => {
    setBusqueda("");
    setMarcaActiva("Todas");
    setCategoriaActiva("Todas");
    setMostrarMasVendidos(false);
    setMostrarOfertas(false);
    setPaginaActual(1);
  };

const handleFilterApplied = () => {
  setTimeout(() => {
    // Solo hacer scroll si estamos dentro del contenedor principal
    const contenedor = document.getElementById("seccion-productos");
    if (!contenedor) return;

    const primerProducto = contenedor.querySelector('[data-producto-card]');
    if (primerProducto) {
      primerProducto.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
};

  
  const handleChangePagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    setTimeout(() => {
      const productosSection = document.getElementById("seccion-productos");
      if (productosSection) {
        productosSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <section
      id="seccion-productos"
      ref={productosRef}
      className="bg-white text-gray-900 py-16 px-4 sm:px-6 md:px-10 relative"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <PaymentBanner />
  
        <FiltersSidebar
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          marcas={marcas}
          categorias={categorias}
          categoriasPorMarca={categoriasPorMarca}
          setMarcaActiva={setMarcaActiva}
          setCategoriaActiva={setCategoriaActiva}
          setMostrarMasVendidos={setMostrarMasVendidos}
          setMostrarOfertas={setMostrarOfertas}
          setPaginaActual={setPaginaActual}
          clearAllFilters={clearAllFilters}
          onFilterApplied={handleFilterApplied}
          productos={productos}
        />
  
        <div className="text-center px-2 sm:px-4">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-accent uppercase mb-4">
            Nuestros Suplementos
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Explora nuestra línea de suplementos diseñados para maximizar tu entrenamiento.
          </p>
        </div>
  
        <div className="w-full">
          <motion.div
            className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginados.length === 0 ? (
              <p className="col-span-full text-gray-400 mt-10 text-center">
                No se encontraron productos.
              </p>
            ) : (
              paginados.map((producto) => (
                <motion.div
                  key={producto.id}
                  variants={itemVariants}
                  className="w-full"
                >
                  <ProductCard producto={producto} />
                </motion.div>
              ))
            )}
          </motion.div>
  
          {totalPaginas > 1 && (
  <div className="flex justify-center items-center gap-2 mt-16 flex-wrap">
    <button
      onClick={() => handleChangePagina(Math.max(1, paginaActual - 1))}
      disabled={paginaActual === 1}
      className="px-4 py-2 text-sm bg-gray-200 text-gray-700 border border-gray-300 rounded disabled:opacity-40 flex items-center"
    >
      <FaChevronLeft className="inline-block mr-1" />
      <span className="hidden sm:inline">Anterior</span>
    </button>

    {Array.from({ length: totalPaginas }, (_, i) => i + 1)
      .filter((page) => {
        return (
          page === 1 || // siempre la primera
          page === totalPaginas || // siempre la última
          Math.abs(paginaActual - page) <= 1 // rango cercano
        );
      })
      .reduce((acc, page, i, arr) => {
        if (i > 0 && page - arr[i - 1] > 1) {
          acc.push("ellipsis"); // inserta "..." entre saltos grandes
        }
        acc.push(page);
        return acc;
      }, [])
      .map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handleChangePagina(page)}
            className={`px-3 py-1 text-sm rounded border ${
              paginaActual === page
                ? "bg-accent text-secondary border-accent"
                : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-accent hover:text-secondary"
            }`}
          >
            {page}
          </button>
        )
      )}

    <button
      onClick={() => handleChangePagina(Math.min(totalPaginas, paginaActual + 1))}
      disabled={paginaActual === totalPaginas}
      className="px-4 py-2 text-sm bg-gray-200 text-gray-700 border border-gray-300 rounded disabled:opacity-40 flex items-center"
    >
      <span className="hidden sm:inline">Siguiente</span>
      <FaChevronRight className="inline-block ml-1" />
    </button>
  </div>
)}

        </div>
      </div>
    </section>
  );
  
}
