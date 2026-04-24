import React, { useState, useEffect } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import DynamicForm from '../../../shared/components/ui/DynamicForm';
import DynamicCardList from '../../../shared/components/ui/DynamicCardList';
import { IFieldConfig } from '../../../shared/interface/IFieldConfig';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { 
  Trophy, 
  Award, 
  MessageSquare, 
  Mail, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  X,
  FileText,
  Sparkles,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Clock
} from 'lucide-react';

interface Logro {
  id: number | null;
  nombre: string;
  descripcion: string;
  icon: string;
  categoria: string;
  rareza: string;
  puntos: number;
  requisitos: string;
  isActive: boolean;
}

interface Insignia {
  id: number;
  nombre: string;
  descripcion: string;
  icon: string;
  tier: string;
  isActive: boolean;
}

interface ConfiguracionWhatsApp {
  tokenAcceso: string;
  numeroTelefono: string;
  nombreNegocio: string;
  isActive: boolean;
}

interface ConfiguracionEmail {
  servidorSMTP: string;
  puerto: number;
  usuario: string;
  password: string;
  isActive: boolean;
}

const ConfiguracionSistema: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logros' | 'insignias' | 'whatsapp' | 'email'>('logros');
  const [activeSubTab, setActiveSubTab] = useState<'api' | 'plantillas'>('api');
  const [logros, setLogros] = useState<Logro[]>([]);
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [showLogroForm, setShowLogroForm] = useState(false);
  const [showInsigniaForm, setShowInsigniaForm] = useState(false);
  const [editingLogro, setEditingLogro] = useState<Logro | null>(null);
  const [editingInsignia, setEditingInsignia] = useState<Insignia | null>(null);
  const [formLogroValues, setFormLogroValues] = useState<Partial<Logro>>({});
  const [formInsigniaValues, setFormInsigniaValues] = useState<Partial<Insignia>>({});
  const [requisitosList, setRequisitosList] = useState<string[]>([]);
  const [nuevoRequisito, setNuevoRequisito] = useState('');
  const { addNotification } = useNotification();

  // Configuraciones iniciales
  const [configWhatsApp, setConfigWhatsApp] = useState<ConfiguracionWhatsApp>({
    tokenAcceso: '',
    numeroTelefono: '',
    nombreNegocio: '',
    isActive: false
  });

  const [configEmail, setConfigEmail] = useState<ConfiguracionEmail>({
    servidorSMTP: '',
    puerto: 587,
    usuario: '',
    password: '',
    isActive: false
  });

  // Datos de ejemplo
  useEffect(() => {
    setLogros([
      {
        id: 1,
        nombre: 'Primera Victoria',
        descripcion: 'Gana tu primer torneo',
        icon: '🏆',
        categoria: 'tournament',
        rareza: 'common',
        puntos: 50,
        requisitos: '["Ganar 1 torneo"]',
        isActive: true
      },
      {
        id: 2,
        nombre: 'Campeón Invicto',
        descripcion: 'Gana 10 torneos sin perder',
        icon: '👑',
        categoria: 'tournament',
        rareza: 'legendary',
        puntos: 500,
        requisitos: '["Ganar 10 torneos consecutivos"]',
        isActive: true
      },
      {
        id: 3,
        nombre: 'Estratega Maestro',
        descripcion: 'Participa en 50 torneos',
        icon: '🎯',
        categoria: 'participation',
        rareza: 'epic',
        puntos: 200,
        requisitos: '["Participar en 50 torneos"]',
        isActive: true
      }
    ]);

    setInsignias([
      {
        id: 1,
        nombre: 'Novato',
        descripcion: 'Completa tu primer torneo',
        icon: '🥉',
        tier: 'bronze',
        isActive: true
      },
      {
        id: 2,
        nombre: 'Competidor',
        descripcion: 'Participa en 25 torneos',
        icon: '🥈',
        tier: 'silver',
        isActive: true
      },
      {
        id: 3,
        nombre: 'Veterano',
        descripcion: 'Participa en 100 torneos',
        icon: '🥇',
        tier: 'gold',
        isActive: true
      }
    ]);
  }, []);

  // Campos para formulario de logros
  const logroFields: IFieldConfig[] = [
    { name: 'nombre', label: 'Nombre del Logro', type: 'text', required: true, colSpan: 2 },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, colSpan: 2 },
    { name: 'icon', label: 'Icono (emoji)', type: 'text', required: true, colSpan: 1, placeholder: '🏆' },
    { name: 'categoria', label: 'Categoría', type: 'select', required: true, colSpan: 1, options: [
      { value: 'tournament', label: 'Torneo' },
      { value: 'participation', label: 'Participación' },
      { value: 'social', label: 'Social' },
      { value: 'skill', label: 'Habilidad' },
      { value: 'special', label: 'Especial' }
    ]},
    { name: 'rareza', label: 'Rareza', type: 'select', required: true, colSpan: 1, options: [
      { value: 'common', label: 'Común' },
      { value: 'rare', label: 'Raro' },
      { value: 'epic', label: 'Épico' },
      { value: 'legendary', label: 'Legendario' }
    ]},
    { name: 'puntos', label: 'Puntos', type: 'number', required: true, colSpan: 1 },
    { name: 'requisitos', label: 'Requisitos', type: 'requirements', required: true, colSpan: 2, requirementsConfig: {
      title: 'Requisitos del Logro',
      subtitle: 'Agrega los requisitos que debe cumplir el jugador para obtener este logro',
      placeholder: 'Ej: Ganar 1 torneo',
      maxHeight: 'max-h-40'
    }},
    { name: 'isActive', label: 'Activo', type: 'checkbox', colSpan: 2 }
  ];

  // Campos para formulario de insignias
  const insigniaFields: IFieldConfig[] = [
    { name: 'nombre', label: 'Nombre de la Insignia', type: 'text', required: true, colSpan: 2 },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true, colSpan: 2 },
    { name: 'icon', label: 'Icono (emoji)', type: 'text', required: true, colSpan: 1, placeholder: '🥉' },
    { name: 'tier', label: 'Tier', type: 'select', required: true, colSpan: 1, options: [
      { value: 'bronze', label: 'Bronce' },
      { value: 'silver', label: 'Plata' },
      { value: 'gold', label: 'Oro' },
      { value: 'platinum', label: 'Platino' },
      { value: 'diamond', label: 'Diamante' }
    ]},
    { name: 'isActive', label: 'Activo', type: 'checkbox', colSpan: 2 }
  ];

  // Campos para configuración de WhatsApp
  const whatsappFields: IFieldConfig[] = [
    { name: 'tokenAcceso', label: 'Token de Acceso', type: 'password', required: true, colSpan: 2, placeholder: 'Ingresa el token de WhatsApp Business API' },
    { name: 'numeroTelefono', label: 'Número de Teléfono', type: 'text', required: true, colSpan: 1, placeholder: '+1234567890' },
    { name: 'nombreNegocio', label: 'Nombre del Negocio', type: 'text', required: true, colSpan: 1, placeholder: 'World Gaming' },
    { name: 'isActive', label: 'Activar WhatsApp', type: 'checkbox', colSpan: 2 }
  ];

  // Campos para configuración de Email
  const emailFields: IFieldConfig[] = [
    { name: 'servidorSMTP', label: 'Servidor SMTP', type: 'text', required: true, colSpan: 2, placeholder: 'smtp.gmail.com' },
    { name: 'puerto', label: 'Puerto', type: 'number', required: true, colSpan: 1, placeholder: '587' },
    { name: 'usuario', label: 'Usuario', type: 'email', required: true, colSpan: 1, placeholder: 'tu@email.com' },
    { name: 'password', label: 'Contraseña', type: 'password', required: true, colSpan: 2, placeholder: 'Contraseña de aplicación' },
    { name: 'isActive', label: 'Activar Email', type: 'checkbox', colSpan: 2 }
  ];

  // Handlers para logros
  const handleSaveLogro = (values: Record<string, any>) => {
    const logroData = {
      ...values,
      requisitos: JSON.stringify(requisitosList)
    };

    if (editingLogro) {
      const updatedLogros = logros.map(logro => 
        logro.id === editingLogro.id ? { ...logro, ...logroData } : logro
      );
      setLogros(updatedLogros);
      addNotification('Logro actualizado exitosamente', 'success');
    } else {
      const newLogro: Logro = {
        id: Date.now(),
        ...logroData
      } as Logro;
      setLogros([...logros, newLogro]);
      addNotification('Logro creado exitosamente', 'success');
    }
    setShowLogroForm(false);
    setEditingLogro(null);
    setFormLogroValues({});
    setRequisitosList([]);
  };

  const handleAddRequisito = () => {
    if (nuevoRequisito.trim()) {
      setRequisitosList([...requisitosList, nuevoRequisito.trim()]);
      setNuevoRequisito('');
    }
  };

  const handleRemoveRequisito = (index: number) => {
    setRequisitosList(requisitosList.filter((_, i) => i !== index));
  };

  const handleEditLogro = (logro: Logro) => {
    setEditingLogro(logro);
    setFormLogroValues(logro);
    
    // Parsear requisitos JSON a array
    try {
      const requisitos = logro.requisitos ? JSON.parse(logro.requisitos) : [];
      setRequisitosList(Array.isArray(requisitos) ? requisitos : []);
    } catch {
      setRequisitosList([]);
    }
    setShowLogroForm(true);
  };



  const handleDeleteLogro = (id: number | null) => {
    setLogros(logros.filter(logro => logro.id !== id));
    addNotification('Logro eliminado exitosamente', 'success');
  };

  // Handlers para insignias
  const handleSaveInsignia = (values: Record<string, any>) => {
    if (editingInsignia) {
      const updatedInsignias = insignias.map(insignia => 
        insignia.id === editingInsignia.id ? { ...insignia, ...values } : insignia
      );
      setInsignias(updatedInsignias);
      addNotification('Insignia actualizada exitosamente', 'success');
    } else {
      const newInsignia: Insignia = {
        id: Date.now(),
        ...values
      } as Insignia;
      setInsignias([...insignias, newInsignia]);
      addNotification('Insignia creada exitosamente', 'success');
    }
    setShowInsigniaForm(false);
    setEditingInsignia(null);
    setFormInsigniaValues({});
  };

  const handleEditInsignia = (insignia: Insignia) => {
    setEditingInsignia(insignia);
    setFormInsigniaValues(insignia);
    setShowInsigniaForm(true);
  };

  const handleDeleteInsignia = (id: number) => {
    setInsignias(insignias.filter(insignia => insignia.id !== id));
    addNotification('Insignia eliminada exitosamente', 'success');
  };

  // Handlers para configuraciones
  const handleSaveWhatsApp = (values: Record<string, any>) => {
    setConfigWhatsApp(values as ConfiguracionWhatsApp);
    addNotification('Configuración de WhatsApp guardada', 'success');
  };

  const handleSaveEmail = (values: Record<string, any>) => {
    setConfigEmail(values as ConfiguracionEmail);
    addNotification('Configuración de Email guardada', 'success');
  };

  const tabs = [
    { 
      key: 'logros', 
      label: 'Logros', 
      icon: <Trophy className="h-5 w-5" />,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      description: 'Gestiona los logros del sistema'
    },
    { 
      key: 'insignias', 
      label: 'Insignias', 
      icon: <Award className="h-5 w-5" />,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
      description: 'Administra las insignias disponibles'
    },
    { 
      key: 'whatsapp', 
      label: 'WhatsApp', 
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'from-green-400 to-teal-500',
      bgColor: 'bg-gradient-to-r from-green-400 to-teal-500',
      description: 'Configura la API y plantillas de WhatsApp'
    },
    { 
      key: 'email', 
      label: 'Email', 
      icon: <Mail className="h-5 w-5" />,
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-gradient-to-r from-red-400 to-pink-500',
      description: 'Configura el servidor y plantillas de email'
    }
  ];

  const getRarezaColor = (rareza: string) => {
    switch (rareza) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-green-500 to-blue-500 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'platinum': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default: return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    }
  };

  return (
    <div className="min-h-screen">
             {/* Header transparente */}
       <div className="relative overflow-hidden">
         <div className="relative px-6 py-8">
           <div className="flex items-center space-x-4">
             <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
               <Settings className="h-8 w-8 text-white" />
             </div>
             <div>
               <h1 className="text-4xl font-bold text-white mb-2">Configuración del Sistema</h1>
               <p className="text-white/80 text-lg">Administra logros, insignias y configuraciones de comunicación</p>
             </div>
           </div>
         </div>
       </div>

      <div className="px-6 py-8">
        {/* Tabs mejorados */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`group relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.key
                    ? `${tab.bgColor} text-white shadow-lg transform scale-105`
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === tab.key ? 'bg-white/20' : 'bg-white/10'}`}>
                  {tab.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className={`text-xs ${activeTab === tab.key ? 'text-white/80' : 'text-white/50'}`}>
                    {tab.description}
                  </div>
                </div>
                {activeTab === tab.key && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de Logros */}
        {activeTab === 'logros' && (
          <div className="space-y-8">
            {/* Formulario flotante */}
            {showLogroForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl bg-gray-900 border border-gray-700 shadow-2xl max-h-[90vh] overflow-hidden">
                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {editingLogro ? 'Editar Logro' : 'Nuevo Logro'}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowLogroForm(false);
                          setEditingLogro(null);
                          setFormLogroValues({});
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <DynamicForm
                      fields={logroFields as any}
                      initialValues={formLogroValues}
                      onSubmit={handleSaveLogro}
                      submitText={editingLogro ? 'Actualizar' : 'Crear'}
                      requirementsData={{ requisitos: requisitosList }}
                      onRequirementsChange={(fieldName, requirements) => {
                        setRequisitosList(requirements);
                      }}
                    />
                  </div>
                </Card>
              </div>
            )}

            <DynamicCardList
              data={logros}
              title="Gestión de Logros"
              subtitle="Crea y administra los logros del sistema"
              newButtonText="Nuevo Logro"
              onNew={() => setShowLogroForm(true)}
              itemsPerPageOptions={[9, 18, 27]}
              filters={[
                { type: 'search', key: 'nombre', placeholder: 'Buscar logros...' },
                { 
                  type: 'select', 
                  key: 'categoria', 
                  placeholder: 'Todas las categorías',
                  options: [
                    { value: 'tournament', label: 'Torneo' },
                    { value: 'participation', label: 'Participación' },
                    { value: 'social', label: 'Social' },
                    { value: 'skill', label: 'Habilidad' },
                    { value: 'special', label: 'Especial' }
                  ]
                },
                { 
                  type: 'select', 
                  key: 'rareza', 
                  placeholder: 'Todas las rarezas',
                  options: [
                    { value: 'common', label: 'Común' },
                    { value: 'rare', label: 'Raro' },
                    { value: 'epic', label: 'Épico' },
                    { value: 'legendary', label: 'Legendario' }
                  ]
                }
              ]}
              renderCard={(logro) => (
                <Card className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="relative p-6">
                    {/* Header con trofeo y acciones */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="text-2xl">{logro.icon}</div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {logro.rareza === 'legendary' ? 'L' : logro.rareza === 'epic' ? 'E' : logro.rareza === 'rare' ? 'R' : 'C'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg uppercase tracking-wide">{logro.nombre}</h4>
                          <p className="text-white/70 text-sm mt-1">{logro.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditLogro(logro)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLogro(logro.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Badges de rareza y puntos */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRarezaColor(logro.rareza)}`}>
                        {logro.rareza}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-xs font-semibold">
                        {logro.puntos} pts
                      </span>
                    </div>

                    {/* Requisitos */}
                    <div className="mb-3">
                      <div className="text-xs text-white/60 mb-1">Requisitos:</div>
                      <div className="space-y-1">
                        {(() => {
                          try {
                            const requisitos = logro.requisitos ? JSON.parse(logro.requisitos) : [];
                            return Array.isArray(requisitos) ? requisitos.slice(0, 2).map((req, index) => (
                              <div key={index} className="text-xs text-white/80 bg-white/5 rounded px-2 py-1">
                                • {req}
                              </div>
                            )) : null;
                          } catch {
                            return <div className="text-xs text-white/60">Sin requisitos</div>;
                          }
                        })()}
                        {(() => {
                          try {
                            const requisitos = logro.requisitos ? JSON.parse(logro.requisitos) : [];
                            return Array.isArray(requisitos) && requisitos.length > 2 ? (
                              <div className="text-xs text-white/60">
                                +{requisitos.length - 2} más...
                              </div>
                            ) : null;
                          } catch {
                            return null;
                          }
                        })()}
                      </div>
                    </div>

                    {/* Categoría y estado */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70 capitalize">{logro.categoria}</span>
                      <div className="flex items-center space-x-2">
                        {logro.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white/80 font-medium">{logro.isActive ? 'Activo' : 'Inactivo'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              emptyMessage="No hay logros configurados"
              emptyIcon={Trophy}
              className="max-w-7xl mx-auto"
            />
          </div>
        )}

                {/* Contenido de Insignias */}
        {activeTab === 'insignias' && (
          <div className="space-y-8">
            {/* Formulario flotante */}
            {showInsigniaForm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-4xl bg-gray-900 border border-gray-700 shadow-2xl max-h-[90vh] overflow-hidden">
                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {editingInsignia ? 'Editar Insignia' : 'Nueva Insignia'}
                        </h3>
                      </div>
                       <button
                         onClick={() => {
                           setShowInsigniaForm(false);
                           setEditingInsignia(null);
                           setFormInsigniaValues({});
                         }}
                         className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                       >
                         <X className="h-6 w-6" />
                       </button>
                     </div>
                     <DynamicForm
                       fields={insigniaFields as any}
                       initialValues={formInsigniaValues}
                       onSubmit={handleSaveInsignia}
                       submitText={editingInsignia ? 'Actualizar' : 'Crear'}
                     />
                  </div>
                </Card>
              </div>
            )}

            <DynamicCardList
              data={insignias}
              title="Gestión de Insignias"
              subtitle="Crea y administra las insignias del sistema"
              newButtonText="Nueva Insignia"
              onNew={() => setShowInsigniaForm(true)}
              itemsPerPageOptions={[9, 18, 27]}
              filters={[
                { type: 'search', key: 'nombre', placeholder: 'Buscar insignias...' },
                { 
                  type: 'select', 
                  key: 'tier', 
                  placeholder: 'Todos los tiers',
                  options: [
                    { value: 'bronze', label: 'Bronce' },
                    { value: 'silver', label: 'Plata' },
                    { value: 'gold', label: 'Oro' },
                    { value: 'platinum', label: 'Platino' },
                    { value: 'diamond', label: 'Diamante' }
                  ]
                }
              ]}
              renderCard={(insignia) => (
                <Card className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="relative p-6">
                    {/* Header con medalla y acciones */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <div className="text-2xl">{insignia.icon}</div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {insignia.tier === 'bronze' ? '3' : insignia.tier === 'silver' ? '2' : '1'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-lg uppercase tracking-wide">{insignia.nombre}</h4>
                          <p className="text-white/70 text-sm mt-1">{insignia.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditInsignia(insignia)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInsignia(insignia.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Tier badge */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getTierColor(insignia.tier)}`}>
                        {insignia.tier}
                      </span>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center justify-end">
                      <div className="flex items-center space-x-2 text-sm">
                        {insignia.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white/80 font-medium">{insignia.isActive ? 'Activo' : 'Inactivo'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              emptyMessage="No hay insignias configuradas"
              emptyIcon={Award}
              className="max-w-7xl mx-auto"
            />
          </div>
        )}

        {/* Contenido de WhatsApp */}
        {activeTab === 'whatsapp' && (
          <div className="max-w-7nxl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Configuración de WhatsApp Business</h2>
                <p className="text-white/60">Configura la integración con WhatsApp Business API</p>
              </div>
            </div>

            {/* Subtabs para WhatsApp */}
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-2 mb-6">
              <button
                onClick={() => setActiveSubTab('api')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSubTab === 'api'
                    ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span>API</span>
              </button>
              <button
                onClick={() => setActiveSubTab('plantillas')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSubTab === 'plantillas'
                    ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Plantillas</span>
              </button>
            </div>

            {/* Contenido de API WhatsApp */}
            {activeSubTab === 'api' && (
              <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">API de WhatsApp Business</h3>
                    </div>
                    <p className="text-white/70">
                      Configura la integración con WhatsApp Business API para enviar notificaciones automáticas.
                    </p>
                  </div>
                  <DynamicForm
                    fields={whatsappFields as any}
                    initialValues={configWhatsApp}
                    onSubmit={handleSaveWhatsApp}
                    submitText="Guardar Configuración"
                  />
                </div>
              </Card>
            )}

            {/* Contenido de Plantillas WhatsApp */}
            {activeSubTab === 'plantillas' && (
              <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
                <div className="p-6">
                  <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-xl p-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-400/20 rounded-lg">
                        <Info className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-yellow-300 mb-1">
                          Información Importante
                        </h3>
                        <p className="text-yellow-200/80 text-sm">
                          Las plantillas de WhatsApp deben ser aprobadas por Meta antes de poder ser utilizadas. 
                          Asegúrate de que tus mensajes cumplan con las políticas de WhatsApp Business.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mb-4">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Gestión de Plantillas</h3>
                    <p className="text-white/70 mb-4 max-w-sm mx-auto text-sm">
                      Aquí podrás gestionar las plantillas de mensajes para WhatsApp Business.
                    </p>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full">
                      <Clock className="h-3 w-3 text-white/60" />
                      <span className="text-white/60 text-xs">Esta funcionalidad estará disponible próximamente</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Contenido de Email */}
        {activeTab === 'email' && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Configuración de Email</h2>
                <p className="text-white/60">Configura el servidor de correo electrónico</p>
              </div>
            </div>

            {/* Subtabs para Email */}
            <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <button
                onClick={() => setActiveSubTab('api')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSubTab === 'api'
                    ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Servidor SMTP</span>
              </button>
              <button
                onClick={() => setActiveSubTab('plantillas')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeSubTab === 'plantillas'
                    ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Plantilla de Envío</span>
              </button>
            </div>

            {/* Contenido de Servidor SMTP */}
            {activeSubTab === 'api' && (
              <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Servidor SMTP</h3>
                    </div>
                    <p className="text-white/70">
                      Configura el servidor de correo electrónico para enviar notificaciones por email.
                    </p>
                  </div>
                  <DynamicForm
                    fields={emailFields as any}
                    initialValues={configEmail}
                    onSubmit={handleSaveEmail}
                    submitText="Guardar Configuración"
                  />
                </div>
              </Card>
            )}

            {/* Contenido de Plantilla de Envío */}
            {activeSubTab === 'plantillas' && (
              <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Plantilla de Envío</h3>
                    </div>
                    <p className="text-white/70">
                      Configura las plantillas de email para diferentes tipos de notificaciones.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Variables disponibles */}
                    <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-400/20 rounded-lg">
                          <Info className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-blue-300 mb-2">
                            Variables Disponibles
                          </h4>
                          <p className="text-blue-200/80 mb-4">
                            Puedes usar estas variables en tus plantillas de email:
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {[
                              '{{nombre}}', '{{apellidos}}', '{{correo}}', 
                              '{{equipo}}', '{{torneo}}', '{{fecha}}',
                              '{{puntos}}', '{{ranking}}', '{{logro}}'
                            ].map((variable) => (
                              <code key={variable} className="px-2 py-1 bg-blue-400/20 text-blue-300 rounded text-sm font-mono">
                                {variable}
                              </code>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Formulario de plantilla */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Asunto del Email *
                        </label>
                        <input
                          type="text"
                          placeholder="¡Bienvenido a World Gaming, {{nombre}}!"
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-red-400 transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Contenido del Email *
                        </label>
                        <textarea
                          rows={8}
                          placeholder="Hola {{nombre}},\n\nGracias por unirte a World Gaming..."
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-red-400 transition-all duration-200 resize-none"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="html-email"
                          className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <label htmlFor="html-email" className="text-white text-sm">
                          Permitir HTML en el contenido
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-pink-600 transition-all duration-200">
                        Guardar Plantilla
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracionSistema;
