import { apiService } from '../../shared/services/apiService';

export type ProviderType = 'Google' | 'Steam';

export interface OAuthLoginResult {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

/**
 * Función unificada para autenticación con proveedores externos (Google, Steam)
 * @param providerType - Tipo de proveedor ('Google' o 'Steam')
 * @param tokenOrId - Token de acceso (Google) o ID del usuario (Steam)
 * @returns Resultado de la autenticación con token JWT y datos del usuario
 */
export const loginWithExternalProvider = async (
  providerType: ProviderType,
  tokenOrId: string
): Promise<OAuthLoginResult> => {
  if (!providerType || !['Google', 'Steam'].includes(providerType)) {
    throw new Error('Tipo de proveedor inválido. Debe ser "Google" o "Steam"');
  }

  if (!tokenOrId || tokenOrId.trim() === '') {
    throw new Error('El token o ID del proveedor es requerido');
  }

  try {
    const response = await apiService.post('Auth/login/external', {
      ProviderType: providerType,
      ProviderTokenOrId: tokenOrId.trim()
    });
    
    if (response.success) {
      return {
        success: true,
        token: response.data?.token,
        user: response.data?.user
      };
    }
    
    return {
      success: false,
      message: response.message || `Error en la autenticación con ${providerType}`
    };
  } catch (error: any) {
    throw new Error(error.message || `Error al autenticar con ${providerType}`);
  }
};

/**
 * @deprecated Usar loginWithExternalProvider('Google', token) en su lugar
 * Envía el token de Google al backend para validación y obtención de JWT
 */
export const loginWithGoogleToken = async (token: string): Promise<OAuthLoginResult> => {
  return loginWithExternalProvider('Google', token);
};

/**
 * @deprecated Usar loginWithExternalProvider('Steam', steamId) en su lugar
 * Envía el Steam ID al backend para validación y obtención de JWT
 */
export const loginWithSteamId = async (steamId: string): Promise<OAuthLoginResult> => {
  return loginWithExternalProvider('Steam', steamId);
};

