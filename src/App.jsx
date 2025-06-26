import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartSidebar from "./components/CartSidebar";
import CartToggleButton from "./components/CartToggleButton";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import AutoOpenCartAfterLogin from "./components/AutoOpenCartAfterLogin";
import CompletarPerfilModal from "./components/CompletarPerfilModal";
import Ofertas from "./pages/Ofertas";
import PageLoader from "./components/PageLoader"; // ✅ Nuevo import

import { AuthProvider, useAuth } from "./context/AuthContext";
import { UIProvider, useUI } from "./context/UIContext";
import { Toaster } from "react-hot-toast";

function AppWrapper() {
  const location = useLocation();
  const { showLogin, setShowLogin, showRegister, setShowRegister } = useUI();
  const { user, perfilIncompleto } = useAuth();

  const hideHeaderOnRoutes = ["/admin", "/login"];
  const shouldHideHeader = hideHeaderOnRoutes.some((r) =>
    location.pathname.startsWith(r)
  );

  return (
    <>
      <PageLoader /> {/* ✅ Loader de logo mientras se cambia de ruta */}

      <AutoOpenCartAfterLogin />

      {perfilIncompleto && user && (
        <CompletarPerfilModal
          userId={user.id}
          onClose={() => window.location.reload()}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      {!shouldHideHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage />
              <CartSidebar />
              <CartToggleButton />
            </>
          }
        />
        <Route
          path="/ofertas"
          element={
            <>
              <Ofertas />
              <CartSidebar />
              <CartToggleButton />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
          <AppWrapper />
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  );
}
