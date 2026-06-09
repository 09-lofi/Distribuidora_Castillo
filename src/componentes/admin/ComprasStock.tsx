import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
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
  aprobado_por?: string;
  fecha_aprobacion?: string;

  productos?: { nombre_producto: string };
  usuarios?: {
    id: string;
    admin_info?: {
      nombre_empleado: string;
    };
  };
}

const ComprasStock = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const [formData, setFormData] = useState({
    producto_id: "",
    numero_factura: "",
    nombre_proveedor: "",
    cantidad: 0,
    precio_unitario: 0
  });


  const fetchData = async () => {
  try {
    const [prodRes, compRes] = await Promise.all([
      supabase.from("productos").select("id, nombre_producto"),
      supabase
      .from("compras_stock")
      .select(`
        *,
        productos(nombre_producto),
        usuarios!aprobado_por(
          id,
          admin_info!id_usuario(nombre_empleado)
        )
      `)
      .order("created_at", { ascending: false })
    ]);

    if (prodRes.error) throw prodRes.error;
    if (compRes.error) throw compRes.error;

    setProductos(prodRes.data);
    setCompras(compRes.data as Compra[]);
  } catch (error) {
    console.error(error);
    toast.error("Error cargando datos");
  }
  };

  useEffect(() => { fetchData(); }, []);

  const generarNumeroFactura = () => {
    const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    const random = Math.floor(
      1000 + Math.random() * 9000
    );

    return `COMP-${año}${mes}${dia}-${random}`;
  };

  const [numeroFacturaPreview] = useState(
    generarNumeroFactura()
  );

  const registrarCompra = async () => {
  const {
    producto_id,
    cantidad,
    precio_unitario,
    nombre_proveedor
  } = formData;

  if (
    !producto_id ||
    !nombre_proveedor ||
    cantidad <= 0 ||
    precio_unitario <= 0
  ) {
    return toast.error(
      "Completa todos los campos correctamente"
    );
  }

  try {
    const numeroFactura = generarNumeroFactura();

    const { error } = await supabase
      .from("compras_stock")
      .insert([
        {
          producto_id: Number(producto_id),
          nombre_proveedor,
          numero_factura: numeroFactura,
          cantidad: Number(cantidad),
          precio_unitario: Number(precio_unitario),
          estado: "pendiente"
        }
      ])
      .select();

    if (error) throw error;

    toast.success(
      `Compra registrada (${numeroFactura})`
    );
    setMostrarModal(false);

    setFormData({
      producto_id: "",
      nombre_proveedor: "",
      numero_factura: "",
      cantidad: 0,
      precio_unitario: 0
    });

    await fetchData();

  } catch (error: any) {
    toast.error(
      error.message || "Error al registrar compra"
    );
  }
};

  const aprobarCompra = async (compra: Compra) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast.error("Sesión no válida");

      // 1. Actualizar compra
      const { error: compraError } = await supabase
        .from("compras_stock")
        .update({
          estado: "aprobada",
          aprobado_por: user.id,
          fecha_aprobacion: new Date().toISOString()
        })
        .eq("id", compra.id);
      if (compraError) throw compraError;

      // 2. Incrementar stock usando RPC
      const { error: rpcError } = await supabase.rpc("incrementarstock", {
        pproductoid: compra.producto_id,
        pcantidad: Number(compra.cantidad)
      });
      if (rpcError) throw rpcError;

      toast.success("Compra aprobada y stock actualizado");
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al aprobar compra");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      <header>
        <h2 className="text-4xl font-black uppercase text-[#06241b]">Compras & Stock</h2>
      </header>

      {/* FORMULARIO */}
      <div className="flex justify-end">
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3"
        >
          <LucidePackagePlus size={18} />
          Nueva Compra
        </button>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-4xl p-8 shadow-2xl">
            <h3 className="text-3xl font-black text-[#06241b] mb-6">
              Registrar Compra
            </h3>
            {/* FACTURA */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-500 mb-2">
                Número de Factura
              </label>
              <input type="text" value={numeroFacturaPreview} disabled
                className="w-full p-4 rounded-2xl bg-slate-100 text-slate-500 font-bold cursor-not-allowed"/>
            </div>
            {/* CAMPOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select className="p-4 rounded-2xl bg-slate-50" value={formData.producto_id}
                onChange={(e) => setFormData({...formData, producto_id: e.target.value})}>
                <option value="">
                  Selecciona producto
                </option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre_producto}
                  </option>
                ))}
              </select>
              <input type="text" placeholder="Proveedor" className="p-4 rounded-2xl bg-slate-50"
                value={formData.nombre_proveedor}
                onChange={(e) => setFormData({...formData, nombre_proveedor: e.target.value})}/>
              <input type="number" placeholder="Cantidad" className="p-4 rounded-2xl bg-slate-50"
                value={formData.cantidad || ""}
                onChange={(e) => setFormData({...formData, cantidad: Number(e.target.value)})}/>
              <input type="number" placeholder="Precio Unitario" className="p-4 rounded-2xl bg-slate-50"
                value={formData.precio_unitario || ""}
                onChange={(e) => setFormData({...formData, precio_unitario: Number(e.target.value)})}/>
            </div>
            {/* RESUMEN */}
            <div className="mt-6 bg-slate-50 rounded-2xl p-6">
              <p className="font-bold text-slate-500 uppercase text-xs">
                Monto Total
              </p>
              <p className="text-3xl font-black text-[#06241b]">
                C$
                {(Number(formData.cantidad || 0) * Number(formData.precio_unitario || 0)).toLocaleString()}
              </p>
            </div>
            {/* BOTONES */}
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setMostrarModal(false)} className=" px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 font-bold">
                Cancelar
              </button>
              <button onClick={registrarCompra} className=" px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black">
                Registrar Compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLA */} 
      <div className="bg-white rounded-4xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
            <tr>
              <th className="p-6">Producto</th>
              <th className="p-6">Proveedor</th>
              <th className="p-6">Factura</th>
              <th className="p-6">Cantidad</th>
              <th className="p-6">Total</th>
              <th className="p-6">Estado</th>
              <th className="p-6">Aprobó</th>
              <th className="p-6">Fecha</th>
              <th className="p-6">Acción</th>
            </tr>
          </thead>

          <tbody>
            {compras.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="p-6 font-semibold">{c.productos?.nombre_producto}</td>
                <td className="p-6">{c.nombre_proveedor}</td>
                <td className="p-6">{(c as any).numero_factura || "-"}</td>
                <td className="p-6">{c.cantidad}</td>
                <td className="p-6"> C$ {Number(c.monto_total).toLocaleString()}</td>
                <td className="p-6">
                  <span className="font-bold uppercase text-xs">{c.estado}</span>
                </td>
                <td className="p-6">{c.usuarios?.admin_info?.nombre_empleado || "-"}</td>
                <td className="p-6">
                  {c.fecha_aprobacion ? new Date(c.fecha_aprobacion).toLocaleDateString("es-NI") : "-"}
                </td>
                <td className="p-6">
                  {c.estado === "pendiente" ? (
                    <button
                      onClick={() => aprobarCompra(c)}
                      className=" bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold">
                      Aprobar
                    </button>
                  ) : (
                    <span className="text-green-600 font-bold">
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComprasStock;