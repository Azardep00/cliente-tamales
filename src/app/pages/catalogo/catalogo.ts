import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';
import { ToastService } from '../../core/services/toast.service';
import { Producto } from '../../core/models/producto.model';
import { ProductoCard } from '../../shared/producto-card/producto-card';
import { ProductoCardSkeleton } from '../../shared/producto-card-skeleton/producto-card-skeleton';

type Filtro = 'TODOS' | 'Tamal' | 'Lechona';

@Component({
  selector: 'app-catalogo',
  imports: [ProductoCard, FormsModule, ProductoCardSkeleton],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {
  private readonly productoService = inject(ProductoService);
  private readonly carrito = inject(CarritoService);
  private readonly toast = inject(ToastService);

  protected readonly productos = signal<Producto[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly filtro = signal<Filtro>('TODOS');

  // Nuevo: texto de busqueda y rango de precio, ambos opcionales.
  protected readonly busqueda = signal('');
  protected readonly precioMin = signal<number | null>(null);
  protected readonly precioMax = signal<number | null>(null);

  constructor() {
    this.cargar();
  }

  protected productosFiltrados(): Producto[] {
    let lista = this.productos();

    const f = this.filtro();
    if (f !== 'TODOS') {
      lista = lista.filter((p) => p.tipoProducto === f);
    }

    const texto = this.busqueda().trim().toLowerCase();
    if (texto) {
      lista = lista.filter((p) => p.nombre.toLowerCase().includes(texto));
    }

    const min = this.precioMin();
    if (min !== null && Number.isFinite(min) && min >= 0) {
      lista = lista.filter((p) => p.precio >= min);
    }

    const max = this.precioMax();
    if (max !== null && Number.isFinite(max) && max >= 0) {
      lista = lista.filter((p) => p.precio <= max);
    }

    return lista;
  }

  protected cambiarFiltro(f: Filtro): void {
    this.filtro.set(f);
  }

  protected onBusquedaChange(valor: string): void {
    this.busqueda.set(valor);
  }

  protected onPrecioMinChange(valor: string | number | null): void {
    const numero = valor === '' || valor === null ? null : Number(valor);

    this.precioMin.set(
      numero !== null && Number.isFinite(numero) && numero >= 0
        ? numero
        : null
    );
  }

  protected onPrecioMaxChange(valor: string | number | null): void {
    const numero = valor === '' || valor === null ? null : Number(valor);

    this.precioMax.set(
      numero !== null && Number.isFinite(numero) && numero >= 0
        ? numero
        : null
    );
  }

  protected limpiarFiltros(): void {
    this.filtro.set('TODOS');
    this.busqueda.set('');
    this.precioMin.set(null);
    this.precioMax.set(null);
  }

  protected hayFiltrosActivos(): boolean {
    const min = this.precioMin();
    return (
      this.filtro() !== 'TODOS' ||
      this.busqueda().trim() !== '' ||
      (min !== null) ||
      this.precioMax() !== null
    );
  }

  protected agregarAlCarrito(producto: Producto): void {
    const resultado = this.carrito.agregar(producto);
    if (resultado === 'maximo') {
      this.toast.mostrar(`Ya tienes en el carrito todas las unidades disponibles de ${producto.nombre}.`, {
        tipo: 'aviso',
        accion: { texto: 'Ver carrito', ruta: '/carrito' },
      });
      return;
    }
    const enCarrito = this.carrito.cantidadDe(producto.idProducto);
    this.toast.mostrar(
      enCarrito > 1
        ? `${producto.nombre} agregado · ya llevas ${enCarrito}`
        : `${producto.nombre} agregado al carrito`,
      { accion: { texto: 'Ver carrito', ruta: '/carrito' } },
    );
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