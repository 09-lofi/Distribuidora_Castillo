import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideShieldCheck, LucideMail, LucideLock} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // LOGIN
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: correo,
          password
        });
      if (error) throw error;
      // VALIDAR ROL ADMIN
      const { data: usuarioDB, error: rolError } =
        await supabase
          .from('usuarios')
          .select('rol')
          .eq('id', data.user.id)
          .single();
      if (rolError) throw rolError;
      // SI NO ES ADMIN → FUERA
      if (usuarioDB?.rol !== 'admin') {
        await supabase.auth.signOut();
        throw new Error(
          'No tienes permisos administrativos'
        );
      }
      toast.success(
        'Bienvenido al sistema'
      );
      navigate('/admin/dashboard');
    } catch (error: any) {
        console.error(error);
        toast.error(
          error.message ||
          'Error al iniciar sesión'
        );
      } finally {
        setLoading(false);
      }
    };
    return (
      <div className="min-h-screen bg-[#06241b] flex items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
        >
          {/* ENCABEZADO*/}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-[#06241b]/5 rounded-3xl mb-4 text-[#06241b]">
              <LucideShieldCheck size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#06241b]">
              Panel Administrativo
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              Distribuidora Castillo
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Correo Institucional</label>
              <div className="relative">
                <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="admin@correo.com"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#06241b] font-bold focus:border-[#06241b] transition-all outline-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-slate-400 ml-1">Contraseña</label>
              <div className="relative">
                <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[#06241b] font-bold focus:border-[#06241b] transition-all outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff6b00] hover:bg-[#06241b] text-white py-5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-orange-500/20 active:scale-95 disabled:opacity-50 mt-4">
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    );
};

export default AdminLogin;