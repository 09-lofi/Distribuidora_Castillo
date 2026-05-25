import { useState, useEffect, useMemo, useRef } from 'react';
import { LucideSearch } from 'lucide-react';
import { CarritoFlotante } from '../componentes/tienda/CarritoFlotante';
import CardProducto from '../componentes/tienda/CardProduct';
import FacturaModal from '../componentes/tienda/FacturaModal';
import { supabase } from '../api/supabaseClient';
import { toast } from 'react-hot-toast';
import { procesarNuevoPedido } from '../services/PedidoService'; 

interface Producto {
  id: number;
  nombre_producto: string;
  categoria: string;
  precio_unitario: number;
  precio_mayorista: number;
}

export const Catalogo = ({ isLoggedIn, userData, setIsModalOpen }: any) => {
  const isMounted = useRef(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSel, setCategoriaSel] = useState("Todos");
  const [carrito, setCarrito] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [verFactura, setVerFactura] = useState(false);



  const categorias = ["Todos", "Despensa", "Cuidado del Hogar y Limpieza", "Cuidado Personal y Salud", "Alimentos Preparados y Lacteos", "Snacks, Galletas y Bebidas", "Desechables y Papelería"];

  const totalFactura = useMemo(() => {
  return carrito.reduce((acc, item) => {
    const precio = Number(item.precioFinal || 0);
    const cantidad = Number(item.cantidad || 1);
    return acc + (precio * cantidad);
  }, 0);
}, [carrito]);

  const fechaFactura = useMemo(() => {
    return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
  }, [verFactura]);

useEffect(() => {
  let activo = true;

  const fetchProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from('productos')
        .select('*');

      if (error) throw error;

      if (activo) setProductos(data || []);

    } catch (err) {
      console.error("Error inesperado:", err);

    } finally {
      if (activo) setCargando(false);
    }
  };

  fetchProductos();

  return () => {
    //activo = false;
    isMounted.current = false;
  };
}, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      let coincideCat = categoriaSel === "Todos" || 
        (categoriaSel === "Despensa" ? ["Salsas", "Condimentos", "Despensa"].includes(p.categoria) : p.categoria === categoriaSel);
      const coincideBusq = (p.nombre_producto || "").toLowerCase().includes(busqueda.toLowerCase());
      return coincideCat && coincideBusq;
    });
  }, [productos, busqueda, categoriaSel]);

  const agregarAlCarrito = (
  prod: any,
  cant: number,
  tipo: 'Detalle' | 'Mayorista'
) => {

  const precioCorrecto =
    tipo === 'Mayorista'
      ? Number(prod.precio_mayorista || 0)
      : Number(prod.precio_unitario || 0);

  const idUnico = `${prod.id}-${tipo}`;

  setCarrito(prev => {

    const existe = prev.find(
      i => i.idUnico === idUnico
    );
    if (existe) {
      return prev.map(i =>
        i.idUnico === idUnico
          ? {
              ...i,
              cantidad: i.cantidad + cant
            }
          : i
      );
    }
    return [
      ...prev,
      {
        id: prod.id,
        idUnico,
        nombre_producto:
          prod.nombre_producto,
        cantidad: cant,
        precioFinal: precioCorrecto,
        tipoPrecio: tipo.toUpperCase(),
        img: '/placeholder.png'
      }
    ];
  });
  setIsCartOpen(true);
};



const handleConfirmarPedido = async () => {
  //console.log("DATOS DEL PRIMER PRODUCTO:", carrito[0]);
  try {
    
    if (!userData || !userData.id) {
      toast.error("Inicia sesión");
      return;
    }
    
    const carritoParaServicio = carrito.map(item => ({
      id: item.id,
      cantidad: Number(item.cantidad),
      precioFinal: Number(item.precioFinal),
      tipoPrecio: item.tipoPrecio
    }));
    console.log("ENVIANDO:", carritoParaServicio);
    await procesarNuevoPedido(
      carritoParaServicio,
      userData,
      totalFactura
    );
    toast.success("Pedido realizado");
    setCarrito([]);
    setVerFactura(false);
    setIsCartOpen(false);
  } catch (error: any) {
    //console.error(error);
    toast.error(
      error.message || "Error al guardar"
    );
  }
};

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-montserrat">
      <div className="max-w-400 mx-auto">
        
        {/* BUSCADOR */}
        <div className="max-w-xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-black text-castillo-oscuro uppercase mb-8">Nuestro <span className="text-castillo-naranja">Catálogo</span></h1>
          <div className="relative">
            <LucideSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input  className="w-full pl-14 pr-6 py-4 rounded-full shadow-lg outline-none focus:ring-2 focus:ring-castillo-naranja transition-all"
              placeholder="¿Qué buscas hoy?"
              onChange={(e) => setBusqueda(e.target.value)}/>
          </div>
        </div>

        {/* CATEGORÍAS */}
        <div className="overflow-x-auto no-scrollbar mb-12">
          <div className="flex gap-3 min-w-max px-4 justify-start md:justify-center">
            {categorias.map(cat => (
              <button 
                key={cat} onClick={() => setCategoriaSel(prev => prev === cat ? "Todos" : cat)}
                className={`px-8 py-3 rounded-full font-black uppercase text-[11px] border-2 flex-none transition-all ${
                  categoriaSel === cat ? 'bg-castillo-oscuro border-castillo-oscuro text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-castillo-naranja'
                }`}> {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
      {cargando ? (
        <div className="text-center py-20 font-black animate-pulse text-castillo-naranja">
          CARGANDO PRODUCTOS...
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          No se encontraron productos en la base de datos. <br/>
          <span className="text-sm italic">(Revisa si la tabla 'productos' tiene filas en Supabase)</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productosFiltrados.map(p => (
            <CardProducto 
              key={p.id} 
              producto={{...p, 
                nombre: p.nombre_producto, 
                precio: p.precio_unitario, 
                precioMayorista: p.precio_mayorista, 
                img: '/placeholder.png'
              }} 
              onAgregar={agregarAlCarrito} 
              userId={userData?.id}
            />
          ))}
        </div>
      )}
      </div>
      {/* CARRITO */}
      {userData?.rol !== 'admin' && (
      <CarritoFlotante 
        items={carrito} 
        isOpen={isCartOpen} 
        setIsOpen={setIsCartOpen} 
        onConfirm={() => setVerFactura(true)}
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => setIsModalOpen(true)}
        onUpdateQty={(id: any, q: number) => 
          setCarrito(prev => prev.map(i => i.idUnico === id ? {...i, cantidad: q} : i))
        }
        onRemove={(id: any) => 
          setCarrito(prev => prev.filter(i => i.idUnico !== id))
        }
      />
      )}

      {verFactura && (
        <FacturaModal 
          isOpen={verFactura} 
          onClose={() => setVerFactura(false)} 
          carrito={carrito} 
          total={totalFactura} 
          fecha={fechaFactura}
          userData={userData}
          onConfirmar={handleConfirmarPedido} 
        />
      )}
    </div>
  );
};

export default Catalogo;