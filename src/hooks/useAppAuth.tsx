import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../api/supabaseClient';

export function useAppAuth() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [esRegistro, setEsRegistro] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    telefono: '',
    ubicacion: '',
    segmento: '',
    password: ''
  });

  const navigate = useNavigate();
  // REFRESH USER DATA
  const refreshUserData = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data: perfil } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (perfil?.rol === 'admin') {
      setUserData({
        id: user.id,
        email: user.email,
        rol: 'admin'
      });
      return;
    }
    const { data: dbData } = await supabase
      .from('clientes_info')
      .select('*')
      .eq('id_usuario', user.id)
      .maybeSingle();
    setUserData({
      id: user.id,
      email: user.email,
      rol: 'cliente',
      ...dbData
    });
  };

  // EFFECT
  useEffect(() => {
    const verificarSesion = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (!session) {
        setIsLoggedIn(false);
        setUserData(null);
        return;
      }
      setIsLoggedIn(true);
      await refreshUserData();
    };
    verificarSesion();

    // AUTH LISTENER
    const {
      data: authListener
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setIsLoggedIn(false);
          setUserData(null);
          return;
        }
        setIsLoggedIn(true);
        await refreshUserData();
      }
    );

    // SCROLL
    const handleScroll = () =>
      setIsScrolled(window.scrollY > 50);
    window.addEventListener(
      'scroll',
      handleScroll
    );
    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  // INPUT CHANGE
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  // AUTH
  const handleAuth = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    try {
      // REGISTRO
      if (esRegistro) {
        const telLimpio =
          formData.telefono.replace(/\D/g, '');
        if (telLimpio.length !== 8) {
          return toast.error(
            'El teléfono debe tener 8 números'
          );
        }
        const correoGenerado =
          `${telLimpio}@gmail.com`;
        const {
          data,
          error: authError
        } = await supabase.auth.signUp({
          email: correoGenerado,
          password: formData.password,
          options: {
            data: {
              nombre_completo: formData.nombre,
              telefono: telLimpio,
              ubicacion:
                formData.ubicacion || 'No especificada',
              segmento:
                formData.segmento || 'General'
            }
          }
        });
        if (authError) {
          throw authError;
        }
        if (!data.user) {
          toast.error(
            'No se pudo crear el usuario'
          );
          return;
        }
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: correoGenerado,
            password: formData.password
          });
        if (loginError) {
          throw loginError;
        }
        toast.success('¡Registrado con éxito!');
        setIsModalOpen(false);
        navigate('/catalogo');
        setFormData({
          email: '',
          nombre: '',
          telefono: '',
          ubicacion: '',
          segmento: '',
          password: ''
        });
        return;
      }
      // LOGIN
      const userIdentifier =
        formData.email.trim();
      const correoFinal =
        userIdentifier.includes('@')
          ? userIdentifier
          : `${userIdentifier.replace(/\s+/g, '')}@gmail.com`;
      const { error } =
        await supabase.auth.signInWithPassword({
          email: correoFinal,
          password: formData.password
        });
      if (error) {
        throw error;
      }
      toast.success(
        '¡Bienvenido!'
      );
      setIsModalOpen(false);
      navigate('/catalogo');
      setFormData({
        email: '',
        nombre: '',
        telefono: '',
        ubicacion: '',
        segmento: '',
        password: ''
      });
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || 'Error al entrar'
      );
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserData(null);
    toast.success(
      'Sesión cerrada'
    ); navigate('/');
  };
  return {isScrolled, isModalOpen, setIsModalOpen, isLoggedIn, esRegistro, setEsRegistro, userData, formData, handleInputChange, handleAuth, handleLogout, refreshUserData};
}