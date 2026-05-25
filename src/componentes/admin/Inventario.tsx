import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { toast } from "react-hot-toast";

interface Producto {
  id: number;
  nombre_producto: string;
  categoria: string | null;
  marca: string | null;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: number;
}

const Inventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const obtenerProductos = async () => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select(`
          id,
          nombre_producto,
          categoria,
          marca,
          stock_actual,
          stock_minimo,
          precio_unitario
        `)
        .order("nombre_producto", { ascending: true });
      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      //console.error(error);
      toast.error("Error cargando inventario");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {obtenerProductos();}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-black text-[#06241b] animate-pulse">
        ACTUALIZANDO STOCK...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-[#06241b] tracking-tighter uppercase">Inventario</h2>
          <p className="text-slate-500 font-medium">Control de existencias y productos</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Productos</p>
          <p className="text-2xl font-black text-[#06241b]">{productos.length}</p>
        </div>
      </header>
      {/* TABLA ESTILO CASTILLO */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
              <tr>
                <th className="px-8 py-5">Producto</th>
                <th className="px-8 py-5">Categoría</th>
                <th className="px-8 py-5">Marca</th>
                <th className="px-8 py-5 text-center">Stock Actual</th>
                <th className="px-8 py-5">Precio Unitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {productos.map((p) => {
                const bajoStock = p.stock_actual <= p.stock_minimo;
                return (
                  <tr key={p.id} className="text-sm text-slate-600 hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 font-black text-[#06241b]">
                      {p.nombre_producto}
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-[11px] text-slate-500 uppercase">
                        {p.categoria || "General"}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium italic text-slate-400">
                      {p.marca || "-"}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col items-center">
                        <span
                          className={`
                            px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter
                            ${bajoStock 
                              ? "bg-red-100 text-red-600 animate-pulse" 
                              : "bg-green-100 text-green-700"}`}>
                          {p.stock_actual} en almacén
                        </span>
                        {bajoStock && (
                          <span className="text-[9px] text-red-400 font-bold mt-1 uppercase">Reabastecer pronto</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-[#06241b]">
                      C$ {Number(p.precio_unitario).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;