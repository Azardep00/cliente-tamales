import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { WompiService } from '../../core/services/wompi.service';
import { WompiCheckout, WompiPaymentStatus } from '../../core/models/wompi.model';

@Component({
  selector: 'app-pago-resultado',
  imports: [RouterLink],
  templateUrl: './pago-resultado.html',
  styleUrl: './pago-resultado.css',
})
export class PagoResultado {
  private readonly route = inject(ActivatedRoute);
  private readonly wompi = inject(WompiService);
  private readonly carrito = inject(CarritoService);

  protected readonly estado = signal<WompiPaymentStatus | null>(null);
  protected readonly consultando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly preparandoReintento = signal(false);

  private readonly idTransaccion = this.route.snapshot.queryParamMap.get('id');
  private readonly referencia = this.route.snapshot.queryParamMap.get('referencia');
  private readonly idPedido = Number(this.route.snapshot.queryParamMap.get('pedido'));

  protected readonly tieneDatosTransaccion = Boolean(this.idTransaccion && this.referencia);

  constructor() {
    if (!this.idTransaccion || !this.referencia || !Number.isInteger(this.idPedido) || this.idPedido <= 0) {
      this.error.set('No encontramos los datos para verificar este pago.');
      return;
    }
    this.consultarEstado();
  }

  protected consultarEstado(): void {
    if (!this.idTransaccion || !this.referencia) return;

    this.consultando.set(true);
    this.error.set(null);
    this.wompi.consultarTransaccion(this.idTransaccion, this.referencia).subscribe({
      next: (estado) => {
        this.estado.set(estado);
        this.consultando.set(false);
        if (estado.estadoPago === 'APPROVED') this.carrito.vaciar();
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.consultando.set(false);
      },
    });
  }

  protected reintentarPago(): void {
    this.preparandoReintento.set(true);
    this.error.set(null);
    this.wompi.reintentarPago(this.idPedido).subscribe({
      next: (checkout: WompiCheckout) => {
        try {
          this.wompi.redirigirAlCheckout(checkout);
        } catch (err) {
          this.error.set(err instanceof Error ? err.message : 'No se pudo abrir el pago de Wompi.');
          this.preparandoReintento.set(false);
        }
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.preparandoReintento.set(false);
      },
    });
  }
}
