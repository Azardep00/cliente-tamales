import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Pedido } from '../../core/models/pedido.model';

@Component({
  selector: 'app-mis-pedidos',
  imports: [RouterLink],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
})
export class MisPedidos {
  private readonly auth = inject(AuthService);
  private readonly pedidoService = inject(PedidoService);

  protected readonly pedidos = signal<Pedido[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly cancelandoId = signal<number | null>(null);

  constructor() {
    this.cargar();
  }

  protected formatearPrecio(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  protected formatearFecha(iso: string): string {
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  protected puedeCancelar(pedido: Pedido): boolean {
    return pedido.estado === 'PENDIENTE' || pedido.estado === 'CONFIRMADO';
  }

  protected cancelar(idPedido: number): void {
    this.cancelandoId.set(idPedido);
    this.pedidoService.cancelar(idPedido).subscribe({
      next: () => this.cargar(),
      error: (err: Error) => {
        this.error.set(err.message);
        this.cancelandoId.set(null);
      },
    });
  }

  private cargar(): void {
    const sesion = this.auth.sesion();
    if (!sesion) return;

    this.cargando.set(true);
    this.pedidoService.listarPorCliente(sesion.idUsuario).subscribe({
      next: (data) => {
        // Más recientes primero.
        this.pedidos.set([...data].sort((a, b) => b.idPedido - a.idPedido));
        this.cargando.set(false);
        this.cancelandoId.set(null);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.cargando.set(false);
      },
    });
  }
}
