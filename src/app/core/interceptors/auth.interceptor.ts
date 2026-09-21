import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Adjunta "Authorization: Bearer <token>" a toda petición saliente, cuando
// hay sesión activa. Sin esto, el backend (ya con Spring Security) rechaza
// con 401 cualquier ruta que no sea pública.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.sesion()?.token;

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
