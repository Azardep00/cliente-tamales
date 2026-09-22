import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { LoginRequest, LoginResponse, RegistroClienteRequest, Usuario } from '../models/usuario.model';

const CLAVE_SESION = 'tamaleslechona.sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _sesion = signal<LoginResponse | null>(this.leerGuardada());

  readonly sesion = this._sesion.asReadonly();
  readonly estaAutenticado = computed(() => this._sesion() !== null);

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/usuarios/login`, datos)
      .pipe(tap((sesion) => this.guardar(sesion)));
  }

  registrar(datos: RegistroClienteRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_BASE_URL}/usuarios/clientes`, datos);
  }

  cerrarSesion(): void {
    this._sesion.set(null);
    localStorage.removeItem(CLAVE_SESION);
  }

  // Se llama después de editar el perfil, para que el header y demás
  // pantallas reflejen el nombre/correo nuevo sin obligar a re-loguearse
  // (el token sigue siendo válido, solo cambian estos datos de exhibición).
  actualizarDatosSesion(cambios: Partial<Pick<LoginResponse, 'nombre' | 'apellido' | 'correo'>>): void {
    const actual = this._sesion();
    if (!actual) return;
    this.guardar({ ...actual, ...cambios });
  }

  private guardar(sesion: LoginResponse): void {
    this._sesion.set(sesion);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  }

  private leerGuardada(): LoginResponse | null {
    const bruto = localStorage.getItem(CLAVE_SESION);
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as LoginResponse;
    } catch {
      return null;
    }
  }
}
