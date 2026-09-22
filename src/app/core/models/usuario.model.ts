export type TipoCliente = 'NUEVO' | 'FRECUENTE' | 'PREMIUM';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  estado: boolean;
  fechaNacimiento: string;
  tipoUsuario: 'Cliente' | 'Empleado';
  tipoCliente?: TipoCliente;
  direccion?: string;
  fechaRegistro?: string;
}

// El backend usa polimorfismo Jackson en Usuario (@JsonTypeInfo con
// "tipoUsuario" como discriminador), así que hasta para registrar o
// actualizar un cliente hay que mandar "tipoUsuario": "Cliente" en el body.
export interface RegistroClienteRequest {
  tipoUsuario: 'Cliente';
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  contrasena: string;
  estado: boolean;
  fechaNacimiento: string;
  tipoCliente: TipoCliente;
  direccion: string;
  fechaRegistro: string;
}

// PUT /usuarios/{id} nunca toca la contraseña (el backend la ignora ahí a
// propósito: eso pasa por el endpoint PATCH .../contrasena aparte).
export interface ActualizarClienteRequest {
  tipoUsuario: 'Cliente';
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fechaNacimiento: string;
  tipoCliente: TipoCliente;
  direccion: string;
  fechaRegistro: string;
}

export interface CambiarContrasenaRequest {
  contrasenaActual: string;
  contrasenaNueva: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  tipoUsuario: 'Cliente' | 'Empleado';
  token: string;
}
