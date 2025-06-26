import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // ➕ Nuevos estados
  const [postLoginAction, setPostLoginAction] = useState(null);
  const [shouldOpenCart, setShouldOpenCart] = useState(false);

  const toggleFilters = () => setIsFiltersOpen((prev) => !prev);

  return (
    <UIContext.Provider
      value={{
        showLogin,
        setShowLogin,
        showRegister,
        setShowRegister,
        isFiltersOpen,
        toggleFilters,
        postLoginAction,
        setPostLoginAction,
        shouldOpenCart,
        setShouldOpenCart,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
