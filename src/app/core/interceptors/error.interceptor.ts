import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

// El backend responde errores como { "mensaje": "..." } (GlobalExceptionHandler).
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Ocurrió un error inesperado. Intenta de nuevo.';

      if (error.status === 0) {
        mensaje = 'No se pudo conectar con el servidor. Revisa que el backend esté corriendo.';
      } else if (error.error && typeof error.error === 'object' && 'mensaje' in error.error) {
        mensaje = String((error.error as { mensaje: unknown }).mensaje);
      } else if (error.status === 401) {
        mensaje = 'Debes iniciar sesión para hacer esto.';
      } else if (error.status === 403) {
        mensaje = 'No tienes permiso para hacer esta acción.';
      }

      return throwError(() => new Error(mensaje));
    }),
  );
};