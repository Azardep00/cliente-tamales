import { Routes } from '@angular/router';
import { Catalogo } from './pages/catalogo/catalogo';
import { Carrito } from './pages/carrito/carrito';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Checkout } from './pages/checkout/checkout';
import { MisPedidos } from './pages/mis-pedidos/mis-pedidos';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: Catalogo },
  { path: 'carrito', component: Carrito },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'mis-pedidos', component: MisPedidos, canActivate: [authGuard] },
  { path: '**', redirectTo: 'catalogo' },
];
