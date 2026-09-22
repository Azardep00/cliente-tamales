import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { ActualizarClienteRequest, CambiarContrasenaRequest, Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${API_BASE_URL}/usuarios/${id}`);
  }

  actualizarCliente(id: number, datos: ActualizarClienteRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${API_BASE_URL}/usuarios/${id}`, datos);
  }

  cambiarContrasena(id: number, datos: CambiarContrasenaRequest): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/usuarios/${id}/contrasena`, datos);
  }
}
