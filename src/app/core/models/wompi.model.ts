export interface WompiCheckout {
  idPedido: number;
  referencia: string;
  montoEnCentavos: number;
  moneda: string;
  firmaIntegridad: string;
}

export interface WompiPaymentStatus {
  idPedido: number;
  referencia: string;
  estadoPago: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
  estadoPedido: string;
}
