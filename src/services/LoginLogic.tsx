import { supabase } from '../supabaseClient';


export const handleLogin = async (
  email: string,
  password: string
) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
  if (error) throw error;
  return data;
}; 


// REGISTRO
export const handleRegister = async (formData: any) => {

  const telLimpio = formData.telefono.replace(/\D/g, '');

  if (telLimpio.length !== 8) {
    throw new Error(
      "El teléfono debe tener 8 números"
    );
  }

  const nombreLimpio = formData.nombre
    .toLowerCase()
    .replace(/\s+/g, '');

  const correoFinal =
    formData.email?.trim() !== ''
      ? formData.email.trim()
      : `${nombreLimpio}@gmail.com`;

  const { data, error } =
    await supabase.auth.signUp({
      email: correoFinal,
      password: formData.password,
      options: {
        data: {
          nombre_completo: formData.nombre,
          email: formData.email,
          telefono: telLimpio,
          ubicacion: formData.ubicacion,
          segmento: formData.segmento
        }
      }
    });

  if (error) throw error;

  return data;
};

export const handleLogout = async () => {
  const { error } =
    await supabase.auth.signOut();
  if (error) throw error;
};