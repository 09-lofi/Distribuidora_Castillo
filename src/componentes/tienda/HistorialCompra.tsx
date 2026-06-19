import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { productImges } from '../../img/imagenProducto'
import { 
  LucideCalendar, LucidePackage, 
  LucideLoader2, LucideHeart, LucideTrash2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface HistorialProps {
  user: any;
}

const HistorialCompras = ({ user }: HistorialProps) => {
  const [tabActiva, setTabActiva] = useState<'facturas' | 'favoritos'>('facturas');
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      if (tabActiva === 'facturas') {
        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('id_cliente', user.id)
          .order('fecha_pedido', { ascending: false });
        
        if (error) throw error;
        if (data) setPedidos(data);
      } else {
        const { data, error } = await supabase
          .from('favoritos')
          .select(`
            id_producto, 
            productos (
              nombre_producto, 
              precio_unitario 
            )
          `) 
          .eq('id_usuario', user.id);
        if (error) throw error;
        if (data) {
          setFavoritos(data); 
        }
      }
    } catch (error: any) {
      console.log("Error detallado:", error.message); 
      console.log("Código de error:", error.code);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) cargarDatos();
  }, [user, tabActiva]);

  const eliminarFavorito = async (idProd: string) => {
    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('id_usuario', user.id)
      .eq('id_producto', idProd);
    if (!error) {
      setFavoritos(prev => prev.filter(f => f.id_producto !== idProd));
      toast.success("Eliminado de favoritos");
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 w-full max-w-4xl mx-auto min-h-100">
      {/* NAVEGACIÓN INTERNA (TABS) */}
      <div className="flex gap-6 mb-8 border-b border-slate-50">
        <button 
          onClick={() => setTabActiva('facturas')}
          className={`pb-4 text-xs font-black uppercase tracking-tighter transition-all ${
            tabActiva === 'facturas' 
            ? 'text-castillo-naranja border-b-2 border-castillo-naranja' 
            : 'text-slate-300'
          }`}
        >
          Mis Facturas
        </button>
        <button 
          onClick={() => setTabActiva('favoritos')}
          className={`pb-4 text-xs font-black uppercase tracking-tighter transition-all flex items-center gap-2 ${
            tabActiva === 'favoritos' 
            ? 'text-castillo-naranja border-b-2 border-castillo-naranja' 
            : 'text-slate-300'
          }`}>
          Favoritos <LucideHeart size={14} className={tabActiva === 'favoritos' ? 'fill-castillo-naranja text-castillo-naranja' : ''} />
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center p-20">
          <LucideLoader2 className="animate-spin text-castillo-naranja" size={40} />
        </div>
      ) : tabActiva === 'facturas' ? (
        <div className="overflow-x-auto">
          {pedidos.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-3xl">
              <LucidePackage size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 font-bold uppercase text-[10px]">Aún no hay pedidos</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase">
                  <th className="px-6 pb-2">Factura #</th>
                  <th className="px-6 pb-2">Fecha</th>
                  <th className="px-6 pb-2">Estado</th>
                  <th className="px-6 pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl group">
                    <td className="px-6 py-5 rounded-l-[20px] font-black text-castillo-oscuro text-sm">
                      #{pedido.numero_factura}
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <LucideCalendar size={14} />
                        {new Date(pedido.fecha_pedido).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        pedido.estado === 'entregado' ? 'bg-green-100 text-green-600' : 'bg-castillo-naranja/10 text-castillo-naranja'
                      }`}>
                        {pedido.estado}
                      </span>
                    </td>
                    <td className="px-6 py-5 rounded-r-[20px] font-black text-castillo-oscuro">
                      C$ {pedido.total_pedido?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoritos.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-slate-50 rounded-3xl">
              <LucideHeart size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="text-slate-500 font-bold uppercase text-[10px]">No tienes favoritos guardados</p>
            </div>
          ) : (
            favoritos.map((fav) => (
              <div key={fav.id_producto} className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-transparent hover:border-castillo-naranja/20 transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm">
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
                      const nombre = fav.productos?.nombre_producto || '';
                      const clave = mapNombreToKey[nombre] || '';
                      return clave ? productImges[clave] || '/placeholder.png' : '/placeholder.png';
                    })()}
                    className="w-full h-full object-contain"
                    alt={fav.productos?.nombre_producto || 'Producto'}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-castillo-oscuro uppercase leading-tight mb-1">
                    {fav.productos?.nombre_producto}
                  </p>
                  <p className="text-sm font-black text-castillo-naranja">
                    C$ {fav.productos?.precio_unitario}
                  </p>
                </div>
                <button 
                  onClick={() => eliminarFavorito(fav.id_producto)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <LucideTrash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HistorialCompras;