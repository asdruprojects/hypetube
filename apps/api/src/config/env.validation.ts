/**
 * Validación mínima de variables de entorno. Mantenemos la lista corta a propósito:
 * el servicio no tiene credenciales ni base de datos. Si más adelante se agrega
 * un proveedor externo (auth, DB, mailer) este es el único punto donde se declaran.
 */
export function envValidation(config: Record<string, unknown>) {
  return {
    NODE_ENV: (config.NODE_ENV as string) || 'development',
    PORT: parseInt(config.PORT as string, 10) || 4000,
    HOST: (config.HOST as string) || '0.0.0.0',
    CORS_ORIGIN: (config.CORS_ORIGIN as string) || 'http://localhost:5173',
    MOCK_VIDEOS_PATH: (config.MOCK_VIDEOS_PATH as string) || '',
  };
}
