export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO';
export type EstadoPagoWompi = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface DetallePedido {
  idProducto: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pedido {
  idPedido: string;
  idCliente: string;
  correoCliente: string;
  estado: EstadoPedido;
  fecha: string;
  detalles: DetallePedido[];
  total: number;
  estadoPagoWompi?: EstadoPagoWompi;
}

export interface DetallePedidoRequest {
  idProducto: string;
  cantidad: number;
}

export interface PedidoRequest {
  idCliente?: string; // solo lo usan empleados; con token de cliente el backend lo ignora
  detalles: DetallePedidoRequest[];
}