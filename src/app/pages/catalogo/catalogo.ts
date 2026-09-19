import { Component, inject, signal } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Producto } from '../../core/models/producto.model';
import { ProductoCard } from '../../shared/producto-card/producto-card';

type Filtro = 'TODOS' | 'Tamal' | 'Lechona';

@Component({
  selector: 'app-catalogo',
  imports: [ProductoCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  private readonly productoService = inject(ProductoService);
  private readonly carrito = inject(CarritoService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly filtro = signal<Filtro>('TODOS');

  constructor() {
    this.cargar();
  }

  protected productosFiltrados(): Producto[] {
    const f = this.filtro();
    return f === 'TODOS' ? this.productos() : this.productos().filter((p) => p.tipoProducto === f);
  }

  protected cambiarFiltro(f: Filtro): void {
    this.filtro.set(f);
  }

  protected agregarAlCarrito(producto: Producto): void {
    this.carrito.agregar(producto);
  }

  private cargar(): void {
    this.cargando.set(true);
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.cargando.set(false);
      },
    });
  }
}
