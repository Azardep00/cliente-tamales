import { Injectable, computed, signal } from '@angular/core';
import { Producto } from '../models/producto.model';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

const CLAVE_CARRITO = 'tamaleslechona.carrito';

// El backend no tiene noción de "carrito", solo de Pedido final. El carrito
// vive en el navegador y se convierte en Pedido real al confirmar el checkout.
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly _items = signal<ItemCarrito[]>(this.leerGuardado());

  readonly items = this._items.asReadonly();
  readonly cantidadTotal = computed(() => this._items().reduce((acc, i) => acc + i.cantidad, 0));
  readonly total = computed(() =>
    this._items().reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0),
  );

  agregar(producto: Producto, cantidad = 1): void {
    const items = this._items();
    const existente = items.find((i) => i.producto.idProducto === producto.idProducto);

    if (existente) {
      const nuevaCantidad = Math.min(existente.cantidad + cantidad, producto.stock);
      this.guardar(
        items.map((i) =>
          i.producto.idProducto === producto.idProducto ? { ...i, cantidad: nuevaCantidad } : i,
        ),
      );
    } else {
      this.guardar([...items, { producto, cantidad: Math.min(cantidad, producto.stock) }]);
    }
  }

  actualizarCantidad(idProducto: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(idProducto);
      return;
    }
    this.guardar(this._items().map((i) => (i.producto.idProducto === idProducto ? { ...i, cantidad } : i)));
  }

  quitar(idProducto: number): void {
    this.guardar(this._items().filter((i) => i.producto.idProducto !== idProducto));
  }

  vaciar(): void {
    this.guardar([]);
  }

  private guardar(items: ItemCarrito[]): void {
    this._items.set(items);
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }

  private leerGuardado(): ItemCarrito[] {
    const bruto = localStorage.getItem(CLAVE_CARRITO);
    if (!bruto) return [];
    try {
      return JSON.parse(bruto) as ItemCarrito[];
    } catch {
      return [];
    }
  }
}
