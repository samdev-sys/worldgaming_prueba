import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Target,
  Award,
  Plus,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  Clock,
  X,
  GitBranch
} from 'lucide-react';
import DynamicForm from '../../shared/components/ui/DynamicForm';
import { IFieldConfig } from '../../shared/interface/IFieldConfig';
import { useConfirmation } from '../../shared/contexts/ConfirmationContext';
import ParticipantsModal from '../components/ParticipantsModal';
import TournamentBracket from '../components/TournamentBracket';

interface TournamentResult {
  id: string;
  tournamentId: string;
  tournamentName: string;
  matchId: string;
  matchNumber: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  participants: ParticipantResult[];
  winner: string;
  totalPoints: number;
  notes: string;
}

interface ParticipantResult {
  id: string;
  name: string;
  team?: string;
  points: number;
  kills: number;
  assists: number;
  deaths: number;
  position: number;
  bonus: number;
  totalScore: number;
}

// Mock data para torneos
const tournaments = [
  { id: '1', name: 'LIGA DE CAMPEONES 2024', status: 'active' },
  { id: '2', name: 'BATTLE ROYALE CHAMPIONSHIP', status: 'active' },
  { id: '3', name: 'CS:GO PRO LEAGUE', status: 'completed' },
  { id: '4', name: 'VALORANT MASTERS', status: 'upcoming' },
];

// Mock data para resultados
const mockResults: TournamentResult[] = [
  {
    id: '1',
    tournamentId: '1',
    tournamentName: 'LIGA DE CAMPEONES 2024',
    matchId: 'MATCH-001',
    matchNumber: 'Partida 1',
    date: '2024-03-15',
    status: 'completed',
    winner: 'Team Alpha',
    totalPoints: 2450,
    notes: 'Partida muy competitiva con excelente nivel de juego',
    participants: [
      {
        id: '1',
        name: 'Player1',
        team: 'Team Alpha',
        points: 850,
        kills: 15,
        assists: 8,
        deaths: 3,
        position: 1,
        bonus: 100,
        totalScore: 950
      },
      {
        id: '2',
        name: 'Player2',
        team: 'Team Beta',
        points: 720,
        kills: 12,
        assists: 5,
        deaths: 7,
        position: 2,
        bonus: 50,
        totalScore: 770
      }
    ]
  }
];

const AdministrarResultados: React.FC = () => {
  const { showConfirm } = useConfirmation();
  const [results, setResults] = useState<TournamentResult[]>(mockResults);
  const [editingResult, setEditingResult] = useState<TournamentResult | null>(null);
  const [showBracketModal, setShowBracketModal] = useState(false);
  const [selectedTournamentForBracket, setSelectedTournamentForBracket] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TournamentResult | null>(null);

  // Configuración de campos para el formulario de resultados
  const resultFormFields: IFieldConfig[] = [
    {
      name: 'tournamentId',
      label: 'Torneo',
      type: 'select',
      required: true,
      options: tournaments.map(t => ({ value: t.id, label: t.name }))
    },
    {
      name: 'matchId',
      label: 'ID de Partida',
      type: 'text',
      required: true,
      placeholder: 'Ej: MATCH-001'
    },
    {
      name: 'matchNumber',
      label: 'Número de Partida',
      type: 'text',
      required: true,
      placeholder: 'Ej: Partida 1, Semifinal, Final'
    },
    {
      name: 'date',
      label: 'Fecha de Partida',
      type: 'date',
      required: true
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'in_progress', label: 'En Progreso' },
        { value: 'completed', label: 'Completado' }
      ]
    },
    {
      name: 'winner',
      label: 'Equipo Ganador',
      type: 'text',
      required: true,
      placeholder: 'Nombre del equipo ganador'
    },
    {
      name: 'totalPoints',
      label: 'Puntos Totales',
      type: 'number',
      required: true,
      placeholder: 'Total de puntos del torneo'
    },
    {
      name: 'notes',
      label: 'Notas',
      type: 'textarea',
      required: false,
      placeholder: 'Observaciones sobre la partida...',
      maxLength: 500
    }
  ];

  const handleSaveResult = (values: Record<string, any>) => {
    const newResult: TournamentResult = {
      id: editingResult?.id || Date.now().toString(),
      tournamentId: values.tournamentId,
      tournamentName: tournaments.find(t => t.id === values.tournamentId)?.name || '',
      matchId: values.matchId,
      matchNumber: values.matchNumber,
      date: values.date,
      status: values.status,
      winner: values.winner,
      totalPoints: parseInt(values.totalPoints),
      notes: values.notes || '',
      participants: editingResult?.participants || []
    };

    if (editingResult) {
      setResults(prev => prev.map(r => r.id === editingResult.id ? newResult : r));
    } else {
      setResults(prev => [...prev, newResult]);
    }

    setEditingResult(null);
    setShowForm(false);
  };

  const handleEditResult = (result: TournamentResult) => {
    setEditingResult(result);
    setShowForm(true);
  };

  const handleDeleteResult = async (resultId: string) => {
    const confirmed = await showConfirm({
      title: 'Eliminar Resultado',
      message: '¿Estás seguro de que quieres eliminar este resultado? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      setResults(prev => prev.filter(r => r.id !== resultId));
    }
  };

  const handleManageParticipants = (result: TournamentResult) => {
    setSelectedResult(result);
    setShowParticipantsModal(true);
  };

  const handleSaveParticipants = (participants: ParticipantResult[]) => {
    if (selectedResult) {
      const updatedResult = { ...selectedResult, participants };
      setResults(prev => prev.map(r => r.id === selectedResult.id ? updatedResult : r));
    }
  };

  const handleShowBracket = (tournamentId: string) => {
    setSelectedTournamentForBracket(tournamentId);
    setShowBracketModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'PENDIENTE';
      case 'in_progress': return 'EN PROGRESO';
      case 'completed': return 'COMPLETADO';
      default: return status.toUpperCase();
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.tournamentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.matchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.winner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Administrar Resultados</h1>
          <p className="text-white/80 mt-1">Registra y gestiona los resultados de los torneos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleShowBracket('1')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <GitBranch className="h-5 w-5" />
            Ver Bracket
          </button>
          <button
            onClick={() => {
              setEditingResult(null);
              setShowForm(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nuevo Resultado
          </button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar resultados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completado</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Formulario de Resultado */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editingResult ? 'Editar Resultado' : 'Nuevo Resultado'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingResult(null);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <DynamicForm
            fields={resultFormFields}
            initialValues={{
              tournamentId: editingResult?.tournamentId || '',
              matchId: editingResult?.matchId || '',
              matchNumber: editingResult?.matchNumber || '',
              date: editingResult?.date || '',
              status: editingResult?.status || 'pending',
              winner: editingResult?.winner || '',
              totalPoints: editingResult?.totalPoints || '',
              notes: editingResult?.notes || ''
            }}
            onSubmit={handleSaveResult}
            submitText={editingResult ? 'Actualizar Resultado' : 'Guardar Resultado'}
            className="space-y-4"
          />
        </div>
      )}

      {/* Lista de Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <div key={result.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{result.tournamentName}</h3>
                <p className="text-white/60 text-sm">{result.matchNumber}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(result.status)}`}>
                {getStatusText(result.status)}
              </span>
            </div>

            {/* Información de la Partida */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-white/80">
                <Target className="h-4 w-4" />
                <span className="text-sm">{result.matchId}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium text-white">{result.winner}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Award className="h-4 w-4" />
                <span className="text-sm">{result.totalPoints} puntos</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{new Date(result.date).toLocaleDateString('es-ES')}</span>
              </div>
            </div>

            {/* Participantes */}
            {result.participants.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">Participantes ({result.participants.length})</h4>
                <div className="space-y-1">
                  {result.participants.slice(0, 3).map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{participant.name}</span>
                      <span className="text-white font-medium">{participant.totalScore} pts</span>
                    </div>
                  ))}
                  {result.participants.length > 3 && (
                    <p className="text-xs text-white/60">+{result.participants.length - 3} más</p>
                  )}
                </div>
              </div>
            )}

            {/* Notas */}
            {result.notes && (
              <div className="mb-4">
                <p className="text-xs text-white/70 italic">"{result.notes}"</p>
              </div>
            )}

            {/* Acciones */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => handleManageParticipants(result)}
                className="flex-1 px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center gap-1"
              >
                <Users className="h-3 w-3" />
                Participantes
              </button>
              <button
                onClick={() => handleEditResult(result)}
                className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/30 transition-all duration-200"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleDeleteResult(result.id)}
                className="px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-all duration-200"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay resultados</h3>
          <p className="text-white/60 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'No se encontraron resultados con los filtros aplicados'
              : 'Comienza registrando el primer resultado de un torneo'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Crear Primer Resultado
            </button>
          )}
        </div>
      )}

      {/* Modal de Participantes */}
      {selectedResult && (
        <ParticipantsModal
          isOpen={showParticipantsModal}
          onClose={() => {
            setShowParticipantsModal(false);
            setSelectedResult(null);
          }}
          participants={selectedResult.participants}
          onSaveParticipants={handleSaveParticipants}
          matchId={selectedResult.matchId}
          matchNumber={selectedResult.matchNumber}
        />
      )}

      {/* Modal del Bracket */}
      {showBracketModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Bracket del Torneo</h2>
                <p className="text-white/80 mt-1">
                  {tournaments.find(t => t.id === selectedTournamentForBracket)?.name || 'Torneo'}
                </p>
              </div>
              <button
                onClick={() => setShowBracketModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <TournamentBracket
                tournamentId={selectedTournamentForBracket}
                tournamentName={tournaments.find(t => t.id === selectedTournamentForBracket)?.name || 'Torneo'}
                format="single_elimination"
                participants={[
                  'Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta',
                  'Team Echo', 'Team Foxtrot', 'Team Golf', 'Team Hotel'
                ]}
                matches={[
                  {
                    id: '1',
                    round: 1,
                    matchNumber: 1,
                    player1: 'Team Alpha',
                    player2: 'Team Beta',
                    player1Score: 16,
                    player2Score: 14,
                    status: 'completed',
                    winner: 'Team Alpha',
                    scheduledTime: '2024-03-15 14:00',
                    duration: '45 min'
                  },
                  {
                    id: '2',
                    round: 1,
                    matchNumber: 2,
                    player1: 'Team Gamma',
                    player2: 'Team Delta',
                    player1Score: 0,
                    player2Score: 0,
                    status: 'pending',
                    winner: '',
                    scheduledTime: '2024-03-15 16:00',
                    duration: '45 min'
                  },
                  {
                    id: '3',
                    round: 2,
                    matchNumber: 1,
                    player1: 'Team Alpha',
                    player2: 'TBD',
                    player1Score: 0,
                    player2Score: 0,
                    status: 'pending',
                    winner: '',
                    scheduledTime: '2024-03-16 14:00',
                    duration: '45 min'
                  }
                ]}
                onMatchUpdate={(matchId: string, winner: string, scores: { player1: number, player2: number }) => {
                  console.log('Match updated:', matchId, winner, scores);
                  // Aquí se actualizaría el resultado en la base de datos
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrarResultados;
