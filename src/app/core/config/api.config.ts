import { environment } from '../../../environments/environment';

// URL base del backend Spring Boot. Cambia automáticamente según el entorno
// (ver environment.ts para desarrollo y environment.prod.ts para producción).
export const API_BASE_URL = `${environment.apiUrl}/api`;