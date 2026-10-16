import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Boton reutilizable "Volver al catalogo" para las paginas internas.
@Component({
  selector: 'app-volver-catalogo',
  imports: [RouterLink],
  template: `<a routerLink="/catalogo" class="boton-volver">&larr; Volver al catálogo</a>`,
  styles: [`
    :host { display: block; margin-bottom: 16px; }
    .boton-volver {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 999px;
      border: 1px solid #b8410f; color: #b8410f; background: transparent;
      font-weight: 600; font-size: 0.9rem; text-decoration: none;
      transition: background .15s, color .15s;
    }
    .boton-volver:hover, .boton-volver:focus-visible { background: #b8410f; color: #fff; }
  `],
})
export class VolverCatalogo {}
