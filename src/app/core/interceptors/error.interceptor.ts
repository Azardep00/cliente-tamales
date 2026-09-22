import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// El backend responde errores como { "mensaje": "..." } (GlobalExceptionHandler).
// Además: si un 401 llega en cualquier ruta que NO sea el propio login, quiere
// decir que el token expiró o dejó de ser válido a mitad de la sesión — ahí
// cerramos sesión y mandamos a /login, en vez de dejar que cada pantalla
// muestre su propio error confuso.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Ocurrió un error inesperado. Intenta de nuevo.';

      if (error.status === 0) {
        mensaje = 'No se pudo conectar con el servidor. Revisa que el backend esté corriendo.';
      } else if (error.error && typeof error.error === 'object' && 'mensaje' in error.error) {
        mensaje = String((error.error as { mensaje: unknown }).mensaje);
      }

      const esIntentoDeLogin = req.url.includes('/usuarios/login');
      if (error.status === 401 && !esIntentoDeLogin && auth.estaAutenticado()) {
        auth.cerrarSesion();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        mensaje = 'Tu sesión expiró. Inicia sesión de nuevo.';
      }

      return throwError(() => new Error(mensaje));
    }),
  );
};
