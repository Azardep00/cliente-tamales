import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Pedido, PedidoRequest } from '../models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);

  crear(datos: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_BASE_URL}/pedidos`, datos);
  }

  listarPorCliente(idCliente: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_BASE_URL}/pedidos`, {
      params: { idCliente: idCliente.toString() },
    });
  }

  // El backend cancela (no borra) y devuelve el stock automáticamente.
  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/pedidos/${id}`);
  }
}
