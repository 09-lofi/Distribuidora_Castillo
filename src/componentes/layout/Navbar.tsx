import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LucideUser, Menu, X } from 'lucide-react';
import { PerfilDropdown } from '../auth/PerfilDropdown';
import { trackEvent } from '../../utils/analytics';

interface NavbarProps {
  isScrolled: boolean;
  isLoggedIn: boolean;
  userData: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateUser: () => Promise<void>;
}

const Navbar = ({
  isScrolled,
  isLoggedIn,
  userData,
  onOpenAuth,
  onLogout,
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 py-3 bg-castillo-oscuro ${isScrolled ? 'shadow-xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo-dis.jpeg"
            alt="Logo"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full border-2 border-castillo-limon"
          />
          <div className="flex flex-col text-white">
            <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none">
              Castillo
            </span>
            <span className="text-castillo-limon font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
              Distribuidora
            </span>
          </div>
        </Link>

        {/* MENÚ MÓVIL - HAMBURGUESA */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* ACCIONES PARA ESCRITORIO */}
        <div className="hidden lg:flex items-center gap-8 text-white font-bold text-xs uppercase tracking-widest">
          {!isLoggedIn || !userData ? (
            <button
              onClick={() => {
                trackEvent('Auth', { accion: 'abrir_login_desktop' });
                onOpenAuth();
              }}
              className="bg-castillo-naranja px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <LucideUser size={16} />
              INICIAR SESIÓN
            </button>
          ) : (
            <PerfilDropdown userData={userData} onLogout={onLogout} />
          )}
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-castillo-oscuro shadow-xl py-4 px-6 border-t border-white/10">
            {!isLoggedIn || !userData ? (
              <button
                onClick={() => {
                  window.plausible('Auth', { props: { accion: 'abrir_login_movil' } });
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-castillo-naranja px-6 py-3 rounded-lg shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-white font-bold text-sm uppercase"
              >
                <LucideUser size={18} />
                INICIAR SESIÓN
              </button>
            ) : userData?.rol === 'admin' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-black text-castillo-limon">
                      Administrador
                    </span>
                    <span className="text-white text-sm font-bold">
                      {userData?.nombre_completo}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    window.plausible('Auth', { props: { accion: 'cerrar_sesion_admin_movil' } });
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-black uppercase transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-white text-center py-2">
                  <p className="font-bold">{userData?.nombre_completo}</p>
                  <p className="text-sm text-castillo-limon">{userData?.email}</p>
                </div>
                <button
                  onClick={() => {
                    window.plausible('Auth', { props: { accion: 'cerrar_sesion_cliente_movil' } });
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-black uppercase transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;