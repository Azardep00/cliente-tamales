export type TipoCliente = 'NUEVO' | 'FRECUENTE' | 'PREMIUM';

// La contraseña nunca viaja de vuelta (WRITE_ONLY en el backend).
export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  estado: boolean;
  fechaNacimiento: string; // yyyy-MM-dd
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

// El backend no usa JWT: el login solo confirma credenciales y devuelve
// estos datos básicos. La "sesión" se guarda del lado del navegador.
export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  tipoUsuario: 'Cliente' | 'Empleado';
}
