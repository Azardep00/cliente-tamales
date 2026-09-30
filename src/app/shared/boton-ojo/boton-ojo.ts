import { Component, EventEmitter, Input, Output } from '@angular/core';

// Boton "ojito" para mostrar/ocultar una contraseña. Es puramente visual:
// no sabe nada del FormControl al que acompaña, solo avisa con (alternar)
// cuando lo presionan, y el componente padre decide el type del input.
@Component({
  selector: 'app-boton-ojo',
  templateUrl: './boton-ojo.html',
  styleUrl: './boton-ojo.css',
})
export class BotonOjo {
  @Input() mostrando = false;
  @Output() alternar = new EventEmitter<void>();
}