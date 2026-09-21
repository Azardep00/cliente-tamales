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