import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  Target,
  Award,
  Users,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ParticipantResult } from '../pages/AdministrarResultados';

interface ParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ParticipantResult[];
  onSaveParticipants: (participants: ParticipantResult[]) => void;
  matchId: string;
  matchNumber: string;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  isOpen,
  onClose,
  participants,
  onSaveParticipants,
  matchId,
  matchNumber
}) => {
  const [editingParticipants, setEditingParticipants] = useState<ParticipantResult[]>(participants);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState<Partial<ParticipantResult>>({
    name: '',
    team: '',
    points: 0,
    kills: 0,
    assists: 0,
    deaths: 0,
    position: 0,
    bonus: 0,
    totalScore: 0
  });

  const handleAddParticipant = () => {
    if (newParticipant.name && newParticipant.team) {
      const participant: ParticipantResult = {
        id: Date.now().toString(),
        name: newParticipant.name,
        team: newParticipant.team,
        points: newParticipant.points || 0,
        kills: newParticipant.kills || 0,
        assists: newParticipant.assists || 0,
        deaths: newParticipant.deaths || 0,
        position: newParticipant.position || 0,
        bonus: newParticipant.bonus || 0,
        totalScore: (newParticipant.points || 0) + (newParticipant.bonus || 0)
      };

      setEditingParticipants(prev => [...prev, participant]);
      setNewParticipant({
        name: '',
        team: '',
        points: 0,
        kills: 0,
        assists: 0,
        deaths: 0,
        position: 0,
        bonus: 0,
        totalScore: 0
      });
    }
  };

  const handleEditParticipant = (id: string) => {
    setEditingId(id);
  };

  const handleSaveParticipant = (id: string, updatedData: Partial<ParticipantResult>) => {
    setEditingParticipants(prev => prev.map(p => 
      p.id === id 
        ? { 
            ...p, 
            ...updatedData, 
            totalScore: (updatedData.points || p.points) + (updatedData.bonus || p.bonus)
          }
        : p
    ));
    setEditingId(null);
  };

  const handleDeleteParticipant = (id: string) => {
    setEditingParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveAll = () => {
    onSaveParticipants(editingParticipants);
    onClose();
  };

  const handleCancel = () => {
    setEditingParticipants(participants);
    setEditingId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Gestionar Participantes</h2>
            <p className="text-white/80 mt-1">{matchNumber} - {matchId}</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Formulario para nuevo participante */}
        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Agregar Nuevo Participante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nombre del jugador"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Equipo"
              value={newParticipant.team}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, team: e.target.value }))}
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
            />
            <input
              type="number"
              placeholder="Puntos"
              value={newParticipant.points}
              onChange={(e) => setNewParticipant(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
            />
            <button
              onClick={handleAddParticipant}
              className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg font-medium hover:bg-orange-500/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>
        </div>

        {/* Lista de participantes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Participantes ({editingParticipants.length})</h3>
          
          {editingParticipants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No hay participantes registrados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {editingParticipants.map((participant) => (
                <div key={participant.id} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  {editingId === participant.id ? (
                    <EditParticipantForm
                      participant={participant}
                      onSave={(updatedData) => handleSaveParticipant(participant.id, updatedData)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <ParticipantRow
                      participant={participant}
                      onEdit={() => handleEditParticipant(participant.id)}
                      onDelete={() => handleDeleteParticipant(participant.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAll}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

interface ParticipantRowProps {
  participant: ParticipantResult;
  onEdit: () => void;
  onDelete: () => void;
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({ participant, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-semibold text-white">{participant.name}</h4>
          <span className="text-sm text-white/60">({participant.team})</span>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
            Posición {participant.position}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-red-400" />
            <span className="text-white/80">Kills: {participant.kills}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-400" />
            <span className="text-white/80">Asistencias: {participant.assists}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-400" />
            <span className="text-white/80">Muertes: {participant.deaths}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">Total: {participant.totalScore}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onEdit}
          className="p-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-200"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface EditParticipantFormProps {
  participant: ParticipantResult;
  onSave: (data: Partial<ParticipantResult>) => void;
  onCancel: () => void;
}

const EditParticipantForm: React.FC<EditParticipantFormProps> = ({ participant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: participant.name,
    team: participant.team || '',
    points: participant.points,
    kills: participant.kills,
    assists: participant.assists,
    deaths: participant.deaths,
    position: participant.position,
    bonus: participant.bonus
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="text"
          placeholder="Equipo"
          value={formData.team}
          onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Puntos"
          value={formData.points}
          onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Bonus"
          value={formData.bonus}
          onChange={(e) => setFormData(prev => ({ ...prev, bonus: parseInt(e.target.value) || 0 }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Kills"
          value={formData.kills}
          onChange={(e) => setFormData(prev => ({ ...prev, kills: parseInt(e.target.value) || 0 }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Asistencias"
          value={formData.assists}
          onChange={(e) => setFormData(prev => ({ ...prev, assists: parseInt(e.target.value) || 0 }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Muertes"
          value={formData.deaths}
          onChange={(e) => setFormData(prev => ({ ...prev, deaths: parseInt(e.target.value) || 0 }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
        <input
          type="number"
          placeholder="Posición"
          value={formData.position}
          onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
          className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
        />
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg font-medium hover:bg-green-500/30 transition-all duration-200 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Guardar
        </button>
      </div>
    </div>
  );
};

export default ParticipantsModal;
