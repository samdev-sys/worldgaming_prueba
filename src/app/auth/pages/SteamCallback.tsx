import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import { loginWithExternalProvider } from '../service/oauthService';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';

const SteamCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const { addNotification } = useNotification();
  const [, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const openIdParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          openIdParams[key] = value;
        });

        if (!openIdParams['openid.mode'] || openIdParams['openid.mode'] !== 'id_res') {
          addNotification('Error en la autenticación con Steam', 'error');
          navigate('/');
          return;
        }

        const identity = openIdParams['openid.claimed_id'] || openIdParams['openid.identity'];
        if (!identity) {
          addNotification('No se pudo obtener el ID de Steam', 'error');
          navigate('/');
          return;
        }

        const steamIdMatch = identity.match(/\/id\/(\d+)$/);
        if (!steamIdMatch || !steamIdMatch[1]) {
          addNotification('Formato de ID de Steam inválido', 'error');
          navigate('/');
          return;
        }

        const steamId = steamIdMatch[1];

        const result = await loginWithExternalProvider('Steam', steamId);

        if (result.success && result.token && result.user) {
          loginWithOAuth(result.token, result.user);
          addNotification('¡Bienvenido a World Gaming!', 'success');
          navigate('/worldGaming/inicio', { replace: true });
        } else {
          addNotification(result.message || 'Error en la autenticación', 'error');
          navigate('/');
        }
      } catch (error: any) {
        addNotification(error.message || 'Error al procesar la autenticación', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithOAuth, addNotification]);

  return (
    <LoadingScreen
      title="Autenticando con Steam"
      subtitle="Procesando tu información..."
      description="Estamos verificando tu cuenta de Steam y configurando tu perfil."
    />
  );
};

export default SteamCallback;
