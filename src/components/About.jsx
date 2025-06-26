"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Flame, ThumbsUp } from "lucide-react";
import logo from "../assets/logo_transparente.png"; // Ruta relativa desde src/components

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="relative bg-[url('/src/assets/about.webp')] bg-cover bg-center text-white py-28 px-6 sm:px-10 overflow-hidden font-sans"
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-24">
        {/* Título principal */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-display font-black text-center uppercase"
        >
          Somos Pro Active <span className="text-accent">Nutrition</span>
        </motion.h2>

        {/* Misión y Visión */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Misión */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-primary" />
              <h2 className="text-3xl font-display font-black uppercase text-primary">
                Misión
              </h2>
            </div>
            <p className="text-light text-base leading-relaxed">
              Proporcionar productos de alta calidad y eficacia para mejorar el
              rendimiento y la salud de nuestros clientes, ofreciendo una línea
              completa de suplementos de alta proteína diseñados para el pre y
              durante el entrenamiento, con el compromiso de brindar resultados
              tangibles y duraderos.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-primary" />
              <h2 className="text-3xl font-display font-black uppercase text-primary">
                Visión
              </h2>
            </div>
            <p className="text-light text-base leading-relaxed">
              Ser reconocidos como líderes en el mercado de suplementos
              nutricionales, siendo la primera opción para atletas y
              entusiastas del fitness que buscan optimizar su rendimiento y
              bienestar mediante productos innovadores y de calidad superior.
            </p>
          </div>
        </motion.div>

        {/* Sección de valores/pilares + logo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-16"
        >
          {/* Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <Feature
              icon={<Flame size={28} />}
              title="Pasión"
              description="Nos mueve la energía de ayudar a transformar cuerpos y vidas a través de la nutrición deportiva."
            />
            <Feature
              icon={<Star size={28} />}
              title="Innovación"
              description="Nos reinventamos para ofrecerte siempre lo mejor: fórmulas modernas, efectivas y seguras."
            />
            <Feature
              icon={<ThumbsUp size={28} />}
              title="Confianza"
              description="Transparencia, integridad y resultados tangibles. Estamos contigo en cada paso del camino."
            />
          </div>

          {/* Logo central */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={logo}
              alt="Logo Pro Active"
              className="h-32 sm:h-40 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm text-gray-300 italic">
              Impulsando tu mejor versión
            </p>
          </div>
        </motion.div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h4 className="text-lg font-bold italic text-white mb-2 uppercase">
            Valores
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            Excelencia, Integridad, Innovación,
            <br />
            Pasión por el rendimiento
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-md hover:shadow-lg transition"
    >
      <div className="text-primary mb-3 flex justify-center">{icon}</div>
      <h4 className="text-lg font-bold text-white mb-2 uppercase font-display">
        {title}
      </h4>
      <p className="text-gray-300 text-sm leading-relaxed font-sans">
        {description}
      </p>
    </motion.div>
  );
}
