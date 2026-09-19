import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protege /checkout y /mis-pedidos: si no hay sesión, manda a /login
// recordando a dónde quería ir con returnUrl.
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) return true;

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
