import React, { useEffect, useState } from 'react';
import { LucideShoppingCart, LucideChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../api/supabaseClient';
import { toast } from 'react-hot-toast';

interface Pedido {
  id: number;
  total_pedido: number;
  estado: string;
  fecha_pedido: string;
  clientes_info: {
    nombre_completo: string;
  } | null;
}

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const obtenerPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`*, clientes_info!pedidos_id_cliente_fkey (nombre_completo)`)
        .order('fecha_pedido', { ascending: false });
      if (error) throw error;
      const formateados = data?.map(p => ({...p,
        clientes_info: Array.isArray(p.clientes_info) ? p.clientes_info[0] : p.clientes_info
      })) || [];
      setPedidos(formateados);
    } catch (error: any) {
      toast.error('Error al cargar la lista de pedidos');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (
  id: number,
  nuevoEstado: string
) => {

  try {

    console.log(id, nuevoEstado);

    const { error } = await supabase
      .from('pedidos')
      .update({
        estado: nuevoEstado
      })
      .eq('id', id);

    console.log(error);

    if (error) throw error;

    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, estado: nuevoEstado }
          : p
      )
    );

    toast.success(
      `Pedido #${id} actualizado`
    );

  } catch (error: any) {

    console.error(error);

    toast.error(
      error.message ||
      'Error al actualizar'
    );

  }

};

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return 'bg-orange-100 text-[#ff6b00]';
      case 'Procesando': return 'bg-blue-100 text-blue-700';
      case 'Entregado': return 'bg-green-100 text-green-700';
      case 'Cancelado': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };
  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-[#06241b]">
        <LucideShoppingCart size={42} className="animate-bounce mb-4" />
        <p className="font-black tracking-widest uppercase text-xs">Sincronizando Pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#06241b] tracking-tighter uppercase leading-none">Gestión de Pedidos</h2>
          <p className="text-slate-500 font-medium mt-2">Panel administrativo de ventas y entregas</p>
        </div>
        <div className="bg-[#ff6b00] px-6 py-3 rounded-2xl shadow-lg shadow-orange-200">
          <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Total Registrados</p>
          <p className="text-2xl font-black text-white">{pedidos.length}</p>
        </div>
      </header>
      {/* CONTENEDOR DE TABLA */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-8 py-6">Orden</th>
                <th className="px-8 py-6">Cliente</th>
                <th className="px-8 py-6">Monto Total</th>
                <th className="px-8 py-6">Fecha</th>
                <th className="px-8 py-6">Estado Actual</th>
                <th className="px-8 py-6 text-center">Gestionar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {pedidos.map((pedido) => (
                  <motion.tr
                    key={pedido.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-black text-[#06241b]">#{pedido.id}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-700 leading-none">
                        {pedido.clientes_info?.nombre_completo || 'Venta Directa'}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">Distribuidora Castillo</span>
                    </td>
                    <td className="px-8 py-5 font-black text-[#06241b] text-lg">
                      C$ {Number(pedido.total_pedido).toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">
                      {new Date(pedido.fecha_pedido).toLocaleDateString('es-NI', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`
                        px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${obtenerColorEstado(pedido.estado)}`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="relative flex items-center justify-center">
                        <select
                          value={pedido.estado}
                          onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                          className="appearance-none bg-slate-100 border-none rounded-xl px-4 py-2 pr-10 text-[11px] font-black uppercase text-slate-600 focus:ring-2 focus:ring-[#ff6b00] cursor-pointer">
                          <option value="Pendiente">Pendiente</option>
                          <option value="Procesando">Procesando</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                        <LucideChevronDown size={12} className="absolute right-3 pointer-events-none text-slate-400" />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;