import { motion, AnimatePresence } from 'framer-motion';
import { LucideX, LucideCheckCircle, LucideReceipt, LucideUser, LucideCalendar } from 'lucide-react';

interface FacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrito: any[];
  total: number;
  fecha: string;
  userData: any;
  onConfirmar: () => Promise<void>;
}

export const FacturaModal = ({ 
  isOpen, 
  onClose, 
  carrito, 
  total, 
  fecha, 
  userData, 
  onConfirmar 
}: FacturaModalProps) => {

  // ★ GA EVENT: purchase
  const handleConfirmar = async () => {
    try {
      await onConfirmar();

      window.gtag?.('event', 'purchase', {
        transaction_id: `ORD-${Date.now()}`,
        value: Number(total),
        currency: 'NIO',
        items: carrito.map(item => ({
          item_id: item.id_producto,
          item_name: item.nombre_producto,
          price: Number(item.precioFinal || item.precio_unitario || 0),
          quantity: Number(item.cantidad || 1)
        }))
      });

    } catch (error) {
      console.error('Error al confirmar pedido:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-castillo-oscuro/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-lg rounded-[30px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* CABECERA */}
          <div className="bg-castillo-oscuro p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LucideReceipt className="text-castillo-naranja" size={28} />
              <div>
                <h3 className="font-black uppercase tracking-tighter text-xl">Resumen de Pedido</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Distribuidora Castillo</p>
              </div>
            </div>
            <button onClick={onClose} className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full">
              <LucideX size={20} />
            </button>
          </div>
          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex flex-col gap-3 mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <LucideUser size={16} className="text-castillo-naranja" />
                <span className="font-bold uppercase">{userData?.nombre || 'Cliente'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <LucideCalendar size={16} className="text-castillo-naranja" />
                <span>{fecha}</span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Detalle de productos</p>
              {carrito.map((item) => {
                const precio = Number(item.precioFinal || item.precio_unitario || 0);
                const subtotal = precio * Number(item.cantidad || 1);
                return (
                  <div
                    key={item.idUnico}
                    className="flex justify-between items-center border-b border-dashed border-slate-200 pb-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-castillo-oscuro uppercase line-clamp-1">
                        {item.nombre_producto}
                      </span>
                      <span className="text-[10px] text-slate-500 italic">
                        {item.cantidad} x C$ {' '}
                        {precio.toLocaleString()} {' '}
                        ({item.tipoPrecio || 'Unitario'})
                      </span>
                    </div>
                    <p className="text-xl font-black text-castillo-oscuro">
                      C$ {' '}
                      {subtotal.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t-4 border-double border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-castillo-oscuro uppercase">Total a Pagar</span>
                <span className="text-2xl font-black text-castillo-naranja">
                  C$ {Number(total || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mt-2 text-center uppercase font-bold italic">
                * Tu pedido entrará en estado "Procesando" hasta ser confirmado por el administrador.
              </p>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={handleConfirmar}
              className="group relative w-full bg-castillo-oscuro text-white py-5 rounded-2xl font-black uppercase tracking-widest overflow-hidden hover:bg-castillo-naranja transition-colors flex items-center justify-center gap-3 shadow-xl">
              <LucideCheckCircle size={22} className="group-hover:scale-110 transition-transform" />
              Confirmar mi Pedido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FacturaModal;