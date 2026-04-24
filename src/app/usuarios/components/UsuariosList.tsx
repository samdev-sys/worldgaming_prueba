import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import { deleteEntidad } from '../../configuracion/service/configuracionService';
import { useNotification } from '../../shared/contexts/NotificationContext';
import { useConfirmation } from '../../shared/contexts/ConfirmationContext';

const UsuariosList: React.FC = () => {
  const { addNotification } = useNotification();
  const { showConfirm } = useConfirmation();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'True':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'False':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleDelete = async (entidadId: number) => {
    try {
      const res = await deleteEntidad(entidadId);
      addNotification(res.message || 'Usuario eliminado', res.success ? 'success' : 'error');
    } catch (e: any) {
      addNotification('Error al eliminar el usuario', 'error');
    }
  };

  const renderCard = (usuario: any) => (
    <div className="bg-card-background backdrop-blur-lg p-6 rounded-2xl border border-border hover:border-text-secondary transition-all duration-300 hover:shadow-xl group flex flex-col h-full relative">
      <button
        className="absolute top-3 right-3 p-2 text-red-400 hover:text-red-600"
        title="Eliminar usuario"
        onClick={async () => {
          const confirmed = await showConfirm({
            title: '¿Eliminar usuario?',
            message: 'Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar'
          });
          if (confirmed) {
            await handleDelete(usuario.entidadId);
          }
        }}
      >
        <TrashIcon className="h-5 w-5" />
      </button>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-primary/10 rounded-xl flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6 text-orange-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-orange-primary transition-colors duration-200">
              {usuario.nombre}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(usuario.activo)}`}>
              {usuario.activo === 'True' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-text-secondary">
          <span className="text-sm">Email: {usuario.correo}</span>
        </div>
        <div className="flex items-center space-x-2 text-text-secondary">
          <span className="text-sm">Rol: {usuario.rol}</span>
        </div>
        <div className="flex items-center space-x-2 text-text-secondary">
          <span className="text-sm">Última conexión: {new Date(usuario.ultimoAcceso).toLocaleDateString('es-ES')}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Link
          to={`/configuracion/usuarios/${usuario.entidadId}`}
          className="w-full bg-background hover:bg-orange-primary/10 text-text-secondary hover:text-orange-primary px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center block"
        >
          Editar
        </Link>
      </div>
    </div>
  );

  const filters = [
    {
      type: 'search' as const,
      key: 'search',
      placeholder: 'Buscar usuarios...'
    },
    {
      type: 'select' as const,
      key: 'e.Activo',
      placeholder: 'Todos',
      options: [
        { value: '1', label: 'Activos' },
        { value: '0', label: 'Inactivos' }
      ]
    }
  ];

  return (
    <>
      <DynamicCardList
        cardFields={[]}
        filters={filters}
        pagination={true}
        itemsPerPageOptions={[6, 12, 24]}
        renderCard={renderCard}
        title="Usuarios"
        subtitle="Gestiona los usuarios del sistema"
        newButtonText="Nuevo Usuario"
        newButtonLink="/configuracion/usuarios/nuevo"
      />
    </>
  );
};

export default UsuariosList;