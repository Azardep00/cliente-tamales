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

// Ahora sí trae token: el backend ya emite JWT en el login.
export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  tipoUsuario: 'Cliente' | 'Empleado';
  token: string;
}
