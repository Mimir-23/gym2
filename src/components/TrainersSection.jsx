import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const entrenadores = [
  {
    nombre: "Carlos Gómez",
    especialidad: "Funcional",
    frase: "Entrena con disciplina.",
    imagen: "/images/trainer1.jpg",
    cols: "col-span-2",
    rows: "row-span-2",
  },
  {
    nombre: "Laura Pérez",
    especialidad: "Nutrición deportiva",
    frase: "La clave está en lo que comes.",
    imagen: "/images/trainer2.jpg",
    cols: "col-span-1",
    rows: "row-span-1",
  },
  {
    nombre: "Andrés Romero",
    especialidad: "Personalizado",
    frase: "Cada cuerpo es diferente.",
    imagen: "/images/trainer3.jpg",
    cols: "col-span-1",
    rows: "row-span-2",
  },
  {
    nombre: "Valentina Ruiz",
    especialidad: "Movilidad y core",
    frase: "Fuerza desde adentro.",
    imagen: "/images/trainer4.jpg",
    cols: "col-span-2",
    rows: "row-span-1",
  },
];

export default function TrainersSection() {
  return (
    <section className="bg-[#111827] text-white py-20 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-black text-primary uppercase mb-12 text-center"
        >
          Nuestros entrenadores
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] gap-4">
          {entrenadores.map((trainer, i) => (
            <Tilt
              key={i}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1000}
              scale={1.03}
              transitionSpeed={900}
              className={`relative overflow-hidden rounded-2xl shadow-lg bg-black group ${trainer.cols} ${trainer.rows}`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full h-full relative"
              >
                <img
                  src={trainer.imagen}
                  alt={trainer.nombre}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 z-10 transition duration-300" />
                <div className="relative z-20 h-full flex flex-col justify-end p-5">
                  <h3 className="text-xl font-bold">{trainer.nombre}</h3>
                  <p className="text-primary font-semibold">{trainer.especialidad}</p>
                  <p className="text-sm italic text-gray-300 mt-1">"{trainer.frase}"</p>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
