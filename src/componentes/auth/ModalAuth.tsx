import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideX, LucideEye, LucideEyeOff, LucideMail, 
  LucideLock, LucideUser, LucideSmartphone, 
  LucideMapPin, LucideBuilding 
} from 'lucide-react';

interface ModalAuthProps {
  isOpen: boolean;
  onClose: () => void;
  esRegistro: boolean;
  setEsRegistro: (val: boolean) => void;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAuth: (e: React.FormEvent) => void;
}

const ModalAuth = ({ 
  isOpen, onClose, esRegistro, setEsRegistro, 
  formData, handleInputChange, handleAuth 
}: ModalAuthProps) => {
  
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-castillo-oscuro/80 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.9, y: 20, opacity: 0 }} 
            className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="bg-castillo-oscuro p-8 text-center text-white relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-castillo-limon"></div>
              <h3 className="font-black text-2xl uppercase tracking-tighter">
                {esRegistro ? "Crear Cuenta" : "¡Hola de nuevo!"}
              </h3>
              <p className="text-castillo-limon text-[10px] font-bold uppercase mt-2 tracking-widest">
                Distribuidora Castillo
              </p>
            </div>
            <form onSubmit={handleAuth} className="p-8 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {esRegistro && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="relative group">
                    <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" name="nombre" placeholder="Nombre Completo" required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-castillo-naranja text-sm"
                        value={formData.nombre} onChange={handleInputChange}
                      />
                  </div>
                  <div className="relative group">
                    <LucideSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" name="telefono" placeholder="Número de Teléfono" required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-castillo-naranja text-sm"
                      value={formData.telefono} onChange={handleInputChange}
                    />
                  </div>
                  <div className="relative group">
                    <LucideMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="ubicacion" required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-castillo-naranja text-sm appearance-none cursor-pointer"
                      value={formData.ubicacion} onChange={handleInputChange}
                    >
                      <option value="">Selecciona tu ubicación</option>
                      <option value="Managua">Managua</option>
                      <option value="Masaya">Masaya</option>
                      <option value="Granada">Granada</option>
                      <option value="Carazo">Carazo</option>
                      <option value="Otros">Otros Departamentos</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <LucideBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      name="segmento" required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-castillo-naranja text-sm appearance-none cursor-pointer"
                      value={formData.segmento} onChange={handleInputChange}
                    >
                      <option value="">Tipo de Cliente</option>
                      <option value="Emprendimiento">Emprendimiento</option>
                      <option value="Empresa">Empresa</option>
                      <option value="Familia">Familia</option>
                      <option value="Público en general">Público en general</option>
                    </select>
                  </div>
                </motion.div>
              )}
              {!esRegistro && (
                <div className="relative group">
                  <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" name="email" placeholder="Correo" required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-castillo-naranja text-sm transition-all"
                      value={formData.email} onChange={handleInputChange}
                    />
                </div>
              )}
              <div className="relative group">
                <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" required
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-castillo-naranja text-sm transition-all"
                  value={formData.password} onChange={handleInputChange}/>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-castillo-naranja transition-colors">
                  {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
                </button>
              </div>
              <button 
                type="submit" 
                className="w-full bg-castillo-oscuro text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-castillo-naranja transition-all shadow-xl active:scale-95 mt-4">
                {esRegistro ? "Registrar" : "Entrar Ahora"}
              </button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setEsRegistro(!esRegistro)}
                  className="text-[10px] font-black uppercase text-slate-400 hover:text-castillo-naranja transition-colors">
                  {esRegistro ? "¿Ya tienes cuenta? Inicia Sesión" : "¿No tienes cuenta? Regístrate aquí"}
                </button>
              </div>
            </form>
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
              <LucideX size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalAuth;