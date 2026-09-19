import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);

  // Sin incluirInactivos: el backend por defecto solo trae estado=true.
  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_BASE_URL}/productos`);
  }

  buscarPorNombre(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_BASE_URL}/productos/buscar`, { params: { nombre } });
  }
}
