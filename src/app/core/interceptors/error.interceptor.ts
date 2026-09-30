import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Si un 401 llega en una ruta protegida (no login, no el propio refresh),
// se intenta renovar la sesion UNA vez con el refresh token guardado y se
// reintenta la peticion original con el token nuevo, todo sin que el
// usuario lo note. Si el refresh tambien falla, ahi si se cierra sesion.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const esIntentoDeLogin = req.url.includes('/usuarios/login');
  const esIntentoDeRefresh = req.url.includes('/usuarios/refresh');

  const cerrarPorSesionInvalida = () => {
    auth.cerrarSesion();
    router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
    return throwError(() => new Error('Tu sesión expiró. Inicia sesión de nuevo.'));
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const puedeReintentar =
        error.status === 401 && !esIntentoDeLogin && !esIntentoDeRefresh && auth.estaAutenticado();

      if (puedeReintentar) {
        return auth.renovarSesion().pipe(
          switchMap((sesionNueva) => {
            const reintento = req.clone({ setHeaders: { Authorization: `Bearer ${sesionNueva.token}` } });
            return next(reintento);
          }),
          catchError(() => cerrarPorSesionInvalida()),
        );
      }

      let mensaje = 'Ocurrió un error inesperado. Intenta de nuevo.';
      if (error.status === 0) {
        mensaje = 'No se pudo conectar con el servidor. Revisa que el backend esté corriendo.';
      } else if (error.error && typeof error.error === 'object' && 'mensaje' in error.error) {
        mensaje = String((error.error as { mensaje: unknown }).mensaje);
      }

      return throwError(() => new Error(mensaje));
    }),
  );
};