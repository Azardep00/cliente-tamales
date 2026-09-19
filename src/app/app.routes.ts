import { Routes } from '@angular/router';
import { Catalogo } from './pages/catalogo/catalogo';
import { Carrito } from './pages/carrito/carrito';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: Catalogo },
  { path: 'carrito', component: Carrito },
  { path: '**', redirectTo: 'catalogo' },
];
