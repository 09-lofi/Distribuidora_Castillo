//import React from 'react';
import { Link } from 'react-router-dom';
import { LucideUser } from 'lucide-react';
import {PerfilDropdown} from '../auth/PerfilDropdown';

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
    return (
        <nav
        className={`
            fixed top-0 w-full z-[100] transition-all duration-300 py-3 bg-castillo-oscuro
            ${isScrolled ? 'shadow-xl' : ''}
        `}
        >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3">
            <img
                src="/logo-dis.jpeg"
                alt="Logo"
                className="h-12 w-12 rounded-full border-2 border-castillo-limon"
            />
            <div className="flex flex-col text-white">
                <span className="font-black text-xl tracking-tighter uppercase leading-none">
                Castillo
                </span>
                <span className="text-castillo-limon font-bold text-[10px] uppercase tracking-[0.2em]">
                Distribuidora
                </span>
            </div>
            </Link>

            {/* ACCIONES */}
            <div className="hidden lg:flex items-center gap-8 text-white font-bold text-xs uppercase tracking-widest">
            {!isLoggedIn || !userData ? (
                <button
                onClick={onOpenAuth}
                className="bg-castillo-naranja px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                <LucideUser size={16} />
                INICIAR SESIÓN
                </button>
            ) : userData?.rol === 'admin' ? (
                <div className="flex items-center gap-4 bg-white/5 px-5 py-2 rounded-full border border-white/10">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-castillo-limon tracking-widest">
                    Administrador Activo
                    </span>
                    <span className="text-white text-xs font-bold">
                    {userData?.nombre_completo}
                    </span>
                </div>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all"
                >
                    Salir
                </button>
                </div>
            ) : (
                <PerfilDropdown userData={userData} onLogout={onLogout} />
            )}
            </div>
        </div>
        </nav>
    );
};

export default Navbar;