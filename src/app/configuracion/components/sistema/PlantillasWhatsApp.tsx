import React, { useState, useEffect } from 'react';
import { Card } from '../../../shared/components/ui/Card';
import DynamicForm from '../../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../../shared/interface/IFieldConfig';
import { useNotification } from '../../../shared/contexts/NotificationContext';
import { Plus, Edit, Trash2, X, MessageSquare } from 'lucide-react';

interface PlantillaWhatsApp {
  id: number | null;
  nombre: string;
  mensaje: string;
  tipo: string;
  categoria: string;
  isActive: boolean;
}

const PlantillasWhatsApp: React.FC = () => {
  const [plantillas, setPlantillas] = useState<PlantillaWhatsApp[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<PlantillaWhatsApp | null>(null);
  const { addNotification } = useNotification();

  // Datos de ejemplo
  useEffect(() => {
    setPlantillas([
      {
        id: 1,
        nombre: 'Notificación de Torneo',
        mensaje: '¡Hola! Tu torneo "{nombre_torneo}" comenzará en 30 minutos. ¡Prepárate para la batalla! 🎮',
        tipo: 'text',
        categoria: 'notificacion',
        isActive: true
      },
      {
        id: 2,
        nombre: 'Recordatorio de Partida',
        mensaje: 'Recordatorio: Tu partida del torneo "{nombre_torneo}" está programada para {fecha_hora}. ¡No faltes! ⏰',
        tipo: 'text',
        categoria: 'recordatorio',
        isActive: true
      },
      {
        id: 3,
        nombre: 'Victoria de Torneo',
        mensaje: '¡Felicitaciones! Has ganado el torneo "{nombre_torneo}"! 🏆 Tu premio está siendo procesado.',
        tipo: 'text',
        categoria: 'notificacion',
        isActive: true
      }
    ]);
  }, []);

  const plantillaFields: IFieldConfig[] = [
    { name: 'nombre', label: 'Nombre de la Plantilla', type: 'text', required: true, colSpan: 2, placeholder: 'Notificación de Torneo' },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true, colSpan: 2, placeholder: '¡Hola! Tu torneo comenzará en 30 minutos...' },
    { name: 'tipo', label: 'Tipo', type: 'select', required: true, colSpan: 1, options: [
      { value: 'text', label: 'Texto' },
      { value: 'media', label: 'Multimedia' },
      { value: 'template', label: 'Plantilla' }
    ]},
    { name: 'categoria', label: 'Categoría', type: 'select', required: true, colSpan: 1, options: [
      { value: 'notificacion', label: 'Notificación' },
      { value: 'promocion', label: 'Promoción' },
      { value: 'recordatorio', label: 'Recordatorio' },
      { value: 'sistema', label: 'Sistema' }
    ]},
    { name: 'isActive', label: 'Activa', type: 'checkbox', colSpan: 2 }
  ];

  const handleSavePlantilla = (values: Record<string, any>) => {
    if (editingPlantilla) {
      const updatedPlantillas = plantillas.map(plantilla => 
        plantilla.id === editingPlantilla.id ? { ...plantilla, ...values } : plantilla
      );
      setPlantillas(updatedPlantillas);
      addNotification('Plantilla actualizada exitosamente', 'success');
    } else {
      const newPlantilla: PlantillaWhatsApp = {
        id: null,
        ...values
      } as PlantillaWhatsApp;
      setPlantillas([...plantillas, newPlantilla]);
      addNotification('Plantilla creada exitosamente', 'success');
    }
    setShowForm(false);
    setEditingPlantilla(null);
  };

  const handleEditPlantilla = (plantilla: PlantillaWhatsApp) => {
    setEditingPlantilla(plantilla);
    setShowForm(true);
  };

  const handleDeletePlantilla = (id: number | null) => {
    setPlantillas(plantillas.filter(plantilla => plantilla.id !== id));
    addNotification('Plantilla eliminada exitosamente', 'success');
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'notificacion': return 'bg-blue-100 text-blue-800';
      case 'promocion': return 'bg-green-100 text-green-800';
      case 'recordatorio': return 'bg-yellow-100 text-yellow-800';
      case 'sistema': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'text': return 'bg-gray-100 text-gray-800';
      case 'media': return 'bg-orange-100 text-orange-800';
      case 'template': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Plantillas de WhatsApp</h2>
          <p className="text-text-secondary text-sm mt-1">
            Gestiona las plantillas de mensajes para WhatsApp Business
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Plantilla</span>
        </button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-text-primary">
              {editingPlantilla ? 'Editar Plantilla' : 'Nueva Plantilla'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingPlantilla(null);
              }}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DynamicForm
            fields={plantillaFields as any}
            initialValues={editingPlantilla || {}}
            onSubmit={handleSavePlantilla}
            submitText={editingPlantilla ? 'Actualizar' : 'Crear'}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {plantillas.map((plantilla) => (
          <Card key={plantilla.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary">{plantilla.nombre}</h4>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-3">
                    {plantilla.mensaje}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <span className={`px-2 py-1 rounded text-xs ${getCategoriaColor(plantilla.categoria)}`}>
                      {plantilla.categoria}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getTipoColor(plantilla.tipo)}`}>
                      {plantilla.tipo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => handleEditPlantilla(plantilla)}
                  className="p-1 text-blue-500 hover:text-blue-700"
                  title="Editar plantilla"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeletePlantilla(plantilla.id)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Eliminar plantilla"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {plantillas.length === 0 && (
        <Card className="p-8 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No hay plantillas</h3>
          <p className="text-text-secondary mb-4">
            Crea tu primera plantilla de WhatsApp para comenzar a enviar mensajes automáticos.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Crear Primera Plantilla
          </button>
        </Card>
      )}
    </div>
  );
};

export default PlantillasWhatsApp;
