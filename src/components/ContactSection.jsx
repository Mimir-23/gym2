"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, User, MessageSquare, MapPin } from "lucide-react";
import { supabase } from "../supabase";

export default function ContactSection() {
  const [form, setForm] = useState({ nombre: "", telefono: "", mensaje: "" });
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("mensajes")
      .insert([{ nombre: form.nombre, telefono: form.telefono, mensaje: form.mensaje }]);
    if (error) console.error("❌ Error al guardar en Supabase:", error);

    try {
      const response = await fetch("https://formspree.io/f/xdkgovpw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, telefono: form.telefono, message: form.mensaje }),
      });
      if (response.ok) {
        setMensajeEnviado(true);
        setForm({ nombre: "", telefono: "", mensaje: "" });
        setTimeout(() => setMensajeEnviado(false), 5000);
      } else {
        alert("Error al enviar el mensaje. Intenta más tarde.");
      }
    } catch (err) {
      console.error("❌ Error en Formspree:", err);
      alert("Error al enviar el mensaje.");
    }
  };

  return (
    <section id="contacto" className="relative text-white py-24 px-4 sm:px-10 overflow-hidden bg-[url('/src/assets/conta.jpeg')] bg-cover bg-center">
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Formulario de contacto */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="mb-6">
            <h2 className="text-4xl font-display font-black text-accent uppercase mb-3">
              Contáctanos
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">
              ¿Tienes dudas? Escríbenos y te responderemos lo antes posible.
            </p>
          </div>

          {mensajeEnviado && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl shadow text-sm">
              ✅ ¡Mensaje enviado con éxito! En breve nos pondremos en contacto contigo.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-600 bg-white/10 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Tu teléfono"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-600 bg-white/10 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div className="relative">
              <MessageSquare className="absolute left-4 top-5 text-gray-400" />
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                placeholder="Escribe tu mensaje"
                rows={5}
                className="w-full pl-12 pr-4 pt-4 pb-3 rounded-xl border border-gray-600 bg-white/10 text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary text-secondary font-bold py-3 rounded-xl hover:bg-accent transition"
            >
              Enviar mensaje
            </motion.button>
          </form>
        </motion.div>

        {/* Mapa de ubicación */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full h-[450px] rounded-2xl shadow-xl overflow-hidden relative"
        >
          <iframe
            title="Ubicación - Centro Comercial Metro Recreo"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d836.0156324031597!2d-74.20083177123601!3d4.632772956500841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9de3d0e694c1%3A0x2721adfc26b1d9bb!2sCentro%20Comercial%20Metro%20Recreo!5e0!3m2!1ses-419!2sco!4v1745506396167!5m2!1ses-419!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <MapPin className="text-white text-5xl animate-bounce" />
            <span className="mt-2 bg-white text-primary font-semibold rounded-lg px-3 py-1">
              Aquí nos encuentras
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
