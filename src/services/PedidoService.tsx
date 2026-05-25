import { supabase } from '../api/supabaseClient';

export const procesarNuevoPedido = async (
  carrito: any[],
  userData: any,
  total: number
) => {

  if (!carrito?.length) {
    throw new Error('Carrito vacío');
  }

  if (!userData?.id) {
    throw new Error('Usuario inválido');
  }

  try {

    const {
      data: pedido,
      error: errorPedido
    } = await supabase

      .from('pedidos')

      .insert([
        {
          id_cliente: userData.id,
          total_pedido: total,
          estado: 'Pendiente',
          numero_factura:
            `FAC-${Date.now()}`
        }
      ])

      .select()

      .single();

    if (errorPedido)
      throw errorPedido;

    const detalles = carrito.map(
      item => ({
        id_pedido: pedido.id,
        id_producto: item.id,
        cantidad: Number(item.cantidad),
        precio_aplicado:
          Number(item.precioFinal),
        tipo_precio_aplicado:
          item.tipoPrecio
      })
    );

    const {
      error: errorDetalles
    } = await supabase

      .from('detalle_pedidos')

      .insert(detalles);

    if (errorDetalles) {

      await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedido.id);

      throw errorDetalles;
    }

    return {
      success: true
    };

  } catch (error) {

    console.error(error);

    throw error;

  }

};