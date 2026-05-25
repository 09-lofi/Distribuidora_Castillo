import React, { useState } from 'react';
import {
  LucideUser,
  LucideHistory,
  LucideLogOut,
  LucideChevronDown,
  LucideX,
  LucideShoppingBag,
  LucideSettings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HistorialCompras from '../tienda/HistorialCompra';
import PerfilUsuario from '../auth/PerfilUsuario';

interface PerfilDropdownProps {
  userData: any;
  onLogout: () => void;
}

export const PerfilDropdown = ({ userData, onLogout }: PerfilDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // Seguridad
    if (!userData) return null;

    // Datos Usuario
    const primerNombre = userData?.nombre_completo?.split(' ')[0] || 'Usuario';
    const emailUsuario = userData?.email || 'Sin correo';
    const segmentoUsuario = userData?.segmento || 'Cliente';

    return (
        <>
        <div className="relative">
            {/* BOTON */}
            <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 transition-all group"
            >
            <div className="w-8 h-8 bg-castillo-naranja rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <LucideUser size={16} />
            </div>

            <div className="text-left hidden sm:block">
                <p className="text-[9px] leading-none text-castillo-limon font-black uppercase tracking-wider">
                {segmentoUsuario}
                </p>
                <p className="text-[11px] font-bold text-white truncate max-w-[100px] uppercase">
                {primerNombre}
                </p>
            </div>

            <LucideChevronDown
                size={14}
                className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
            {isOpen && (
                <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-[30px] shadow-2xl border border-slate-100 overflow-hidden z-20"
                >
                    <div className="p-3">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Cuenta Activa
                        </p>
                        <p className="text-xs font-bold text-castillo-oscuro truncate">
                        {emailUsuario}
                        </p>
                    </div>

                    {/* Opciones */}
                    <button
                        onClick={() => { setShowProfile(true); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase text-slate-600 transition-all group"
                    >
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <LucideSettings size={16} />
                        </div>
                        Mi Perfil
                    </button>

                    <button
                        onClick={() => { setShowHistory(true); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase text-slate-600 transition-all group mt-1"
                    >
                        <div className="p-2 bg-castillo-naranja/10 rounded-lg group-hover:bg-castillo-naranja group-hover:text-white transition-colors">
                        <LucideHistory size={16} />
                        </div>
                        Mis Facturas
                    </button>

                    <button
                        onClick={async () => { setIsOpen(false); await onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-2xl text-[10px] font-black uppercase text-red-500 transition-all group mt-1"
                    >
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <LucideLogOut size={16} />
                        </div>
                        Cerrar Sesión
                    </button>
                    </div>
                </motion.div>
                </>
            )}
            </AnimatePresence>
        </div>

        {/* MODALES: PERFIL Y FACTURAS */}
        <AnimatePresence>
            {showProfile && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProfile(false)} className="absolute inset-0 bg-castillo-oscuro/80 backdrop-blur-md" />
                
                <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative w-full max-w-lg z-10">
                <button onClick={() => setShowProfile(false)} className="absolute -top-12 right-0 text-white hover:text-castillo-naranja transition-colors">
                    <LucideX size={32} />
                </button>
                <PerfilUsuario user={userData} onClose={() => setShowProfile(false)} />
                </motion.div>
            </div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {showHistory && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="absolute inset-0 bg-castillo-oscuro/80 backdrop-blur-md" />
                
                <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }} className="relative bg-white w-full max-w-4xl h-[85vh] rounded-[50px] shadow-2xl overflow-hidden flex flex-col">
                <div className="bg-castillo-oscuro p-8 text-white flex justify-between items-center relative overflow-hidden">
                    <LucideShoppingBag className="absolute -right-4 -bottom-4 opacity-10" size={150} />
                    <h3 className="font-black text-3xl uppercase italic tracking-tighter relative z-10">Mis Compras</h3>
                    <button onClick={() => setShowHistory(false)} className="relative z-10 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors">
                    <LucideX size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
                    <HistorialCompras user={userData} />
                </div>
                </motion.div>
            </div>
            )}
        </AnimatePresence>
        </>
    );
};