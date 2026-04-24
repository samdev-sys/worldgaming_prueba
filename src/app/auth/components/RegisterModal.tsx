import React, { useState } from 'react';
import { FaTimes, FaSpinner, FaUserPlus } from 'react-icons/fa';
import DynamicForm, { FormField } from '../../shared/components/ui/DynamicForm';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';
import { register } from '../service/segServices';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();

  const fields: FormField[] = [
    {
      name: 'Nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Tu nombre',
      colSpan: 1
    },
    {
      name: 'Apellidos',
      label: 'Apellidos',
      type: 'text',
      required: true,
      placeholder: 'Tus apellidos',
      colSpan: 1
    },
    {
      name: 'Correo',
      label: 'Correo Electrónico',
      type: 'email',
      required: true,
      placeholder: 'tu@email.com',
      colSpan: 2
    },
    {
      name: 'Telefono',
      label: 'Teléfono',
      type: 'phone',
      placeholder: 'Número de teléfono',
      colSpan: 2
    },
    {
      name: 'Alias',
      label: 'Alias',
      type: 'text',
      required: true,
      placeholder: 'Tu alias de jugador',
      maxLength: 100,
      colSpan: 2
    },
    {
      name: 'Password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      placeholder: '••••••••',
      minLength: 8,
      colSpan: 1,
      showPasswordRules: true
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      type: 'password',
      required: true,
      placeholder: '••••••••',
      minLength: 6,
      colSpan: 1
    }
  ];

  const initialValues = {
    Nombre: '',
    Apellidos: '',
    Correo: '',
    Password: '',
    Telefono: '',
    Alias: '',
    confirmPassword: ''
  };


  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    const rules = [
      { test: password.length >= 8, message: 'La contraseña debe tener al menos 8 caracteres' },
      { test: /[A-Z]/.test(password), message: 'La contraseña debe contener al menos una letra mayúscula' },
      { test: /[a-z]/.test(password), message: 'La contraseña debe contener al menos una letra minúscula' },
      { test: /\d/.test(password), message: 'La contraseña debe contener al menos un número' },
      { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), message: 'La contraseña debe contener al menos un carácter especial' }
    ];

    const failedRule = rules.find(rule => !rule.test);
    return {
      isValid: !failedRule,
      message: failedRule?.message || ''
    };
  };

  const handleSubmit = async (values: Record<string, any>) => {
    // Validar campos requeridos
    if (!values['Nombre'] || !values['Apellidos'] || !values['Correo'] || !values['Password'] || !values['Alias']) {
      addNotification('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(values['Password']);
    if (!passwordValidation.isValid) {
      addNotification(passwordValidation.message || 'Contraseña inválida', 'error');
      return;
    }

    // Validar que las contraseñas coincidan
    if (values['Password'] !== values['confirmPassword']) {
      addNotification('Las contraseñas no coinciden', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        Nombre: values['Nombre'],
        Apellidos: values['Apellidos'],
        Correo: values['Correo'],
        Password: values['Password'],
        Telefono: values['Telefono'] || null,
        Alias: values['Alias']
      };

      // Llamar al servicio de registro
      const response = await register(userData);
      
      setIsLoading(false);
      
      if (response.success) {
        addNotification('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'success');
        onClose(); // Cerrar el modal después del registro exitoso
      } else {
        addNotification(response.message || 'Error al crear la cuenta. Por favor intenta de nuevo.', 'error');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error en el registro:', error);
      addNotification('Error al crear la cuenta. Por favor intenta de nuevo.', 'error');
    }
  };

  if (!isOpen) return null;

  // Mostrar loading al registrar
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl">
          <LoadingScreen
            title="Creando Cuenta"
            subtitle="Procesando tu registro..."
            description="Estamos creando tu cuenta en WorldGaming. Esto puede tomar unos momentos."
            showDetails={true}
            details={{
              title: "Información del registro",
              items: [
                {
                  label: 'Estado',
                  value: 'Procesando...'
                },
                {
                  label: 'Validación',
                  value: 'Completada'
                },
                {
                  label: 'Siguiente paso',
                  value: 'Crear cuenta'
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
      <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header del Modal */}
          <div className="relative p-8 text-center">
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-200"
            >
              {/* @ts-ignore - react-icons type compatibility */}
              <FaTimes size={24} />
            </button>

            {/* Icono */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                {/* @ts-ignore - react-icons type compatibility */}
                <FaUserPlus className="w-5 h-5 text-green-600" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Crea tu Cuenta
            </h2>
            <p className="text-white/70 text-sm">
              Únete a World Gaming y comienza tu aventura
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 pb-8 relative z-10">
            <DynamicForm
              fields={fields}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitText={isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              className="space-y-6"
              renderSubmitButton={({ submitText, loading }) => (
                <div className="space-y-6">
                  {/* Botón de Registro */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-green-500/25 font-semibold text-lg relative overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98]"
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  {/* Enlace para iniciar sesión */}
                  <div className="text-center pt-4">
                    <p className="text-white/70 text-sm">
                      ¿Ya tienes una cuenta?{' '}
                      <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-green-400 hover:text-green-300 font-semibold transition-all duration-200 hover:underline decoration-green-400 underline-offset-2"
                      >
                        Inicia sesión aquí
                      </button>
                    </p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal; 