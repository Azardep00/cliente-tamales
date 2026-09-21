import { Producto } from './producto.model';

export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO';

export interface DetallePedido {
  idDetallePedido: number;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  idPedido: number;
  estado: EstadoPedido;
  fecha: string;
  detalles: DetallePedido[];
  total: number;
}

export interface DetallePedidoRequest {
  idProducto: number;
  cantidad: number;
}

export interface PedidoRequest {
  idCliente: number;
  detalles: DetallePedidoRequest[];
}