import { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { toast } from "react-hot-toast";
import { LucidePackagePlus} from "lucide-react";

// Tipado según tu tabla de Supabase
interface Compra {
  id: number;
  producto_id: number;
  nombre_proveedor: string;
  cantidad: number;
  precio_unitario: number;
  monto_total: number;
  estado: string;
  created_at: string;
  productos?: { nombre_producto: string };
}

const ComprasStock = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    producto_id: "",
    nombre_proveedor: "",
    cantidad: 0,
    precio_unitario: 0
  });

  //const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    //setLoading(true);
    const [prodRes, compRes] = await Promise.all([
      supabase.from("productos").select("id, nombre_producto"),
      supabase.from("compras_stock").select("*, productos(nombre_producto)").order("created_at", { ascending: false })
    ]);

    if (prodRes.data) setProductos(prodRes.data);
    if (compRes.data) setCompras(compRes.data as any);
    //setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const registrarCompra = async () => {
    const { producto_id, cantidad, precio_unitario, nombre_proveedor } = formData;
    
    if (!producto_id || cantidad <= 0 || !precio_unitario) {
      return toast.error("Completa todos los campos correctamente");
    }

    const montoTotal = Number(cantidad) * Number(precio_unitario);

const { error } = await supabase
  .from("compras_stock")
  .insert([
    {
      producto_id: Number(producto_id),
      nombre_proveedor,
      cantidad: Number(cantidad),
      precio_unitario: Number(precio_unitario),
      monto_total: montoTotal,
      estado: "pendiente"
    }
  ]);

    if (error) {
  console.error(error);
  return toast.error(error.message);
}
    
    toast.success("Compra registrada");
    setFormData({ producto_id: "", nombre_proveedor: "", cantidad: 0, precio_unitario: 0 });
    fetchData();
  };

  // UI simplificada y alineada al estilo Castillo
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <header>
        <h2 className="text-4xl font-black uppercase text-[#06241b]">Compras & Stock</h2>
      </header>

      {/* FORMULARIO */}
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            className="p-4 rounded-2xl bg-slate-50"
            value={formData.producto_id}
            onChange={(e) => setFormData({...formData, producto_id: e.target.value})}
          >
            <option value="">Selecciona producto</option>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre_producto}</option>)}
          </select>
          
          <input className="p-4 rounded-2xl bg-slate-50" placeholder="Proveedor" onChange={(e) => setFormData({...formData, nombre_proveedor: e.target.value})} />
          <input type="number" className="p-4 rounded-2xl bg-slate-50" placeholder="Cantidad" onChange={(e) => setFormData({...formData, cantidad: Number(e.target.value)})} />
          <input type="number" className="p-4 rounded-2xl bg-slate-50" placeholder="Precio Unitario" onChange={(e) => setFormData({...formData, precio_unitario: Number(e.target.value)})} />
        </div>
        
        <button onClick={registrarCompra} className="mt-6 bg-orange-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3">
          <LucidePackagePlus size={18} /> Registrar Compra
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-4xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-6">Producto</th>
              <th className="p-6">Proveedor</th>
              <th className="p-6">Cant.</th>
              <th className="p-6">Total</th>
              <th className="p-6">Estado</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((c) => (
              <tr key={c.id} className="border-t border-slate-50">
                <td className="p-6 font-semibold">{c.productos?.nombre_producto}</td>
                <td className="p-6">{c.nombre_proveedor}</td>
                <td className="p-6">{c.cantidad}</td>
                <td className="p-6">C$ {c.monto_total}</td>
                <td className="p-6 font-bold uppercase text-xs">{c.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComprasStock;