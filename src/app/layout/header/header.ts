import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly carrito = inject(CarritoService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Hace "latir" el carrito cada vez que cambia la cantidad (feedback visual al agregar).
  protected readonly latiendo = signal(false);
  private primeraLectura = true;

  constructor() {
    effect(() => {
      this.carrito.cantidadTotal();
      if (this.primeraLectura) {
        this.primeraLectura = false;
        return;
      }
      this.latiendo.set(false);
      setTimeout(() => {
        this.latiendo.set(true);
        setTimeout(() => this.latiendo.set(false), 600);
      }, 20);
    });
  }

  protected salir(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/catalogo']);
  }
}
