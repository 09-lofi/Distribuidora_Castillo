import { LucidePhone, LucideMail } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import ReactGA from "react-ga4";


//const registrarClickRedSocial = (red: string) => {
  //ReactGA.event(`click_${red.toLowerCase()}`);
//};



const registrarClickRedSocial = (red: string) => {
  (window as any).dataLayer = (window as any).dataLayer || [];

  (window as any).dataLayer.push({
    event: "social_click",
    social_network: red,
  });
};

const Footer = () => {
  return (
    <footer className="bg-castillo-oscuro text-white pt-20 pb-10 px-6 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img 
              src="/logo-dis.jpeg" 
              alt="Logo Distribuidora Castillo" 
              className="h-14 w-14 rounded-full border-2 border-castillo-limon object-cover" 
            />
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase leading-none">Castillo</span>
              <span className="text-castillo-limon font-bold text-xs uppercase tracking-[0.2em]">Distribuidora</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm italic max-w-xs leading-relaxed">
            "Abasteciendo con los mejores granos básicos y productos para el hogar."
          </p>
          <div className="flex gap-4 pt-2">
            <a href="https://www.facebook.com/profile.php?id=61589945819523" target="_blank" rel="noopener noreferrer" onClick={() => registrarClickRedSocial("Facebook")} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-castillo-naranja hover:text-white transition-all text-slate-300">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="https://www.instagram.com/distribuidora_castillo00/" target="_blank" rel="noopener noreferrer" onClick={() => registrarClickRedSocial("Instagram")} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-castillo-naranja hover:text-white transition-all text-slate-300">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://wa.me/50588335660" target="_blank" rel="noopener noreferrer" onClick={() => registrarClickRedSocial("WhatsApp")} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-castillo-naranja hover:text-white transition-all text-slate-300">
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-black uppercase text-sm tracking-widest text-castillo-limon">Contacto</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-castillo-naranja/10 rounded-xl flex items-center justify-center text-castillo-naranja transition-colors group-hover:bg-castillo-naranja group-hover:text-white">
                <LucidePhone size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Llámanos</p>
                <p className="font-bold text-sm tracking-tight">+505 8833 5660</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-castillo-naranja/10 rounded-xl flex items-center justify-center text-castillo-naranja transition-colors group-hover:bg-castillo-naranja group-hover:text-white">
                <LucideMail size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Correo</p>
                <p className="font-bold text-[11px] break-all">distribuidoracastillo005@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="font-black uppercase text-sm tracking-widest text-castillo-limon">Atención</h4>
          <div className="bg-white/5 p-6 rounded-[30px] border border-white/10 text-xs">
            <div className="flex justify-between mb-4">
              <span className="text-slate-400 font-bold">Lun - Vie</span>
              <span className="font-black">9:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-slate-400 font-bold">Sáb</span>
              <span className="font-black">9:00 AM - 3:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Domingos</span>
              <span className="text-castillo-naranja font-black underline uppercase">Cerrado</span>
            </div>
          </div>
        </div>
      </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                © {new Date().getFullYear()} Distribuidora Castillo. Todos los derechos reservados.
        </p>
        </div>
    </footer>
    );
};

export default Footer;