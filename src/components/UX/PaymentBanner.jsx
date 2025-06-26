import { motion } from "framer-motion";

export default function PaymentBanner() {
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    "https://cdn.prod.website-files.com/6317a229ebf7723658463b4b/663a6b0d43303ddf38035997_logo-nequi.svg",
    "https://conectesunegocio.daviplata.com/sites/default/files/styles/original/public/2023-11/NAV%20-%20Logo%20DaviPlata.png?itok=GpqvMnmo",
    "https://www.pse.com.co/image/layout_icon?img_id=1202326",
    "https://5471282.fs1.hubspotusercontent-na1.net/hubfs/5471282/2024%20assets%20news/addi-logo.svg",
  ];

  const repeatedLogos = Array.from({ length: 20 }, (_, i) => logos[i % logos.length]);

  return (
    <div className="overflow-hidden w-full py-8 bg-white text-gray-900 font-sans">
      <motion.div
        className="flex items-center min-w-[200%] gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" }}
      >
        {repeatedLogos.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`logo-${index}`}
            className="h-8 sm:h-12 object-contain mx-4 opacity-80 hover:opacity-100 hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
