import React, { useState, useRef } from 'react';
import { FaGoogle, FaSteam, FaTimes, FaSpinner, FaSignInAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../AuthContext';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';
import { FormField } from '../../shared/components/ui/DynamicForm';
import { loginWithExternalProvider } from '../service/oauthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<'google' | 'steam' | null>(null);
  const navigate = useNavigate();
  const { login, loginWithOAuth } = useAuth();
  const { addNotification } = useNotification();
  const googleLoginRef = useRef<HTMLDivElement>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setOAuthLoading('google');
    try {
      if (!credentialResponse.credential) {
        addNotification('No se pudo obtener el token de Google', 'error');
        setOAuthLoading(null);
        return;
      }

      const result = await loginWithExternalProvider('Google', credentialResponse.credential);

      if (result.success && result.token && result.user) {
        loginWithOAuth(result.token, result.user);
        addNotification('¡Bienvenido a World Gaming!', 'success');
        onClose();
        navigate('/worldGaming/inicio', { replace: true });
      } else {
        addNotification(result.message || 'Error en la autenticación con Google', 'error');
      }
    } catch (error: any) {
      addNotification(error.message || 'Error al autenticar con Google', 'error');
    } finally {
      setOAuthLoading(null);
    }
  };

  const handleGoogleError = () => {
    setOAuthLoading(null);
    addNotification('Error al iniciar sesión con Google', 'error');
  };

  const handleSteamLogin = () => {
    setOAuthLoading('steam');
    const realm = window.location.origin;
    const returnTo = `${realm}/auth/steam/callback`;

    const steamAuthUrl = `https://steamcommunity.com/openid/login?` +
      `openid.ns=http://specs.openid.net/auth/2.0&` +
      `openid.mode=checkid_setup&` +
      `openid.return_to=${encodeURIComponent(returnTo)}&` +
      `openid.realm=${encodeURIComponent(realm)}&` +
      `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
      `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

    window.location.href = steamAuthUrl;
  };

  const fields: FormField[] = [
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email',
      required: true,
      placeholder: 'tu@email.com',
      colSpan: 2
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      placeholder: '••••••••',
      minLength: 6,
      colSpan: 2
    }
  ];

  const handleSubmit = async (values: Record<string, any>) => {
    setIsLoading(true);

    try {
      const success = await login(values['email'], values['password']);
      if (success) {
        addNotification('¡Bienvenido de nuevo!', 'success');
        onClose();
        navigate('/worldGaming/inicio', { replace: true });
      }
    } catch (err: any) {
      addNotification(err.message || 'Credenciales o ID de empresa inválidos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Mostrar loading al iniciar sesión
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl">
          <LoadingScreen
            title="Iniciando Sesión"
            subtitle="Validando tus credenciales..."
            description="Estamos verificando tu cuenta en WorldGaming. Esto puede tomar unos momentos."
            showDetails={true}
            details={{
              title: "Información del login",
              items: [
                {
                  label: 'Estado',
                  value: 'Validando...'
                },
                {
                  label: 'Autenticación',
                  value: 'En progreso'
                },
                {
                  label: 'Siguiente paso',
                  value: 'Redirigir al dashboard'
                }
              ]
            }}
            variant="detailed"
            className="bg-transparent min-h-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con efecto de partículas estelares */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Partículas estelares animadas */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden relative">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

          {/* Header del Modal */}
          <div className="relative p-8 text-center">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-all duration-200 hover:bg-white/10 rounded-full p-2"
            >
              {/* @ts-ignore - react-icons type compatibility */}
              <FaTimes size={20} />
            </button>

            {/* Icono mejorado */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center relative z-10">
                {/* @ts-ignore - react-icons type compatibility */}
                <FaSignInAlt className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            {/* Título mejorado */}
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              INICIA SESIÓN
            </h2>
            <p className="text-white/80 text-base font-medium">
              Accede a tu cuenta de World Gaming
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8 relative z-10">
            <DynamicForm
              fields={fields}
              onSubmit={handleSubmit}
              submitText={isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              loading={isLoading}
              renderSubmitButton={({ submitText, loading }) => (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-4 px-6 rounded-2xl hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25 font-semibold text-lg relative overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      {/* @ts-ignore - react-icons type compatibility */}
                  <FaSpinner className="w-6 h-6 animate-spin mr-3" />
                      {submitText}
                    </div>
                  ) : (
                    <span className="relative z-10">{submitText}</span>
                  )}
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {/* Efecto de resplandor */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            />

            {/* Separador */}
            <div className="flex items-center justify-center space-x-4 py-2 mt-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="text-white/60 text-sm font-medium px-3">o continúa con</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            {/* Botones de redes sociales */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {/* Botón Google personalizado */}
              {oauthLoading === 'google' ? (
                <div className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 px-4">
                  {/* @ts-ignore - react-icons type compatibility */}
                  <FaSpinner className="w-5 h-5 animate-spin text-white" />
                  <span className="text-white text-sm font-medium">Google</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // Activar el botón de GoogleLogin oculto
                    const googleButton = googleLoginRef.current?.querySelector('div[role="button"]') as HTMLElement;
                    if (googleButton) {
                      googleButton.click();
                    }
                  }}
                  disabled={oauthLoading !== null}
                  className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* @ts-ignore - react-icons type compatibility */}
                  <FaGoogle className="w-5 h-5" />
                  <span className="text-white text-sm font-medium">Google</span>
                </button>
              )}

              {/* Botón Steam con icono mejorado */}
              <button
                type="button"
                onClick={handleSteamLogin}
                disabled={oauthLoading !== null}
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-2xl py-4 px-4 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {oauthLoading === 'steam' ? (
                  // @ts-ignore - react-icons type compatibility
                  <FaSpinner className="w-5 h-5 animate-spin text-white" />
                ) : (
                  // @ts-ignore - react-icons type compatibility
                  <FaSteam className="w-5 h-5 text-white" />
                )}
                <span className="text-white text-sm font-medium">Steam</span>
              </button>

              {/* GoogleLogin oculto para manejar la autenticación */}
              <div ref={googleLoginRef} className="hidden">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                  locale="es"
                  ux_mode="popup"
                />
              </div>
            </div>

            {/* Enlace para registrarse */}
            <div className="text-center pt-4">
              <p className="text-white/70 text-sm">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-all duration-200 hover:underline decoration-purple-400 underline-offset-2"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginModal; 