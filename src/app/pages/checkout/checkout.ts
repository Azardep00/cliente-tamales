import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { WompiService } from '../../core/services/wompi.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  protected readonly carrito = inject(CarritoService);
  protected readonly auth = inject(AuthService);
  private readonly wompi = inject(WompiService);

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  protected confirmarPedido(): void {
    const sesion = this.auth.sesion();
    if (!sesion) return; // el guard ya protege la ruta, esto es solo defensivo

    this.enviando.set(true);
    this.error.set(null);

    const detalles = this.carrito.items().map((i) => ({
      idProducto: i.producto.idProducto,
      cantidad: i.cantidad,
    }));

    this.wompi.iniciarCheckout(detalles).subscribe({
      next: (checkout) => {
        try {
          this.wompi.redirigirAlCheckout(checkout);
        } catch (err) {
          this.error.set(err instanceof Error ? err.message : 'No se pudo abrir el pago de Wompi.');
          this.enviando.set(false);
        }
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.enviando.set(false);
      },
    });
  }
}
