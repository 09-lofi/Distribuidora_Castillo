import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LucideLayoutDashboard,
  LucidePackage,
  LucideShoppingCart,
  LucideUsers,
  LucideBoxes,
  LucideLogOut,
  LucideTrendingUp,
  LucideChevronLeft,
  LucideChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import Pedidos from '../componentes/admin/Pedido';
import Inventario from '../componentes/admin/Inventario';
import ComprasStock from '../componentes/admin/ComprasStock';
import Clientes from '../componentes/admin/Cliente';

interface Pedido {
  id: number;
  total_pedido: number;
  estado: string;
  fecha_pedido: string;
  clientes_info: { nombre_completo: string } | null;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [vistaActiva, setVistaActiva] = useState<'dashboard' | 'pedidos' | 'inventario' | 'compras' | 'clientes'>('dashboard');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [stats, setStats] = useState({
    ventas: 0,
    clientes: 0,
    stockBajo: 0,
    hoy: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const obtenerDatos = async () => {
    try {
      const { data: pData, error: pError } = await supabase
        .from('pedidos')
        .select('*, clientes_info(nombre_completo)')
        .order('fecha_pedido', { ascending: false });

      if (pError) throw pError;

      const pedidosFormateados = pData?.map(p => ({
        ...p,
        clientes_info: Array.isArray(p.clientes_info) ? p.clientes_info[0] : p.clientes_info
      })) || [];

      setPedidos(pedidosFormateados.slice(0, 8));
      const hoyIso = new Date().toISOString().split('T')[0];
      const totalVentas = pedidosFormateados.reduce((acc, curr) => acc + (Number(curr.total_pedido) || 0), 0);
      const pedidosHoy = pedidosFormateados.filter(p => p.fecha_pedido?.startsWith(hoyIso)).length;
      
      const [resClientes, resProductos] = await Promise.all([
        supabase.from('clientes_info').select('*', { count: 'exact', head: true }),
        supabase.from('productos').select('stock_actual, stock_minimo')
      ]);
      
      setStats({
        ventas: totalVentas,
        hoy: pedidosHoy,
        clientes: resClientes.count || 0,
        stockBajo: resProductos.data?.filter(p => (p.stock_actual || 0) <= (p.stock_minimo || 0)).length || 0
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Error al sincronizar datos del servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { obtenerDatos(); }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const renderizarContenido = () => {
    switch (vistaActiva) {
      case 'dashboard':
        return (
          <div className="space-y-6 sm:space-y-8">
            <header>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#06241b] tracking-tighter uppercase leading-none">Resumen General</h2>
            </header>
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <StatCard title="Ventas Totales" value={`C$ ${stats.ventas.toLocaleString()}`} icon={<LucideTrendingUp size={20} />} color="bg-green-50 text-green-700" />
              <StatCard title="Pedidos Hoy" value={stats.hoy} icon={<LucideShoppingCart size={20} />} color="bg-orange-50 text-[#ff6b00]" />
              <StatCard title="Stock Crítico" value={stats.stockBajo} icon={<LucideBoxes size={20} />} color="bg-red-50 text-red-600" />
              <StatCard title="Clientes" value={stats.clientes} icon={<LucideUsers size={20} />} color="bg-blue-50 text-blue-700" />
            </div>

            {/* TABLA DE MOVIMIENTOS RECIENTES */}
            <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-black text-[#06241b] uppercase tracking-widest text-[10px] sm:text-xs">Movimientos Recientes</h3>
                <button 
                  onClick={() => setVistaActiva('pedidos')} 
                  className="bg-[#ff6b00]/10 text-[#ff6b00] px-4 sm:px-5 py-2 rounded-xl text-[9px] sm:text-[10px] font-black hover:bg-[#ff6b00] hover:text-white transition-all uppercase tracking-widest whitespace-nowrap">
                  Ver todos los pedidos
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[9px] sm:text-[10px] uppercase font-black text-slate-400">
                    <tr>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">Orden</th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">Cliente</th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">Monto</th>
                      <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pedidos.map(p => (
                      <tr key={p.id} className="text-xs sm:text-sm text-slate-600 hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 font-black text-[#06241b]">#{p.id}</td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 font-bold truncate max-w-30 sm:max-w-none">{p.clientes_info?.nombre_completo || 'Venta de Mostrador'}</td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 font-black text-[#06241b]">C$ {Number(p.total_pedido).toLocaleString()}</td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center">
                          <span className={`px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-tighter ${
                            p.estado === 'Entregado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#ff6b00]'
                          }`}>
                            {p.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'pedidos': return <Pedidos />;
      case 'inventario': return <Inventario />;
      case 'clientes': return <Clientes />;
      case 'compras': return <ComprasStock />;
      default: return <div className="p-10 text-center font-black opacity-20 text-4xl">PÁGINA NO ENCONTRADA</div>;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-black text-[#06241b] tracking-tighter text-xl uppercase">Cargando Sistema Castillo...</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`bg-[#06241b] text-white flex flex-col h-full shadow-2xl z-20 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* HEADER CON LOGO */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} p-6 mb-6`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img
                src="/logo-dis.jpeg"
                alt="Logo"
                className="h-10 w-10 rounded-full border-2 border-[#ff6b00]"
              />
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tighter uppercase leading-none">
                  Castillo
                </span>
                <span className="text-[#ff6b00] font-bold text-[8px] uppercase tracking-[0.2em]">
                  Distribuidora
                </span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white/40 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            {sidebarCollapsed ? <LucideChevronRight size={20} /> : <LucideChevronLeft size={20} />}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 space-y-3 px-4">
          <NavItem active={vistaActiva === 'dashboard'} onClick={() => setVistaActiva('dashboard')} icon={<LucideLayoutDashboard size={18}/>} label="Dashboard" collapsed={sidebarCollapsed} />
          <NavItem active={vistaActiva === 'pedidos'} onClick={() => setVistaActiva('pedidos')} icon={<LucideShoppingCart size={18}/>} label="Pedidos" collapsed={sidebarCollapsed} />
          <NavItem active={vistaActiva === 'inventario'} onClick={() => setVistaActiva('inventario')} icon={<LucidePackage size={18}/>} label="Inventario" collapsed={sidebarCollapsed} />
          <NavItem active={vistaActiva === 'compras'} onClick={() => setVistaActiva('compras')} icon={<LucideBoxes size={18}/>} label="Compras Stock" collapsed={sidebarCollapsed} />
          <NavItem active={vistaActiva === 'clientes'} onClick={() => setVistaActiva('clientes')} icon={<LucideUsers size={18}/>} label="Clientes" collapsed={sidebarCollapsed} />
        </nav>

        {/* CERRAR SESIÓN */}
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 text-white/30 hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] p-4 group ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <LucideLogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          {!sidebarCollapsed && 'Cerrar Sesión'}
        </button>
      </aside>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
        <div className="p-4 sm:p-6 lg:p-14 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={vistaActiva}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderizarContenido()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-4 sm:p-5 lg:p-7 rounded-2xl sm:rounded-4xl lg:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4 lg:gap-6 hover:translate-y-1 transition-all duration-300">
    <div className={`p-2.5 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl ${color} shadow-inner shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1 truncate">
        {title}
      </p>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-[#06241b] tracking-tighter truncate">
        {value}
      </h3>
    </div>
  </div>
);

const NavItem = ({ active, onClick, icon, label, collapsed }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${
      active 
        ? 'bg-[#ff6b00] text-white shadow-lg shadow-orange-900/40 scale-[1.05]' 
        : 'text-white/40 hover:bg-white/5 hover:text-white hover:translate-x-2'
    } ${collapsed ? 'justify-center px-2' : ''}`}
  >
    {icon}
    {!collapsed && label}
  </button>
);

export default AdminDashboard;