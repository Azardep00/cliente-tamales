export type TipoProducto = 'Tamal' | 'Lechona';

// Refleja el JSON polimórfico real de GET /api/productos (Producto.java usa
// @JsonTypeInfo con la propiedad "tipoProducto" para distinguir Tamal/Lechona).
export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: boolean;
  tipoProducto: TipoProducto;
  detalleEspecifico: string; // ej: "PICANTE · GRANDE", ya armado por el backend
}