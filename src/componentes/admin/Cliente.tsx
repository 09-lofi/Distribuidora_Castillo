import React, { useEffect, useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { toast } from "react-hot-toast";
import {
  LucideUsers,
  LucidePhone,
  LucideMapPin
} from "lucide-react";

interface Cliente {
  id_usuario: string;
  nombre_completo: string;
  telefono?: string | null;
  ubicacion?: string | null;
  segmento?: string | null;
}

const Clientes = () => {

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const obtenerClientes = async () => {

    try {

      const { data, error } = await supabase
        .from("clientes_info")
        .select(`
          id_usuario,
          nombre_completo,
          telefono,
          ubicacion,
          segmento
        `)
        .order("nombre_completo", {
          ascending: true
        });

      //console.log("CLIENTES:", data);
      //console.log("ERROR:", error);

      if (error) throw error;

      setClientes(data || []);

    } catch (error) {

      //console.error(error);

      toast.error(
        "Error cargando la base de clientes"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  if (loading) {

    return (
      <div className=" flex items-center justify-center h-[60vh] font-black text-[#06241b] animate-pulse">
        CARGANDO CARTERA DE CLIENTES...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <header className="
        flex
        justify-between
        items-end
      ">

        <div>

          <h2 className="
            text-4xl
            font-black
            text-[#06241b]
            tracking-tighter
            uppercase
            leading-none
          ">
            Clientes
          </h2>

          <p className="
            text-slate-500
            font-medium
            mt-2
          ">
            Directorio oficial de compradores
          </p>

        </div>

        <div className="
          bg-white
          px-6
          py-3
          rounded-2xl
          border
          border-slate-100
          shadow-sm
          flex
          items-center
          gap-3
        ">

          <div className="
            bg-blue-50
            p-2
            rounded-lg
          ">

            <LucideUsers
              size={20}
              className="text-blue-600"
            />

          </div>

          <div>

            <p className="
              text-[10px]
              font-black
              text-slate-400
              uppercase
              tracking-widest
            ">
              Total Clientes
            </p>

            <p className="
              text-2xl
              font-black
              text-[#06241b]
            ">
              {clientes.length}
            </p>

          </div>

        </div>

      </header>

      {/* TABLA */}

      <div className="
        bg-white
        rounded-[2.5rem]
        shadow-sm
        border
        border-slate-100
        overflow-hidden
      ">

        <div className="overflow-x-auto">

          <table className="
            w-full
            text-left
          ">

            <thead className="
              bg-slate-50
              text-[10px]
              uppercase
              font-black
              text-slate-400
            ">

              <tr>

                <th className="px-8 py-5">
                  Nombre Completo
                </th>

                <th className="px-8 py-5">
                  Contacto
                </th>

                <th className="px-8 py-5">
                  Ubicación
                </th>

                <th className="px-8 py-5">
                  Segmento
                </th>

              </tr>

            </thead>

            <tbody className="
              divide-y
              divide-slate-50
            ">

              {clientes.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="
                      p-10
                      text-center
                      text-slate-300
                      font-bold
                      uppercase
                      text-xs
                    "
                  >
                    No hay clientes registrados
                  </td>

                </tr>

              ) : (

                clientes.map((c) => (

                  <tr
                    key={c.id_usuario}
                    className="
                      text-sm
                      text-slate-600
                      hover:bg-slate-50/50
                      transition-colors
                      group
                    "
                  >

                    <td className="
                      px-8
                      py-6
                      font-black
                      text-[#06241b]
                      flex
                      items-center
                      gap-3
                    ">

                      <div className="
                        w-8
                        h-8
                        bg-slate-100
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-[10px]
                        font-black
                        text-slate-400
                        group-hover:bg-[#ff6b00]
                        group-hover:text-white
                        transition-colors
                      ">

                        {c.nombre_completo
                          ?.substring(0, 2)
                          .toUpperCase()}

                      </div>

                      {c.nombre_completo}

                    </td>

                    <td className="px-8 py-6">

                      <div className="
                        flex
                        items-center
                        gap-2
                        font-bold
                        text-slate-500
                      ">

                        <LucidePhone
                          size={14}
                          className="text-[#ff6b00]"
                        />

                        {c.telefono || "Sin teléfono"}

                      </div>

                    </td>

                    <td className="px-8 py-6">

                      <div className="
                        flex
                        items-center
                        gap-2
                        text-slate-400
                      ">

                        <LucideMapPin size={14} />

                        <span className="max-w-xs truncate">
                          {c.ubicacion || "No especificada"}
                        </span>

                      </div>

                    </td>

                    <td className="px-8 py-6">

                      <span className="
                        bg-slate-50
                        px-3
                        py-1
                        rounded-lg
                        font-black
                        text-[10px]
                        text-slate-400
                        uppercase
                      ">

                        {c.segmento || "Cliente"}

                      </span>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Clientes;