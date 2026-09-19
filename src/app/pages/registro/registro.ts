import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
    fechaNacimiento: ['', Validators.required],
    direccion: ['', Validators.required],
  });

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
          // Después de registrarse, lo mandamos derecho a loguearse.
          this.router.navigate(['/login']);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.enviando.set(false);
        },
      });
  }
}
