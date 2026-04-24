import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJuegos } from './useJuegos';
import { apiService } from '../../shared/services/apiService';
// import { dynamicService } from '../../shared/services/dynamicService';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';
import { Torneo } from './useTorneos';
import { TournamentMapper } from '../mappers';
import { 
  TOURNAMENT_DIFFICULTY, 
  TOURNAMENT_STATUS 
} from '../../shared/constants/tournament';
import { convertFileToBase64, createFileUploadHandler } from '../../shared/utils';

export interface TournamentForm {
  name: string;
  game: string;
  description: string;
  difficulty: typeof TOURNAMENT_DIFFICULTY[keyof typeof TOURNAMENT_DIFFICULTY];
  maxParticipants: number;
  cantidadEquipos: number;
  entryFee: number;
  prize: string;
  startDate: string;
  endDate: string;
  status: typeof TOURNAMENT_STATUS[keyof typeof TOURNAMENT_STATUS];
  image?: File;
  rules: string[];
  isActive: boolean;
  titulares: number;
  suplentes: number;
}

export const useCrearTorneo = () => {
  const { loading: loadingJuegos, error: juegosError, getJuegoOptions } = useJuegos();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Determinar si es modo edición
  const isEditMode = Boolean(id);
  const tournamentId = id ? parseInt(id) : null;

  const tournamentMapper = new TournamentMapper();
  const [formData, setFormData] = useState<TournamentForm>(tournamentMapper.getInitialData());

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTournament, setLoadingTournament] = useState(false);
  const [tournamentError, setTournamentError] = useState<string | null>(null);

  const calculateMaxParticipants = (equipos: number, titulares: number) => {
    return tournamentMapper.calculateMaxParticipants(equipos, titulares);
  };

  const handleInputChange = (field: keyof TournamentForm, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      if (field === 'titulares' || field === 'cantidadEquipos') {
        newData.maxParticipants = calculateMaxParticipants(
          field === 'cantidadEquipos' ? value : prev.cantidadEquipos,
          field === 'titulares' ? value : prev.titulares
        );
      }
      
      return newData;
    });
  };

  const handleAddRule = () => {
    if (newRule.trim()) {
      const rulesToAdd = newRule
        .split(',')
        .map(rule => rule.trim())
        .filter(rule => rule.length > 0);

      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, ...rulesToAdd]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRule();
    }
  };

  const handleImageUpload = createFileUploadHandler(
    {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    (file, base64) => {
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, image: file }));
    },
    (error) => {
      addNotification(error, 'error');
    }
  );

  const handleFormValuesChange = useCallback((values: Record<string, any>) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        name: values['name'] !== undefined ? values['name'] : prev.name,
        game: values['game'] !== undefined ? values['game'] : prev.game,
        description: values['description'] !== undefined ? values['description'] : prev.description,
        difficulty: values['difficulty'] !== undefined ? values['difficulty'] : prev.difficulty,
        status: values['status'] !== undefined ? values['status'] : prev.status,
        cantidadEquipos: values['cantidadEquipos'] !== undefined ? values['cantidadEquipos'] : prev.cantidadEquipos,
        entryFee: values['entryFee'] !== undefined ? values['entryFee'] : prev.entryFee,
        prize: values['prize'] !== undefined ? values['prize'] : prev.prize,
        startDate: values['startDate'] !== undefined ? values['startDate'] : prev.startDate,
        endDate: values['endDate'] !== undefined ? values['endDate'] : prev.endDate,
        isActive: values['isActive'] !== undefined ? values['isActive'] : prev.isActive
      };
      
      // Recalcular maxParticipants solo si cantidadEquipos cambió
      if (values['cantidadEquipos'] !== undefined) {
        newData.maxParticipants = calculateMaxParticipants(values['cantidadEquipos'], prev.titulares);
      } else {
        newData.maxParticipants = prev.maxParticipants;
      }
      
      // Solo actualizar si realmente hay cambios
      const hasChanges = Object.keys(newData).some(key => 
        newData[key as keyof typeof newData] !== prev[key as keyof typeof prev]
      );
      
      return hasChanges ? newData : prev;
    });
  }, []);

  const loadTournament = async (tournamentId: number) => {
    try {
      setLoadingTournament(true);
      setTournamentError(null);
      
      const response = await apiService.get(`Torneos/${tournamentId}`);
      
      if (response.success && response.data) {
        const tournament: Torneo = response.data;
        
        try {
          // Usar el mapper para convertir los datos del torneo al formulario
          const formData = tournamentMapper.toFormData(tournament);
          setFormData(formData);

          // Establecer preview de imagen si existe
          if (tournament.imagen) {
            setImagePreview(tournament.imagen);
          }
        } catch (mapperError: any) {
          setTournamentError('Error al procesar los datos del torneo: ' + mapperError.message);
        }
      } else {
        setTournamentError('No se encontró el torneo con el ID especificado');
      }
    } catch (error: any) {
      setTournamentError('Error al cargar el torneo: ' + error.message);
    } finally {
      setLoadingTournament(false);
    }
  };

  const handleSubmitTournament = async () => {
    
    try {
      setIsSubmitting(true);
      const validation = tournamentMapper.validateFormData(formData);
      
      if (!validation.isValid) {
        addNotification(`Errores de validación: ${validation.errors.join(', ')}`, 'error');
        return;
      }
      
      const imageBase64 = formData.image ? await convertFileToBase64(formData.image) : imagePreview;
      
      // Usar el mapper para convertir los datos del formulario a la API
      const tournamentData = tournamentMapper.toApiData(formData, { imageBase64: imageBase64 || undefined });

      if (isEditMode && tournamentId) {
        const response = await apiService.put(`Torneos`, tournamentData);
        if (response.success) {
          addNotification(`¡Torneo "${formData.name}" actualizado exitosamente!`, 'success');
          navigate('/worldGaming/torneos');
        } else {
          // Manejar errores de validación específicos
          if (apiService.hasValidationErrors(response)) {
            const validationErrors = apiService.getValidationErrors(response);
            const errorMessages = Object.entries(validationErrors || {})
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            addNotification(`Errores de validación: ${errorMessages}`, 'error');
          } else {
            addNotification(`Error al actualizar el torneo: ${response.message}`, 'error');
          }
        }
      } else {
        const response = await apiService.post('Torneos', tournamentData);
        if (response.success) {
          addNotification(`¡Torneo "${formData.name}" creado exitosamente!`, 'success');
          navigate('/worldGaming/torneos');
        } else {
          // Manejar errores de validación específicos
          if (apiService.hasValidationErrors(response)) {
            const validationErrors = apiService.getValidationErrors(response);
            const errorMessages = Object.entries(validationErrors || {})
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('; ');
            addNotification(`Errores de validación: ${errorMessages}`, 'error');
          } else {
            addNotification(`Error al crear el torneo: ${response.message}`, 'error');
          }
        }
      }
    } catch (error: any) {
      addNotification(`Error al procesar el torneo: ${error.message || 'Error desconocido'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    handleInputChange('image', undefined);
  };

  // Cargar torneo cuando está en modo edición
  useEffect(() => {
    if (isEditMode && tournamentId) {
      loadTournament(tournamentId);
    }
  }, [isEditMode, tournamentId]);

  return {
    // Estados del formulario
    formData,
    imagePreview,
    newRule,
    setNewRule,
    isSubmitting,
    
    // Estados de carga y errores
    loadingJuegos,
    juegosError,
    loadingTournament,
    tournamentError,
    
    // Modo y ID
    isEditMode,
    tournamentId,
    
    // Datos dinámicos
    gameOptions: getJuegoOptions(),
    
    // Handlers
    handleInputChange,
    handleAddRule,
    handleRemoveRule,
    handleKeyPress,
    handleImageUpload,
    handleFormValuesChange,
    handleSubmitTournament,
    removeImage
  };
};
