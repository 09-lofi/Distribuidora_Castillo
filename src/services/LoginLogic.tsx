import { supabase } from '../supabaseClient';

export const handleLogin = async (identificador: string, password: any) => {
  const input = identificador.trim();
  let correoParaAuth = input;
  if (/^\d{8}$/.test(input)) {
    correoParaAuth = `${input}@cliente.local`;
  } 
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correoParaAuth,
    password: password
  });
  if (error) throw error;
  return data;
};

export const handleRegister = async (formData: any) => {
  const telLimpio = formData.telefono.replace(/\D/g, '');
  const nomLimpio = formData.telefono.replace(/\D/g, '');
  if (telLimpio.length !== 8) throw new Error("El teléfono debe tener 8 números");
  
  const { data, error } = await supabase.auth.signUp({
    email: `${nomLimpio}@gmail.com`,
    password: formData.password,
    options: { 
      data: { 
        nombre_completo: formData.nombre, 
        telefono: telLimpio,
        ubicacion: formData.ubicacion,
        segmento: formData.segmento
      } 
    }
  });
  if (error) throw error;
  if (data.user) {
    await supabase.from('clientes_info').insert([
      { 
        id_usuario: data.user.id, 
        nombre_completo: formData.nombre, 
        telefono: telLimpio,
        ubicacion: formData.ubicacion,
        segmento: formData.segmento
      }
    ]);
  }
  return data;
};