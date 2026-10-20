import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Enlace discreto "Volver al catalogo" para paginas internas. Es un bloque
// que ocupa su propia fila y no altera el centrado ni el ancho de la pagina.
@Component({
  selector: 'app-volver-catalogo',
  imports: [RouterLink],
  template: `<a routerLink="/catalogo" class="volver">&larr; Volver al catálogo</a>`,
  styles: [`
    :host { display: block; margin-bottom: 12px; }
    .volver { color: var(--tinta-suave); font-size: 0.88rem; font-weight: 500; }
    .volver:hover { color: var(--tinta); text-decoration: underline; }
  `],
})
export class VolverCatalogo {}
