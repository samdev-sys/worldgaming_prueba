import { useState } from 'react';
import { apiService } from '../../shared/services/apiService';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';

interface UseTournamentToggleProps {
  onSuccess?: (tournamentId: number, newStatus: boolean) => void;
  onError?: (error: string) => void;
}

export const useTournamentToggle = ({ onSuccess, onError }: UseTournamentToggleProps = {}) => {
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const { addNotification } = useNotification();

  const toggleTournament = async (tournamentId: number, tournamentName: string, currentStatus: boolean) => {
    try {
      setLoading(prev => ({ ...prev, [tournamentId]: true }));

      const newStatus = !currentStatus;
      
      // Actualizar el estado del torneo usando PUT
      const response = await apiService.put(`Torneos/${tournamentId}`, {
        Id: tournamentId,
        IsActive: newStatus
      });

      if (response.success) {
        const statusText = newStatus ? 'activado' : 'desactivado';
        addNotification(
          `Torneo "${tournamentName}" ${statusText} exitosamente`,
          'success'
        );
        
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess(tournamentId, newStatus);
        }
        
        return newStatus;
      } else {
        const errorMessage = `Error al ${newStatus ? 'activar' : 'desactivar'} el torneo: ${response.message}`;
        addNotification(errorMessage, 'error');
        
        if (onError) {
          onError(errorMessage);
        }
        
        return currentStatus; // Mantener el estado actual
      }
    } catch (error: any) {
      const errorMessage = `Error al ${!currentStatus ? 'activar' : 'desactivar'} el torneo: ${error.message || 'Error desconocido'}`;
      addNotification(errorMessage, 'error');
      
      if (onError) {
        onError(errorMessage);
      }
      
      return currentStatus; // Mantener el estado actual
    } finally {
      setLoading(prev => ({ ...prev, [tournamentId]: false }));
    }
  };

  const isTournamentLoading = (tournamentId: number) => {
    return loading[tournamentId] || false;
  };

  return {
    toggleTournament,
    isTournamentLoading
  };
};
