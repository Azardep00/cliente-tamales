import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly cargando = signal(true);
  protected readonly usuario = signal<Usuario | null>(null);

  protected readonly guardandoDatos = signal(false);
  protected readonly errorDatos = signal<string | null>(null);
  protected readonly exitoDatos = signal(false);

  protected readonly cambiandoContrasena = signal(false);
  protected readonly errorContrasena = signal<string | null>(null);
  protected readonly exitoContrasena = signal(false);

  protected readonly formDatos = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    telefono: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    direccion: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
  });

  protected readonly formContrasena = this.fb.nonNullable.group({
    contrasenaActual: ['', Validators.required],
    contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    const sesion = this.auth.sesion();
    if (!sesion) return;

    this.usuarioService.obtener(sesion.idUsuario).subscribe({
      next: (u) => {
        this.usuario.set(u);
        this.formDatos.patchValue({
          nombre: u.nombre,
          apellido: u.apellido,
          telefono: u.telefono,
          correo: u.correo,
          direccion: u.direccion ?? '',
          fechaNacimiento: u.fechaNacimiento,
        });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected guardarDatos(): void {
    const actual = this.usuario();
    const sesion = this.auth.sesion();
    if (!actual || !sesion || this.formDatos.invalid) {
      this.formDatos.markAllAsTouched();
      return;
    }

    this.guardandoDatos.set(true);
    this.errorDatos.set(null);
    this.exitoDatos.set(false);

    const v = this.formDatos.getRawValue();

    this.usuarioService
      .actualizarCliente(sesion.idUsuario, {
        tipoUsuario: 'Cliente',
        nombre: v.nombre,
        apellido: v.apellido,
        telefono: v.telefono,
        correo: v.correo,
        fechaNacimiento: v.fechaNacimiento,
        // Estos dos no se editan aquí; se conservan tal cual estaban.
        tipoCliente: actual.tipoCliente ?? 'NUEVO',
        direccion: v.direccion,
        fechaRegistro: actual.fechaRegistro ?? new Date().toISOString().slice(0, 10),
      })
      .subscribe({
        next: (actualizado) => {
          this.usuario.set(actualizado);
          this.auth.actualizarDatosSesion({
            nombre: actualizado.nombre,
            apellido: actualizado.apellido,
            correo: actualizado.correo,
          });
          this.guardandoDatos.set(false);
          this.exitoDatos.set(true);
        },
        error: (err: Error) => {
          this.errorDatos.set(err.message);
          this.guardandoDatos.set(false);
        },
      });
  }

  protected cambiarContrasena(): void {
    const sesion = this.auth.sesion();
    if (!sesion || this.formContrasena.invalid) {
      this.formContrasena.markAllAsTouched();
      return;
    }

    this.cambiandoContrasena.set(true);
    this.errorContrasena.set(null);
    this.exitoContrasena.set(false);

    this.usuarioService.cambiarContrasena(sesion.idUsuario, this.formContrasena.getRawValue()).subscribe({
      next: () => {
        this.cambiandoContrasena.set(false);
        this.exitoContrasena.set(true);
        this.formContrasena.reset();
      },
      error: (err: Error) => {
        this.errorContrasena.set(err.message);
        this.cambiandoContrasena.set(false);
      },
    });
  }
}
