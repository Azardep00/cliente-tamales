import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, shareReplay, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { LoginRequest, LoginResponse, RegistroClienteRequest, Usuario } from '../models/usuario.model';

const CLAVE_SESION = 'tamaleslechona.sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _sesion = signal<LoginResponse | null>(this.leerGuardada());

  readonly sesion = this._sesion.asReadonly();
  readonly estaAutenticado = computed(() => this._sesion() !== null);

  // Si varias peticiones reciben 401 al mismo tiempo, todas reutilizan
  // ESTE observable compartido en vez de disparar cada una su propio
  // refresh (si no, rotarian el refresh token varias veces y se pisarian).
  private renovacionEnCurso$: Observable<LoginResponse> | null = null;

  login(datos: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/usuarios/login`, datos)
      .pipe(tap((sesion) => this.guardar(sesion)));
  }

  registrar(datos: RegistroClienteRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_BASE_URL}/usuarios/clientes`, datos);
  }

  // Pide un access token nuevo usando el refresh token guardado. El
  // backend rota el refresh token (el viejo queda invalido), asi que
  // siempre se guarda la sesion completa que llega en la respuesta.
  renovarSesion(): Observable<LoginResponse> {
    if (this.renovacionEnCurso$) return this.renovacionEnCurso$;

    const actual = this._sesion();
    if (!actual) throw new Error('No hay sesión para renovar.');

    this.renovacionEnCurso$ = this.http
      .post<LoginResponse>(`${API_BASE_URL}/usuarios/refresh`, { refreshToken: actual.refreshToken })
      .pipe(
        tap((sesion) => this.guardar(sesion)),
        finalize(() => (this.renovacionEnCurso$ = null)),
        shareReplay(1),
      );

    return this.renovacionEnCurso$;
  }

  cerrarSesion(): void {
    const actual = this._sesion();
    this._sesion.set(null);
    localStorage.removeItem(CLAVE_SESION);

    // Avisa al backend para invalidar el refresh token del lado del
    // servidor. La sesion local ya se cerro arriba, asi que esto es
    // "fire and forget": no hace falta esperar la respuesta.
    if (actual?.refreshToken) {
      this.http
        .post(`${API_BASE_URL}/usuarios/logout`, { refreshToken: actual.refreshToken })
        .subscribe({ error: () => {} });
    }
  }

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