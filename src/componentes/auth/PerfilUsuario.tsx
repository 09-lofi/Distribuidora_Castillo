import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-hot-toast';
import { 
  LucideUser, LucidePhone, LucideMapPin, LucideSave, 
  LucideLoader2, LucideMail
} from 'lucide-react';

interface PerfilProps {
  user: any;
  onClose?: () => void;
  onUpdate?: () => void;
}

const PerfilUsuario = ({ user, onClose }: PerfilProps) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({nombre: '', telefono: '', ubicacion: '', email: ''});

  useEffect(() => {const cargarInformacionCompleta = async () => {
    try {
    setFetching(true);
    const userId = user?.id;
    if (!userId) return;
    const {
        data: usuarioData,
        error: errorUsuario
    } = await supabase
        .from('usuarios')
        .select('correo')
        .eq('id', userId)
        .single();
    if (errorUsuario) {
        console.error(errorUsuario);
    }
    const {
        data: clienteData,
        error: errorCliente
    } = await supabase
        .from('clientes_info')
        .select(`nombre_completo, telefono, ubicacion`)
        .eq('id_usuario', userId)
        .single();
    if (errorCliente) {
        console.error(errorCliente);
    }
    setForm({
        email: usuarioData?.correo || '',
        nombre: clienteData?.nombre_completo || '',
        telefono: clienteData?.telefono || '',
        ubicacion: clienteData?.ubicacion || ''
    });
    } catch (error: any) {
    console.error("ERROR CARGANDO PERFIL:", error);
    toast.error( "No se pudo cargar el perfil");
    } finally {
    setFetching(false);
    }
};
cargarInformacionCompleta();
  }, [user]);

  const guardarCambiosPerfil = async (
  e: React.FormEvent
  ) => {
  e.preventDefault();
  setLoading(true);
  try {
      const {error: errorCliente} = await supabase.from('clientes_info').upsert({id_usuario: user.id, nombre_completo: form.nombre, telefono: form.telefono, ubicacion: form.ubicacion
      }, {
          onConflict: 'id_usuario'
      });
      if (errorCliente) {throw errorCliente;}

      const {error: errorUsuario} = await supabase.from('usuarios').update({correo: form.email}).eq('id', user.id);
      if (errorUsuario) {
      throw errorUsuario;
      }
      if (form.email !== user.email) {
      const {error: authError} = await supabase.auth.updateUser({email: form.email});
      if (authError) {throw authError;
      }}
      toast.success("Perfil actualizado");
      if (onClose) {setTimeout(() => {onClose();
      }, 1200);
      }
  } catch (error: any) {console.error(error);
      toast.error(error.message || "Error actualizando perfil");
  } finally {setLoading(false);}};

    if (fetching) return (
        <div className="flex justify-center p-20">
            <LucideLoader2 className="animate-spin text-castillo-naranja" size={40} />
        </div>
    );

    return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-4xl p-8 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-castillo-naranja/10 text-castillo-naranja rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-castillo-naranja/5">
            <LucideUser size={40} />
          </div>
          <h2 className="font-black text-castillo-oscuro uppercase text-xl italic tracking-tighter">Mi Perfil</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Gestión de cuenta</p>
        </div>
        <form onSubmit={guardarCambiosPerfil} className="space-y-5">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-800 uppercase ml-2">
              <LucideMail size={12} className="text-castillo-naranja"/> Correo Electrónico
            </label>
            <input 
              type="email"
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white border-2 border-transparent focus:border-castillo-naranja/30 transition-all shadow-inner" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase ml-2">
              <LucideUser size={12}/> Nombre Completo
            </label>
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white border-2 border-transparent focus:border-castillo-naranja/30 transition-all shadow-inner" 
              value={form.nombre} 
              onChange={(e) => setForm({...form, nombre: e.target.value})} 
              placeholder="Escribe tu nombre..."/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase ml-2">
                <LucidePhone size={12}/> Teléfono
              </label>
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white border-2 border-transparent focus:border-castillo-naranja/30 transition-all shadow-inner" 
                value={form.telefono} 
                onChange={(e) => setForm({...form, telefono: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase ml-2">
                <LucideMapPin size={12}/> Ciudad
              </label>
              <input 
                className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white border-2 border-transparent focus:border-castillo-naranja/30 transition-all shadow-inner" 
                value={form.ubicacion} 
                onChange={(e) => setForm({...form, ubicacion: e.target.value})} />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-castillo-oscuro hover:bg-castillo-naranja text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 uppercase text-xs shadow-lg active:scale-95">
            {loading ? (
              <LucideLoader2 className="animate-spin" size={18} />
            ) : (<><LucideSave size={18} /> Guardar Cambios</>)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PerfilUsuario;