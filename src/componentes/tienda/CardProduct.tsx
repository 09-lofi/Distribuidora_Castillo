import React, { useState } from 'react';
import {LucideInfo, LucideMinus, LucidePlus, LucideShoppingCart, LucideHeart} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../api/supabaseClient';
import { toast } from 'react-hot-toast';

interface CardProps {
  producto: any;
  onAgregar: (p: any, c: number, t: 'Detalle' | 'Mayorista') => void;
  userId?: string;
  esFavoritoInicial?: boolean;
}

const CardProducto = ({producto, onAgregar, userId, esFavoritoInicial = false
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [tipoPrecio, setTipoPrecio] = useState<'Detalle' | 'Mayorista'>('Detalle');
  const [esFavorito, setEsFavorito] = useState(esFavoritoInicial);
  const [cargandoLike, setCargandoLike] = useState(false);

  // PRECIOS SEGURO
  const precioDetalle = Number(producto?.precio || 0);
  const precioMayorista = Number(
      producto?.precioMayorista ||
      precioDetalle);
  const precioActual =
  tipoPrecio === 'Detalle'
    ? precioDetalle
    : precioMayorista;

  // FAVORITOS
  const handleLike = async (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!userId) {
      toast.error(
        "Inicia sesión para favoritos"
      );
      return;
    }
    setCargandoLike(true);
    try {
      if (esFavorito) {
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('id_usuario', userId)
          .eq('id_producto', producto.id);
        if (error) throw error;
        setEsFavorito(false);
      } else {
        const { error } = await supabase
          .from('favoritos')
          .insert({
            id_usuario: userId,
            id_producto: producto.id
          });
        if (error) throw error;
        setEsFavorito(true);
        toast.success(
          "Agregado a favoritos"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Error en favoritos"
      );
    } finally {
      setCargandoLike(false);
    }
  };

  // COMPONENTE
  return (
    <div
      className=" perspective-1000 h-120 w-full group">
      <motion.div animate={{
          rotateY: isFlipped ? 180 : 0}}
        transition={{duration: 0.6}}
        style={{transformStyle: 'preserve-3d'}}
        className="relative w-full h-full">
        <div className="absolute inset-0 bg-white rounded-[40px] p-6 shadow-xl border border-slate-100 flex flex-col">
          {/* IMAGE */}
          <div className="relative h-48 mb-4 rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center">
            <img
              src={producto.img || '/placeholder.png'}
              alt={producto.nombre}
              className="w-40 h-40 object-contain group-hover:scale-110 transition-transform duration-500"/>
            {/* BOTONES */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleLike}
                disabled={cargandoLike}
                className={` p-2 rounded-full shadow-md transition-all
                  ${esFavorito ? 'bg-red-500 text-white' : 'bg-white text-slate-400'}`}>
                <LucideHeart size={16} fill={esFavorito ? 'currentColor' : 'none'}/>
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className=" bg-white text-castillo-oscuro p-2 rounded-full shadow-md">
                <LucideInfo size={16} />
              </button>
            </div>
          </div>
          {/* INFO */}
          <div className="flex-1">
            <h3 className=" font-black text-castillo-oscuro uppercase text-sm leading-tight mb-2">
              {producto?.nombre || 'Producto'}
            </h3>
            {/* TIPOS */}
            <div className=" flex gap-2 mb-4 p-1 bg-slate-100 rounded-2xl">
              <button onClick={() => setTipoPrecio('Detalle')}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl
                  ${tipoPrecio === 'Detalle' ? 'bg-white shadow-sm' : 'text-slate-400'}`}>
                Detalle
              </button>
              <button
                onClick={() => setTipoPrecio('Mayorista')}
                className={` flex-1 py-2 text-[10px] font-black uppercase rounded-xl
                  ${tipoPrecio === 'Mayorista' ? 'bg-castillo-naranja text-white' : 'text-slate-400'}`}>
                Mayorista
              </button>
            </div>
            {/* PRECIO */}
            <div className="text-center mb-4">
              <p className=" text-[10px] font-bold text-slate-400 uppercase">
                Precio
              </p>
              <p className="text-xl font-black text-castillo-oscuro">
                C$ {Number(precioActual).toLocaleString()}
              </p>
            </div>
          </div>
          {/* FOOTER */}
          <div className=" flex items-center gap-2 mt-auto">
            {/* CANTIDAD */}
            <div className=" flex-1 flex items-center bg-slate-100 rounded-2xl p-1">
              <button
                onClick={() =>
                  setCantidad(
                    Math.max(1, cantidad - 1))}className=" w-8 h-8 flex items-center justify-center">
                <LucideMinus size={16} />
              </button>
              <input type="number" value={cantidad} readOnly className=" w-full bg-transparent text-center font-black text-xs outline-none"/>
              <button onClick={() => setCantidad(cantidad + 1)}className=" w-8 h-8 flex items-center justify-center">
                <LucidePlus size={16} />
              </button>
            </div>
            {/* CARRITO */}
            <button onClick={() => onAgregar( producto, cantidad, tipoPrecio)}
              className=" bg-castillo-oscuro text-white p-4 rounded-2xl">
              <LucideShoppingCart size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CardProducto;