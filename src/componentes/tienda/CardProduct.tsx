import { useState, useEffect } from 'react';
import { LucideInfo, LucideShoppingCart, LucideHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import{productImges} from '../../img/imagenProducto';
//import { GalleryThumbnails } from "lucide-react";


interface CardProps {
  producto: any;
  onAgregar: (p: any, c: number, t: 'Detalle' | 'Mayorista') => void;
  userId?: string;
  esFavoritoInicial?: boolean;
}

const CardProducto = ({ producto, onAgregar, userId, esFavoritoInicial = false }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [tipoPrecio, setTipoPrecio] = useState<'Detalle' | 'Mayorista'>('Detalle');
  const [esFavorito, setEsFavorito] = useState(esFavoritoInicial);
  const [cargandoLike, setCargandoLike] = useState(false);

  // PRECIOS SEGURO
  const precioDetalle = Number(producto?.precio || 0);
  const precioMayorista = Number(producto?.precioMayorista || precioDetalle);
  const precioActual = tipoPrecio === 'Detalle' ? precioDetalle : precioMayorista;

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



const claveMapeada = mapNombreToKey[producto.nombre || ''] || '';
const imagenSrc = claveMapeada ? productImges[claveMapeada] || '/placeholder.png' : '/placeholder.png';

  // CARGAR FAVORITOS CUANDO HAY USER ID
  useEffect(() => {
    const cargarFavorito = async () => {
      if (!userId) {
        setEsFavorito(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favoritos')
          .select('*')
          .eq('id_usuario', userId)
          .eq('id_producto', producto.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error cargando favorito:', error);
          return;
        }

        setEsFavorito(!!data);
      } catch (error) {
        console.error('Error en carga de favorito:', error);
      }
    };

    cargarFavorito();
  }, [userId, producto.id]);

  // FAVORITOS 
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Inicia sesión para usar favoritos");
      return;
    }

    setCargandoLike(true);
    try {
      if (esFavorito) {
        // Eliminar de favoritos
        const { error } = await supabase
          .from('favoritos')
          .delete()
          .eq('id_usuario', userId)
          .eq('id_producto', producto.id);
        
        if (error) throw error;
        setEsFavorito(false);
        toast.success("Eliminado de favoritos");
      } else {
        // Agregar a favoritos
        const { error } = await supabase
          .from('favoritos')
          .insert({
            id_usuario: userId,
            id_producto: producto.id
          });
        
        if (error) throw error;
        setEsFavorito(true);
        toast.success("Agregado a favoritos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error en favoritos");
    } finally {
      setCargandoLike(false);
    }
  };

  // MANEJO SEGURO DE CANTIDAD
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números positivos
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setCantidad(value === '' ? 1 : parseInt(value));
    }
  };

  const handleCantidadBlur = () => {
    if (cantidad < 1) {
      setCantidad(1);
    }
  };

  // COMPONENTE
  return (
    <div className="perspective-1000 h-120 w-full group">
      <motion.div 
          animate={{rotateY: isFlipped ? 180 : 0}}
          transition={{duration: 0.6}}
          style={{transformStyle: 'preserve-3d'}}
          className="relative w-full h-full"
      >
        {/* CARA FRONTAL */}
        <div  className="absolute inset-0 bg-white rounded-[40px] p-6 shadow-xl border border-slate-100 flex flex-col backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}>
          {/* IMAGEN */}
          <div className="relative h-48 mb-4 rounded-3xl overflow-hidden bg-slate-50 flex items-center justify-center">
            <img
              src={imagenSrc} alt={producto.nombre}
              className="w-40 h-40 object-contain group-hover:scale-110 transition-transform duration-500"
            />
            {/* BOTONES SUPERIORES */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={handleLike}
                disabled={cargandoLike}
                className={`p-2 rounded-full shadow-md transition-all ${
                  esFavorito ? 'bg-red-500 text-white' : 'bg-white text-slate-400'
                }`}
              >
                <LucideHeart size={16} fill={esFavorito ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className="bg-white text-castillo-oscuro p-2 rounded-full shadow-md"
              >
                <LucideInfo size={16} />
              </button>
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h3 className="font-black text-castillo-oscuro uppercase text-sm leading-tight mb-2">
              {producto?.nombre || 'Producto'}
            </h3>
            
            {/* TIPOS DE PRECIO */}
            <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setTipoPrecio('Detalle')}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-colors ${
                  tipoPrecio === 'Detalle' 
                    ? 'bg-white shadow-sm text-castillo-oscuro' 
                    : 'text-slate-400 hover:text-castillo-oscuro'
                }`}
              >
                Detalle
              </button>
              <button
                onClick={() => setTipoPrecio('Mayorista')}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-colors ${
                  tipoPrecio === 'Mayorista' 
                    ? 'bg-castillo-naranja text-white' 
                    : 'text-slate-400 hover:text-castillo-oscuro'
                }`}
              >
                Mayorista
              </button>
            </div>

            {/* PRECIO */}
            <div className="text-center mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Precio
              </p>
              <p className="text-xl font-black text-castillo-uro">
                C$ {Number(precioActual).toLocaleString()}
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-end gap-2 mt-auto">
            {/* CANTIDAD */}
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Cantidad
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1"
                  value={cantidad}
                  onChange={handleCantidadChange}
                  onBlur={handleCantidadBlur}
                  className="w-full bg-slate-100 rounded-2xl py-3 px-4 text-center font-black text-sm outline-none focus:ring-2 focus:ring-castillo-naranja"
                  style={{ height: '52px' }}
                />
              </div>
            </div>

            {/* CARRITO */}
            <button 
              onClick={() => onAgregar(producto, cantidad, tipoPrecio)}
              className="bg-castillo-oscuro text-white rounded-2xl hover:bg-castillo-naranja transition-colors flex items-center justify-center"
              style={{ 
                height: '52px', 
                width: '52px',
                minWidth: '52px'
              }}
            >
              <LucideShoppingCart size={20} />
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-white rounded-[40px] p-6 shadow-xl border border-slate-100 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
          <h2 className="text-xl font-black text-castillo-oscuro mb-4">
            {producto.nombre}
          </h2>
              {/* PRECIO */}
            <div className="text-center mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Precio
              </p>

              <p className="text-xl font-black text-castillo-oscuro">
                C$ {Number(precioActual).toLocaleString()}
              </p>

              {/* STOCK */}
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    producto.stock_actual > 10
                      ? 'bg-green-100 text-green-700'
                      : producto.stock_actual > 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {producto.stock_actual > 0
                    ? `Stock: ${producto.stock_actual}`
                    : 'Agotado'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsFlipped(false)}
              className="mt-6 bg-castillo-naranja text-white px-6 py-3 rounded-2xl font-black text-xs uppercase">
              Volver
            </button>
          </div>
      </motion.div>
    </div>
  );
};

export default CardProducto;