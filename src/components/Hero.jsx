"use client";

import { motion } from "framer-motion";
import RotatingText from "./UX/RotatingText";
import { GiftIcon } from "lucide-react";

export default function Hero({ onRegisterClick }) {
  return (
    <section className="relative h-screen bg-[url('/src/assets/hero.jpg')] bg-cover bg-center text-white font-sans">
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Contenido del Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-32">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-display font-extrabold flex flex-wrap justify-center gap-2 uppercase"
        >
          DESBLOQUEA TU{" "}
          <RotatingText
            texts={["POTENCIAL", "FUERZA", "MENTE", "ENERGÍA"]}
            mainClassName="px-2 bg-primary text-secondary overflow-hidden py-1 rounded-md"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.035}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2500}
          />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-4 text-lg md:text-xl text-light font-sans"
        >
          TRANSFORMA TU VIDA CON PRO ACTIVE NUTRITION
        </motion.p>



        {/* Tarjeta de promoción */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl px-6 py-4 rounded-2xl max-w-md text-light flex items-start gap-3"
        >
          <GiftIcon className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
          <p className="text-sm md:text-base text-light">
            <span className="font-semibold text-accent">Regístrate</span> y en tu primera compra de{" "}
            <span className="font-semibold">$200.000</span> o más, obtén un{" "}
            <span className="font-bold text-accent">10% de descuento</span>.
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onRegisterClick}
          className="mt-6 bg-primary px-6 py-3 rounded-xl text-secondary text-lg font-bold hover:bg-accent transition"
        >
          ¡Regístrate ya!
        </motion.button>
      </div>
    </section>
  );
}
