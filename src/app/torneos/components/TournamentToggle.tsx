import React, { useState } from 'react';
import { Power, PowerOff } from 'lucide-react';
import { apiService } from '../../shared/services/apiService';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';

interface TournamentToggleProps {
  tournamentId: number;
  tournamentName: string;
  isActive: boolean;
  onToggle?: (newStatus: boolean) => void;
  className?: string;
}

const TournamentToggle: React.FC<TournamentToggleProps> = ({
  tournamentId,
  tournamentName,
  isActive,
  onToggle,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleToggle = async (checked: boolean) => {
    try {
      setLoading(true);

      // Actualizar el estado del torneo usando PUT
      const response = await apiService.put(`Torneos`, {
        Id: tournamentId,
        IsActive: checked
      });

      if (response.success) {
        const statusText = checked ? 'activado' : 'desactivado';
        addNotification(
          `Torneo "${tournamentName}" ${statusText} exitosamente`,
          'success'
        );
        
        // Llamar al callback si existe
        if (onToggle) {
          onToggle(checked);
        }
      } else {
        addNotification(
          `Error al ${checked ? 'activar' : 'desactivar'} el torneo: ${response.message}`,
          'error'
        );
      }
    } catch (error: any) {
      addNotification(
        `Error al ${checked ? 'activar' : 'desactivar'} el torneo: ${error.message || 'Error desconocido'}`,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Icono clickeable */}
      <button
        onClick={() => handleToggle(!isActive)}
        disabled={loading}
        className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center hover:scale-110 transform ${
          isActive 
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={isActive ? 'Desactivar torneo' : 'Activar torneo'}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isActive ? (
          <Power className="w-4 h-4" />
        ) : (
          <PowerOff className="w-4 h-4" />
        )}
      </button>  
    </div>
  );
};

export default TournamentToggle;
