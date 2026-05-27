import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { LucideClock,LucideMapPin, LucideUser, LucideShoppingCart, LucideStore, LucideChevronRight} from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useState } from 'react';

export const Inicio = () => {
  const [showModal, setShowModal] = useState(false);

  // ARRAY CON PRODUCTOS REALES E IMÁGENES DINÁMICAS
  const destacados = [
    { nombre: "Arroz Faisan 80/20", img: "/Arroz.jpg" },
    { nombre: "Frijol Rojo Nacional", img: "/Frijoles.png" },
    { nombre: "Aceite Ideal Galón", img: "/aceite.jpg" },
    { nombre: "Atún de agua", img: "/atun.png" },
    { nombre: "Café Presto 40 unidades", img: "/presto.png" },
  ];

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleRedirect = () => {
    setShowModal(false);
    window.location.href = '/catalogo';
  };

  return (
    <div className="flex flex-col w-full bg-slate-50 font-montserrat overflow-x-hidden">
      
      {/* MODAL */}
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
            Distribuidora<br/><span className="text-castillo-limon">Castillo</span>
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

      {/* 4. CÓMO COMPRAR */}
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

      {/* 5. CARRUSEL DE PRODUCTOS (CORREGIDO Y COMPLETO) */}
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
                <div className="bg-white rounded-3xl overflow-hidden group border border-slate-100 shadow-sm h-full">
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

      {/* 6. UBICACIÓN Y MAPA */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-castillo-oscuro uppercase mb-6 leading-none">Nuestra <br/><span className="text-castillo-naranja text-5xl">Ubicación</span></h2>
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
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15601.76118338905!2d-86.2570!3d12.1475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f71560000000000%3A0x0!2zMTLCsDA4JzUxLjAiTiA4NsKwMTUnMjUuMiJX!5e0!3m2!1ses!2sni!4v1712900000000!5m2!1ses!2sni" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inicio;