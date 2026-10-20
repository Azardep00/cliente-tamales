import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'aviso' | 'error';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: TipoToast;
  accion?: { texto: string; ruta: string };
}

export interface OpcionesToast {
  tipo?: TipoToast;
  accion?: { texto: string; ruta: string };
  duracionMs?: number;
}

const MAXIMO_VISIBLES = 3;

// Avisos breves y no bloqueantes. Cualquier parte de la app puede inyectarlo
// y llamar a mostrar(); <app-toast /> (en app.html) se encarga de pintarlos.
@Injectable({ providedIn: 'root' })
export class ToastService {
  private siguienteId = 1;
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  mostrar(mensaje: string, opciones: OpcionesToast = {}): void {
    const toast: Toast = {
      id: this.siguienteId++,
      mensaje,
      tipo: opciones.tipo ?? 'exito',
      accion: opciones.accion,
    };
    this._toasts.update((lista) => [...lista, toast].slice(-MAXIMO_VISIBLES));
    setTimeout(() => this.cerrar(toast.id), opciones.duracionMs ?? 3500);
  }

  cerrar(id: number): void {
    this._toasts.update((lista) => lista.filter((t) => t.id !== id));
  }
}
