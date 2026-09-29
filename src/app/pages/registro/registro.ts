import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// Telefono colombiano: 7 a 10 digitos, solo numeros (sin espacios ni guiones).
const PATRON_TELEFONO = /^[0-9]{7,10}$/;

const EDAD_MINIMA = 12;

// Valida que la fecha de nacimiento no sea futura y que la persona
// tenga al menos EDAD_MINIMA anos. Un Validator custom de Angular
// recibe el control y devuelve null si es valido, o un objeto de
// errores si no lo es.
function fechaNacimientoValida(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null; // el "required" ya se encarga de esto

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return { fechaInvalida: true };

  const hoy = new Date();
  if (fecha > hoy) return { fechaFutura: true };

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const aunNoCumpleEsteAno =
    hoy.getMonth() < fecha.getMonth() ||
    (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate());
  if (aunNoCumpleEsteAno) edad--;

  return edad < EDAD_MINIMA ? { edadMinima: true } : null;
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(PATRON_TELEFONO)]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    fechaNacimiento: ['', [Validators.required, fechaNacimientoValida]],
    direccion: ['', Validators.required],
  });

  // Usado desde el HTML para pintar el borde rojo y mostrar el mensaje
  // solo despues de que el usuario ya interactuo con el campo (o tras
  // un intento de envio), nunca antes de que escriba nada.
  protected tieneError(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Devuelve el primer mensaje que aplique para ese campo.
  protected mensajeError(campo: string): string {
    const control = this.form.get(campo);
    if (!control || !control.errors) return '';

    const errores = control.errors;
    if (errores['required']) return 'Este campo es obligatorio.';
    if (errores['email']) return 'Ingresa un correo valido, ej: nombre@correo.com.';
    if (errores['minlength']) {
      const min = errores['minlength'].requiredLength;
      return `Debe tener al menos ${min} caracteres.`;
    }
    if (errores['pattern']) return 'Ingresa solo numeros (7 a 10 digitos).';
    if (errores['fechaFutura']) return 'La fecha no puede ser en el futuro.';
    if (errores['fechaInvalida']) return 'Ingresa una fecha valida.';
    if (errores['edadMinima']) return `Debes tener al menos ${EDAD_MINIMA} años.`;
    return 'Este campo no es valido.';
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();
    const hoy = new Date().toISOString().slice(0, 10);

    this.auth
      .registrar({
        tipoUsuario: 'Cliente',
        nombre: v.nombre,
        apellido: v.apellido,
        telefono: v.telefono,
        correo: v.correo,
        contrasena: v.contrasena,
        estado: true,
        fechaNacimiento: v.fechaNacimiento,
        tipoCliente: 'NUEVO',
        direccion: v.direccion,
        fechaRegistro: hoy,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.enviando.set(false);
        },
      });
  }
}