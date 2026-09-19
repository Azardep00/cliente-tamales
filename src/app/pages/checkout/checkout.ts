import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  protected readonly carrito = inject(CarritoService);
  protected readonly auth = inject(AuthService);
  private readonly pedidoService = inject(PedidoService);
  private readonly router = inject(Router);

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

    this.pedidoService.crear({ idCliente: sesion.idUsuario, detalles }).subscribe({
      next: (pedido) => {
        this.carrito.vaciar();
        this.router.navigate(['/mis-pedidos'], { state: { pedidoRecienCreado: pedido.idPedido } });
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.enviando.set(false);
      },
    });
  }
}
