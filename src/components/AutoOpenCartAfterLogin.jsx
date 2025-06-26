// components/AutoOpenCartAfterLogin.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useUI } from "../context/UIContext";

export default function AutoOpenCartAfterLogin() {
  const { user } = useAuth();
  const { cartItems, isOpen, toggleCart } = useCart();
  const { postLoginAction, setPostLoginAction, setShowLogin } = useUI();

  useEffect(() => {
    if (!user) return;

    const shouldOpenForCheckout = postLoginAction === "checkout";
    const hasStoredCart = cartItems.length > 0;

    if (shouldOpenForCheckout) {
      setPostLoginAction(null);
      setShowLogin(false);
    }

    if ((shouldOpenForCheckout || hasStoredCart) && !isOpen) {
      toggleCart();
    }
  }, [user]);

  return null;
}
