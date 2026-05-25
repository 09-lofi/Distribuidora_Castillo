import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { 
  LucideShieldCheck, 
  LucideHandshake, 
  LucideClock, 
  LucideBadgeCheck, 
  LucideEye, 
  LucideTarget,
  LucideCompass,
  LucideMapPin,
  LucideUser,
  LucideShoppingCart,
  LucideStore,
  LucideChevronRight
} from 'lucide-react';

// Estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';

export const Inicio = () => {
  // ARRAY CON PRODUCTOS REALES E IMÁGENES DINÁMICAS
  const destacados = [
    { nombre: "Arroz Faisan 80/20", img: "/Arroz.jpg" },
    { nombre: "Frijol Rojo Nacional", img: "/Frijoles.png" },
    { nombre: "Aceite Ideal Galón", img: "/aceite.jpg" },
    { nombre: "Azúcar Sulfitada", img: "/Azucar.png" },
    { nombre: "Café Presto 80 unidades", img: "/Cafe.png" },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50 font-montserrat overflow-x-hidden">
      
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
            onClick={() => window.location.href = '/catalogo'} 
            className="bg-castillo-naranja text-white px-10 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-castillo-naranja/20 transition-all flex items-center gap-3 mx-auto group"
          >
            Ver Catálogo 
            <LucideChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </motion.button>
        </motion.div>
      </section>

      {/* 2. MISIÓN Y VISIÓN */}
      <section className="py-24 px-6 bg-white shadow-inner relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-10 rounded-3xl border-l-8 border-castillo-oscuro shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-castillo-oscuro p-3 rounded-xl text-white"><LucideTarget size={32} /></div>
              <h2 className="text-3xl font-black text-castillo-oscuro uppercase tracking-tighter">Nuestra Misión</h2>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              Brindar productos básicos de buena calidad a precios accesibles, garantizando un servicio rápido y confiable.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-10 rounded-3xl border-l-8 border-castillo-limon shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-castillo-limon p-3 rounded-xl text-castillo-oscuro"><LucideCompass size={32} /></div>
              <h2 className="text-3xl font-black text-castillo-oscuro uppercase tracking-tighter">Nuestra Visión</h2>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              Ser una distribuidora reconocida por su responsabilidad, eficiencia y compromiso con el pueblo nicaragüense.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. VALORES */}
      <section className="py-24 px-6 max-w-400 mx-auto w-full">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-castillo-oscuro uppercase tracking-tight">
            Nuestros <span className="text-castillo-naranja">Valores</span>
          </h2>
          <div className="h-2 w-24 bg-castillo-limon mx-auto mt-6 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="group p-8 bg-white rounded-3xl border-b-8 border-castillo-oscuro shadow-lg hover:-translate-y-2 transition-all">
            <div className="bg-castillo-oscuro/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><LucideShieldCheck size={36} /></div>
            <h3 className="font-black text-xl mb-3 text-castillo-oscuro uppercase">Confianza</h3>
            <p className="text-slate-600 text-sm">Respaldo seguro y disponibilidad constante para nuestros clientes.</p>
          </div>
          <div className="group p-8 bg-white rounded-3xl border-b-8 border-castillo-naranja shadow-lg hover:-translate-y-2 transition-all">
            <div className="bg-castillo-naranja/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><LucideHandshake size={36} className="text-castillo-naranja" /></div>
            <h3 className="font-black text-xl mb-3 text-castillo-oscuro uppercase">Compromiso</h3>
            <p className="text-slate-600 text-sm">Precios honestos para cuidar la economía de tu hogar.</p>
          </div>
          <div className="group p-8 bg-white rounded-3xl border-b-8 border-slate-400 shadow-lg hover:-translate-y-2 transition-all">
            <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><LucideClock size={36} /></div>
            <h3 className="font-black text-xl mb-3 text-castillo-oscuro uppercase">Puntualidad</h3>
            <p className="text-slate-600 text-sm">Valoramos tu tiempo con entregas y retiros eficientes.</p>
          </div>
          <div className="group p-8 bg-white rounded-3xl border-b-8 border-castillo-limon shadow-lg hover:-translate-y-2 transition-all">
            <div className="bg-castillo-limon/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><LucideBadgeCheck size={36} /></div>
            <h3 className="font-black text-xl mb-3 text-castillo-oscuro uppercase">Calidad</h3>
            <p className="text-slate-600 text-sm">Solo productos de marcas líderes en perfecto estado.</p>
          </div>
          <div className="group p-8 bg-white rounded-3xl border-b-8 border-blue-900 shadow-lg hover:-translate-y-2 transition-all">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><LucideEye size={36} className="text-blue-900" /></div>
            <h3 className="font-black text-xl mb-3 text-castillo-oscuro uppercase">Transparencia</h3>
            <p className="text-slate-600 text-sm">Cero costos ocultos, siempre honestidad en cada venta.</p>
          </div>
        </div>
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