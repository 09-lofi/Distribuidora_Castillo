import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LucideShoppingCart,
    LucideX,
    LucideTrash2,
    LucidePlus,
    LucideMinus,
    LucideArrowRight,
    LucideLock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productImges } from '../../img/imagenProducto';

interface Producto {
    id: number;
    idUnico: string;
    nombre_producto: string;
    precioFinal: number
    img?: string;
    cantidad: number;
    tipoPrecio: string;
}

interface CarritoProps {
    items: Producto[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onConfirm: () => void;
    onUpdateQty: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
    isLoggedIn: boolean;
    onOpenAuth: () => void;
}

export const CarritoFlotante: React.FC<CarritoProps> = ({
    items,
    onUpdateQty,
    onRemove,
    isOpen,
    setIsOpen,
    onConfirm,
    isLoggedIn,
    onOpenAuth
    }) => {
    const total = items.reduce((acc, item) => {
    return acc + (
        Number(item.precioFinal || 0) *
        Number(item.cantidad || 1)
    );
}, 0);

    const handleConfirmarClick = () => {
        if (!isLoggedIn) {
        toast.error(
            "Debes iniciar sesión para realizar un pedido",
            {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff'
            }
            }
        );
        setIsOpen(false);
        onOpenAuth();
        return;
        }
        onConfirm();
    };

    return (<>
        {/* BOTÓN FLOTANTE */}
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 bg-castillo-naranja text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center border-4 border-white"
        >
            <LucideShoppingCart size={28} />
            {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-castillo-oscuro text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                {items.length}
            </span>
            )}
        </button>
        <AnimatePresence>
            {isOpen && (<>
                {/* FONDO */}
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-castillo-oscuro/40 backdrop-blur-sm z-60"/>
                {/* PANEL */}
                <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 200
                }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-70 shadow-2xl flex flex-col">
                {/* HEADER */}
                <div className="p-6 border-b flex items-center justify-between bg-castillo-oscuro text-white">
                    <div className="flex items-center gap-2">
                    <LucideShoppingCart
                        size={24}
                        className="text-castillo-limon"/>
                    <h2 className="font-black uppercase tracking-tight text-xl">
                        Tu Pedido
                    </h2>
                    </div>
                    <button
                    onClick={() => setIsOpen(false)}
                    className="hover:rotate-90 transition-transform">
                    <LucideX size={28} />
                    </button>
                </div>
                {/* LISTA */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 custom-scrollbar">
                    {items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LucideShoppingCart
                            size={32}
                            className="text-slate-200"
                        />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                        Carrito vacío
                        </p>
                    </div>
                    ) : (
                    items.map((item) => {
                        const precio = Number(item.precioFinal || 0);
                        const subtotal =
                        precio * Number(item.cantidad || 1);
                        return (
                        <div
                            key={item.idUnico}
                            className="flex gap-4 border-b border-slate-100 pb-4 last:border-0"
                        >
                            {/* IMAGEN */}
                            <img
                                src={(() => {
                                    const mapNombreToKey: Record<string, string> = {
                                        "Arroz Faisan": "ArrozFaisan",
                                        "Aceite": "aceite",
                                        "Avena en hojuela": "avena",
                                        "Spagueti": "espagueti",
                                        "Salsa inglesa": "salsa",
                                        "Jabon de lavar": "jabon",
                                        "Detergente": "detergente",
                                        "Aromatizante de ropa": "aromatizante",
                                        "Escoba": "escoba",
                                        "Papel aluminio": "aluminio",
                                        "Pasta dental": "dentrifico",
                                        "Jabon de baño": "palmolive",
                                        "Desodorante en barra": "rexona",
                                        "Toalla nocturna": "kotex",
                                        "Pañales": "panales",
                                        "Sopa": "sopa",
                                        "Leche": "leche",
                                        "Cremora": "cremora",
                                        "Maiz dulce": "maiz",
                                        "Atun Agua": "atun",
                                        "Jalapeños Max": "jalapeno",
                                        "Galletas": "galletas",
                                        "Caramelo": "caramelo",
                                        "Cafe": "cafe",
                                        "Refresco en polvo de naranja": "fresco",
                                        "Vasos N6": "vasos",
                                        "Cuchara": "cuchara",
                                        "Papel higienico": "papel",
                                        "Papel para cosina": "toalla",
                                        "Servilletas": "servilleta",
                                    };
                                    const nombre = item.nombre_producto || '';
                                    const clave = mapNombreToKey[nombre] || '';
                                    return clave ? productImges[clave] || '/placeholder.png' : '/placeholder.png';
                                })()}
                                className="w-16 h-16 object-cover rounded-xl shadow-sm bg-slate-100"
                                alt={item.nombre_producto}
                            />
                            {/* INFO */}
                            <div className="flex-1">
                            <h4 className="font-bold text-castillo-oscuro uppercase text-[12px] leading-tight mb-1">
                                {item.nombre_producto}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">

                                <p className="text-castillo-naranja font-black text-sm">
                                C$ {precio.toLocaleString()}
                                </p>

                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase">
                                {item.tipoPrecio}
                                </span>

                            </div>
                            {/* CONTROLES */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center bg-slate-100 rounded-lg p-1 scale-90 origin-left">
                                <button
                                onClick={() =>
                                    onUpdateQty(
                                    item.idUnico,
                                    Math.max(1, item.cantidad - 1)
                                    )
                                }
                                    disabled={item.cantidad <= 1}
                                    className="p-1 hover:bg-white rounded-md transition-colors text-slate-600 disabled:opacity-30"
                                >
                                    <LucideMinus size={14} />
                                </button>
                                <span className="px-3 font-bold text-xs">
                                    {item.cantidad}
                                </span>
                                <button
                                    onClick={() =>
                                    onUpdateQty(
                                        item.idUnico,
                                        item.cantidad + 1
                                    )
                                    }
                                    className="p-1 hover:bg-white rounded-md transition-colors text-slate-600"
                                >
                                    <LucidePlus size={14} />
                                </button>
                                </div>
                                {/* SUBTOTAL */}
                                <div className="flex items-center gap-3">
                                <span className="font-black text-castillo-oscuro text-sm">
                                    C$ {subtotal.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => onRemove(item.idUnico)}
                                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                >
                                    <LucideTrash2 size={18} />
                                </button>
                                </div>
                            </div>
                            </div>
                        </div>
                        );
                    })
                    )}
                </div>
                {/* FOOTER */}
                <div className="p-6 bg-slate-50 border-t">
                    <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-500 uppercase font-black text-[10px] tracking-widest">
                        Total a pagar
                    </span>
                    <span className="text-2xl font-black text-castillo-oscuro">
                        C$ {Number(total || 0).toLocaleString()}
                    </span>
                    </div>
                    <button
                    onClick={handleConfirmarClick}
                    disabled={items.length === 0}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50
                    ${
                        !isLoggedIn
                        ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-200'
                        : 'bg-castillo-naranja text-white hover:bg-castillo-oscuro shadow-castillo-naranja/20'
                    }`}>
                    {!isLoggedIn && (
                        <LucideLock
                        size={18}
                        className="text-castillo-limon"
                        />
                    )}
                    {isLoggedIn
                        ? 'Confirmar Pedido'
                        : 'Inicia Sesión para Comprar'}
                    <LucideArrowRight size={20} />
                    </button>
                </div>
                </motion.div>
            </>
            )}
        </AnimatePresence>
        </>
    );
};

export default CarritoFlotante;