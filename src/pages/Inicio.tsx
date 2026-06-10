import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { LucideClock, LucideMapPin, LucideUser, LucideShoppingCart, LucideStore, LucideChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";
import { useState } from 'react';
import ReactGA from 'react-ga4';

export const Inicio = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRifaModal, setShowRifaModal] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState("");
  const [pedidoEncontrado, setPedidoEncontrado] = useState<any>(null);
  const [participando, setParticipando] = useState(false);

  const destacados = [
    { nombre: "Arroz Faisan 80/20", img: "/ArrozFaisan.png" },
    { nombre: "Detergente", img: "/detergente.png" },
    { nombre: "Aceite Ideal Galón", img: "/aceite.jpg" },
    { nombre: "Atún de agua", img: "/atun.png" },
    { nombre: "Café Presto 40 unidades", img: "/presto.png" },
  ];

  const handleOpenModal = () => {
    // Trackea cuando abren el modal de "Ver Catálogo" desde el hero
    ReactGA.event({ category: 'CTA', action: 'clic_abrir_modal_catalogo' });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleRedirect = () => {
    // Trackea cuando confirman ir al catálogo desde el modal
    ReactGA.event({ category: 'CTA', action: 'clic_confirmar_ir_catalogo' });
    setShowModal(false);
    window.location.href = '/catalogo';
  };

  const buscarFactura = async () => {
    if (!numeroFactura) {
      return toast.error("Ingresa un número de factura");
    }

    // Trackea búsqueda de factura para la rifa
    ReactGA.event({ category: 'Rifa', action: 'clic_buscar_factura' });

    setPedidoEncontrado(null);
    setParticipando(false);

    const { data, error } = await supabase
      .from("pedidos")
      .select("id, numero_factura, total_pedido")
      .eq("numero_factura", numeroFactura)
      .single();

    if (error || !data) {
      toast.error("Factura no encontrada");
      // Trackea cuando no se encuentra la factura
      ReactGA.event({ category: 'Rifa', action: 'factura_no_encontrada' });
      return;
    }

    // Trackea cuando sí se encuentra la factura
    ReactGA.event({ category: 'Rifa', action: 'factura_encontrada' });
    setPedidoEncontrado(data);
  };

  const participarRifa = async () => {
    if (!pedidoEncontrado) return;

    if (Number(pedidoEncontrado.total_pedido) < 500) {
      // Trackea cuando la factura no cumple el monto mínimo
      ReactGA.event({ category: 'Rifa', action: 'factura_monto_insuficiente' });
      return toast.error("La compra debe ser mayor o igual a C$500");
    }

    // Trackea intento de confirmar participación
    ReactGA.event({ category: 'Rifa', action: 'clic_confirmar_participacion' });

    const { error } = await supabase
      .from("participantes_rifa")
      .insert({ pedido_id: pedidoEncontrado.id });

    if (error) {
      toast.error("Esta factura ya fue registrada anteriormente");
      ReactGA.event({ category: 'Rifa', action: 'participacion_duplicada' });
      return;
    }

    // Trackea participación exitosa
    ReactGA.event({ category: 'Rifa', action: 'participacion_exitosa' });
    setParticipando(true);
    toast.success("¡Registro exitoso!");
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 font-montserrat overflow-x-hidden">

      {/* MODAL VER CATÁLOGO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-10 max-w-lg mx-4 shadow-2xl border-b-8 border-castillo-naranja text-center"
          >
            <div className="w-16 h-16 bg-castillo-naranja/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LucideShoppingCart size={36} className="text-castillo-naranja" />
            </div>
            <h3 className="text-2xl font-black text-castillo-oscuro uppercase mb-4">
              ¡Bienvenido a nuestro catálogo!
            </h3>
            <p className="text-slate-600 font-medium mb-8 leading-relaxed">
              Si deseas realizar una compra, debes registrarte o iniciar sesión.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 rounded-full font-black uppercase tracking-wider text-sm border-2 border-slate-300 text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedirect}
                className="px-6 py-3 rounded-full font-black uppercase tracking-wider text-sm bg-castillo-naranja text-white hover:bg-orange-700 transition-all shadow-lg shadow-castillo-naranja/20"
              >
                Ver Catálogo
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL RIFA */}
      {showRifaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
          >
            <button onClick={() => setShowRifaModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-castillo-naranja">✕</button>
            <h3 className="text-3xl font-black text-castillo-oscuro uppercase mb-2">Promoción Rifa</h3>
            <p className="text-slate-500 mb-8 font-medium">Ingresa tu número de factura para participar.</p>

            <div className="space-y-6">
              <input
                type="text"
                placeholder="Ej: FAC-000001"
                value={numeroFactura}
                onChange={(e) => setNumeroFactura(e.target.value)}
                className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-castillo-naranja outline-none font-bold text-lg"
              />
              <button
                onClick={buscarFactura}
                className="w-full bg-castillo-oscuro text-white py-4 rounded-2xl font-black uppercase hover:bg-black transition-all"
              >
                Buscar mi factura
              </button>
            </div>

            {pedidoEncontrado && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 bg-orange-50 border-2 border-orange-100 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-black uppercase text-orange-600">Factura Encontrada</span>
                  <span className="text-xl font-black text-castillo-oscuro">C$ {pedidoEncontrado.total_pedido}</span>
                </div>
                {pedidoEncontrado.total_pedido < 500 ? (
                  <div className="text-center p-4 bg-red-100 text-red-700 font-bold rounded-xl border border-red-200">
                    Lamentamos informarte que tu factura no cumple con el monto mínimo de C$500 para participar.
                  </div>
                ) : (
                  <button
                    onClick={participarRifa}
                    disabled={participando}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase hover:bg-green-700 disabled:bg-slate-300 transition-all"
                  >
                    {participando ? "Procesando..." : "Confirmar Participación"}
                  </button>
                )}
              </motion.div>
            )}

            {participando && (
              <div className="mt-6 text-center text-green-800 font-bold p-6 bg-green-50 rounded-2xl border border-green-200">
                ¡Participación registrada! Mantente atento a nuestras redes sociales, ahí será anunciado el ganador.
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/granos.jpg" alt="Fondo" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
            Distribuidora<br /><span className="text-castillo-limon">Castillo</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 font-medium leading-relaxed italic border-l-4 border-castillo-naranja pl-4">
            "Cuidando tu mesa, protegiendo tu bolsillo"
          </p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05, backgroundColor: "#e65100" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
            className="bg-castillo-naranja text-white px-10 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-castillo-naranja/20 transition-all flex items-center gap-3 mx-auto group"
          >
            Ver Catálogo
            <LucideChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* BANNER PROMOCIONAL */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto bg-white rounded-4xl p-8 md:p-16 shadow-xl border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <img src="/marketing3.jpeg" alt="Día del Padre" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" />
            <div>
              <span className="text-castillo-naranja font-black uppercase tracking-widest text-sm">Promoción Especial</span>
              <h2 className="text-4xl md:text-5xl font-black text-castillo-oscuro uppercase mt-2 mb-6">Rifa Día del Padre</h2>
              <p className="text-slate-600 mb-8 text-lg">
                ¡Celebramos a papá! Todas tus compras mayores o iguales a <strong>C$500</strong> te hacen participar automáticamente en la rifa de una canasta básica completa.
              </p>
              {/* Trackea clic en botón principal de la rifa */}
              <button
                onClick={() => {
                  ReactGA.event({ category: 'Rifa', action: 'clic_abrir_modal_rifa' });
                  setShowRifaModal(true);
                }}
                className="bg-castillo-oscuro text-white px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-black transition-all"
              >
                ¡Participa ya!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* IDENTIDAD */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center uppercase mb-16">Nuestra <span className="text-castillo-naranja">Identidad</span></h2>
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-slate-50 p-10 rounded-3xl border-l-8 border-castillo-naranja">
              <h3 className="text-2xl font-black uppercase mb-4">Misión</h3>
              <p className="text-slate-600 leading-relaxed">Brindar productos básicos de buena calidad a precios accesibles, garantizando un servicio rápido y confiable para satisfacer las necesidades de nuestros clientes.</p>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border-l-8 border-castillo-limon">
              <h3 className="text-2xl font-black uppercase mb-4">Visión</h3>
              <p className="text-slate-600 leading-relaxed">Ser una distribuidora reconocida por sus productos básicos de calidad, destacando nuestra responsabilidad, eficiencia y compromiso con nuestros clientes.</p>
            </div>
          </div>
          <h3 className="text-2xl font-black uppercase text-center mb-12">Nuestros Valores</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {["Confianza", "Compromiso", "Puntualidad", "Calidad", "Transparencia"].map((val, i) => (
              <div key={i} className="text-center p-6 border border-slate-100 rounded-2xl hover:shadow-lg transition-all bg-slate-50">
                <h4 className="font-black text-castillo-oscuro">{val}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO COMPRAR */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-castillo-oscuro uppercase mb-16">¿Cómo <span className="text-castillo-naranja">Comprar?</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-300"><LucideUser size={32} /></div>
              <h3 className="font-black text-xl uppercase mb-3">1. Inicia Sesión</h3>
              <p className="text-slate-600 text-sm">Regístrate para ver precios exclusivos de distribuidor.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-300"><LucideShoppingCart size={32} /></div>
              <h3 className="font-black text-xl uppercase mb-3">2. Haz tu Pedido</h3>
              <p className="text-slate-600 text-sm">Selecciona tus productos y nosotros preparamos tu carga.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-castillo-naranja rounded-full flex items-center justify-center mb-6 shadow-lg shadow-castillo-naranja/20 text-white"><LucideStore size={32} /></div>
              <h3 className="font-black text-xl uppercase mb-3">3. Retira en Bodega</h3>
              <p className="text-slate-600 text-sm font-medium">Ven a nuestra sucursal y retira sin hacer filas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CARRUSEL DE PRODUCTOS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-castillo-oscuro uppercase mb-16">Productos <span className="text-castillo-naranja">Más Cotizados</span></h2>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
            className="pb-16"
          >
            {destacados.map((item, idx) => (
              <SwiperSlide key={idx}>
                {/* Trackea clic en cards de productos destacados */}
                <div
                  className="bg-white rounded-3xl overflow-hidden group border border-slate-100 shadow-sm h-full cursor-pointer"
                  onClick={() => ReactGA.event({
                    category: 'Catalogo',
                    action: 'clic_producto_destacado',
                    label: item.nombre
                  })}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.nombre} />
                    <div className="absolute top-4 right-4 bg-castillo-naranja text-white text-[10px] font-black px-3 py-1 rounded-full">DESTACADO</div>
                  </div>
                  <div className="p-6 border-t border-slate-50">
                    <h4 className="font-black text-castillo-oscuro uppercase tracking-tight text-sm">{item.nombre}</h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* UBICACIÓN Y MAPA */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-castillo-oscuro uppercase mb-6 leading-none">Nuestra <br /><span className="text-castillo-naranja text-5xl">Ubicación</span></h2>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border-l-8 border-castillo-oscuro flex items-center gap-4">
                <LucideClock className="text-castillo-naranja" size={24} />
                <div>
                  <h5 className="font-black uppercase text-xs">Horario de Atención</h5>
                  <p className="text-slate-600 font-medium">Lunes a Sábado: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border-l-8 border-castillo-limon flex items-center gap-4">
                <LucideMapPin className="text-castillo-naranja" size={24} />
                <div>
                  <h5 className="font-black uppercase text-xs">Dirección</h5>
                  <p className="text-slate-600 font-medium text-sm">Mercado Oriental, donde fue los repuestos burgo 2 al lago, ½ arriba</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl h-112.5 border-4 border-white bg-slate-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31204.255755397422!2d-86.29152406880075!3d12.144142576780755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sMercado%20Oriental%2C%20donde%20fue%20los%20repuestos%20burgo%202%20al%20lago%2C%20%C2%BD%20arriba!5e0!3m2!1ses-419!2sni!4v1781074090117!5m2!1ses-419!2sni" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;