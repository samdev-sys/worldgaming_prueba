import React, { useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { User, Lock, Settings } from 'lucide-react';
import DynamicForm from '../../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../../shared/interface/IFieldConfig';
import { useNotification } from '../../../shared/contexts/NotificationContext';

const tabs = [
  { key: 'personal', label: 'Datos personales', icon: <User className="h-5 w-5 mr-2" /> },
  { key: 'security', label: 'Seguridad', icon: <Lock className="h-5 w-5 mr-2" /> },
  { key: 'preferences', label: 'Preferencias', icon: <Settings className="h-5 w-5 mr-2" /> },
];

const Perfil: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addNotification } = useNotification();

  // Configuración de campos para cada tab
  const personalFields: IFieldConfig[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, colSpan: 1 },
    { name: 'apellidos', label: 'Apellidos', type: 'text', required: true, colSpan: 1 },
    { name: 'correo', label: 'Correo electrónico', type: 'email', required: true, colSpan: 2 },
  ];
  const securityFields: IFieldConfig[] = [
    { name: 'password', label: 'Contraseña actual', type: 'password', required: true, colSpan: 2 },
    { name: 'newPassword', label: 'Nueva contraseña', type: 'password', required: true, colSpan: 1 },
    { name: 'confirmPassword', label: 'Confirmar nueva contraseña', type: 'password', required: true, colSpan: 1 },
  ];
  const preferencesFields: IFieldConfig[] = [
    {
      name: 'theme', label: 'Tema', type: 'select', required: true, colSpan: 1, options: [
        { value: 'light', label: 'Claro' },
        { value: 'dark', label: 'Oscuro' },
      ]
    },
    {
      name: 'notifications', label: 'Recibir notificaciones', type: 'select', required: true, colSpan: 1, options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' },
      ]
    },
    {
      name: 'idioma', label: 'Idioma', type: 'select', required: true, colSpan: 2, options: [
        { value: 'es', label: 'Español' },
        { value: 'en', label: 'Inglés' },
      ]
    },
  ];

  // Valores iniciales
  const initialPersonal = {
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    correo: user?.correo || '',
  };
  const initialSecurity = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  };
  const initialPreferences = {
    theme: 'light',
    notifications: 'true',
    idioma: 'es',
  };

  // Lógica para seleccionar y previsualizar avatar
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validaciones
      const maxSizeMB = 2;
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (file.size > maxSizeMB * 1024 * 1024) {
        addNotification('El archivo es demasiado grande. Máximo 2MB.', 'error');
        return;
      }
      if (!validTypes.includes(file.type)) {
        addNotification('Tipo de archivo no soportado. Solo JPG, PNG o WEBP.', 'error');
        return;
      }
      // Simular llamada a la API
      addNotification('Subiendo imagen de perfil...', 'info');
      setTimeout(() => {
        // Simulación exitosa
        const reader = new FileReader();
        reader.onload = (ev) => {
          setAvatarPreview(ev.target?.result as string);
          addNotification('¡Avatar actualizado exitosamente!', 'success');
        };
        reader.readAsDataURL(file);
      }, 1200);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <div className="flex flex-col items-center md:items-start">
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-4xl font-bold mb-2 cursor-pointer relative group hover:scale-105 transition-transform duration-200" onClick={handleAvatarClick}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              user?.nombre?.[0] || 'U'
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />
            <span className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 shadow-lg group-hover:scale-110 transition-transform border border-white/30">
              <User className="h-5 w-5 text-white" />
            </span>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{user?.nombre} {user?.apellidos}</h2>
            <p className="text-white/80 text-sm">{user?.correo}</p>
            <p className="text-white/60 text-xs mt-1">Rol: <span className="font-semibold text-white/90">{user?.rol}</span></p>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-white/10 backdrop-blur-sm text-white/80 border border-white/20 hover:bg-white/15 hover:text-white hover:scale-105'
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'personal' && (
          <DynamicForm
            fields={personalFields as any}
            initialValues={initialPersonal}
            onSubmit={handleSave}
            submitText={saving ? 'Guardando...' : 'Guardar cambios'}
          />
        )}
        {activeTab === 'security' && (
          <DynamicForm
            fields={securityFields as any}
            initialValues={initialSecurity}
            onSubmit={handleSave}
            submitText={saving ? 'Guardando...' : 'Guardar cambios'}
          />
        )}
        {activeTab === 'preferences' && (
          <DynamicForm
            fields={preferencesFields as any}
            initialValues={initialPreferences}
            onSubmit={handleSave}
            submitText={saving ? 'Guardando...' : 'Guardar cambios'}
          />
        )}
      </div>
      {success && (
        <div className="mt-4 text-green-400 text-center font-medium bg-green-500/10 backdrop-blur-sm rounded-lg p-3 border border-green-500/20">
          ¡Cambios guardados exitosamente!
        </div>
      )}
    </div>
  );
};

export default Perfil; 