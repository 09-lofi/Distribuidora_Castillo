import React from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppAuth } from './hooks/useAppAuth';
import Navbar from './componentes/layout/Navbar'
import Footer from './componentes/layout/Footer';
import ModalAuth from './componentes/auth/ModalAuth';
import { Inicio } from './pages/Inicio';
import { Catalogo } from './pages/Catalogo';
import AdminLogin from './componentes/admin/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Pedidos from './componentes/admin/Pedido';
import Inventario from './componentes/admin/Inventario';

function App() {
  const location = useLocation();
  // ADMIN ROUTES
  const isAdminRoute =
    location.pathname.startsWith('/admin');

  // CUSTOM HOOK
  const {
    isScrolled,
    isModalOpen,
    setIsModalOpen,
    isLoggedIn,
    esRegistro,
    setEsRegistro,
    userData,
    formData,
    handleInputChange,
    handleAuth,
    handleLogout,
    refreshUserData
  } = useAppAuth();
  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-montserrat">
      {/* TOASTER */}
      <Toaster position="top-center" />
      {/* NAVBAR */}
      {!isAdminRoute && (
        <Navbar
          isScrolled={isScrolled}
          isLoggedIn={isLoggedIn}
          userData={userData}
          onOpenAuth={() => {
            setEsRegistro(false);
            setIsModalOpen(true);
          }}
          onLogout={handleLogout}
          onUpdateUser={refreshUserData}
        />
      )}
      {/* MODAL AUTH */}
      <ModalAuth
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        esRegistro={esRegistro}
        setEsRegistro={setEsRegistro}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAuth={handleAuth}
      />
      {/* MAIN */}
      <main className="flex-grow pt-24">
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={<Inicio />}
          />
          <Route
            path="/catalogo"
            element={
              <Catalogo
                isLoggedIn={isLoggedIn}
                userData={userData}
                setIsModalOpen={setIsModalOpen}
              />
            }
          />
          {/* ADMIN */}
          <Route
            path="/admin"
            element={<AdminLogin />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
          <Route
            path="/admin/pedidos"
            element={<Pedidos />}
          />
          <Route
            path="/admin/inventario"
            element={<Inventario />}
          />
        </Routes>
      </main>
      {/* FOOTER */}
      {!isAdminRoute && (
        <Footer />
      )}
    </div>
  );
}

export default App;