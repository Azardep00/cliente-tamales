export interface WompiCheckout {
  idPedido: string;
  referencia: string;
  montoEnCentavos: number;
  moneda: string;
  firmaIntegridad: string;
}

export interface WompiPaymentStatus {
  idPedido: string;
  referencia: string;
  estadoPago: 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
  estadoPedido: string;
}
