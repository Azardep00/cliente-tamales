import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_BASE_URL } from '../config/api.config';
import { DetallePedidoRequest } from '../models/pedido.model';
import { WompiCheckout, WompiPaymentStatus } from '../models/wompi.model';

@Injectable({ providedIn: 'root' })
export class WompiService {
  private readonly http = inject(HttpClient);

  iniciarCheckout(detalles: DetallePedidoRequest[]): Observable<WompiCheckout> {
    if (!environment.wompiPublicKey.startsWith('pub_')) {
      return throwError(() => new Error('Configura la llave pública de Wompi antes de iniciar el pago.'));
    }
    return this.http.post<WompiCheckout>(`${API_BASE_URL}/pagos/wompi/checkout`, { detalles });
  }

  reintentarPago(idPedido: number): Observable<WompiCheckout> {
    if (!environment.wompiPublicKey.startsWith('pub_')) {
      return throwError(() => new Error('Configura la llave pública de Wompi antes de iniciar el pago.'));
    }
    return this.http.post<WompiCheckout>(
      `${API_BASE_URL}/pagos/wompi/pedidos/${idPedido}/intentos`,
      {},
    );
  }

  consultarTransaccion(id: string, referencia: string): Observable<WompiPaymentStatus> {
    return this.http.get<WompiPaymentStatus>(
      `${API_BASE_URL}/pagos/wompi/transacciones/${encodeURIComponent(id)}`,
      { params: { referencia } },
    );
  }

  redirigirAlCheckout(checkout: WompiCheckout): void {
    this.validarLlavePublica();

    const retorno = new URL('/pago/resultado', window.location.origin);
    retorno.searchParams.set('referencia', checkout.referencia);
    retorno.searchParams.set('pedido', checkout.idPedido.toString());

    const campos: Record<string, string> = {
      'public-key': environment.wompiPublicKey,
      currency: checkout.moneda,
      'amount-in-cents': checkout.montoEnCentavos.toString(),
      reference: checkout.referencia,
      'signature:integrity': checkout.firmaIntegridad,
      'redirect-url': retorno.toString(),
    };

    const formulario = document.createElement('form');
    formulario.method = 'GET';
    formulario.action = environment.wompiCheckoutUrl;
    formulario.style.display = 'none';

    for (const [nombre, valor] of Object.entries(campos)) {
      const campo = document.createElement('input');
      campo.type = 'hidden';
      campo.name = nombre;
      campo.value = valor;
      formulario.appendChild(campo);
    }

    document.body.appendChild(formulario);
    formulario.submit();
  }

  private validarLlavePublica(): void {
    if (!environment.wompiPublicKey.startsWith('pub_')) {
      throw new Error('Configura la llave pública de Wompi antes de iniciar el pago.');
    }
  }
}
