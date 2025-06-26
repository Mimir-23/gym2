import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function CartToggleButton() {
  const { toggleCart, cartItems, isOpen } = useCart();

  const cantidadTotal = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          onClick={toggleCart}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 bg-primary text-white p-3 rounded-full shadow-lg z-50 hover:bg-red-700 transition"
        >
          <div className="relative">
            <FaShoppingCart size={24} />
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {cantidadTotal}
              </span>
            )}
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
