import React from 'react';

export type TournamentStatus = 'próximo' | 'activo' | 'completado';

interface TournamentStatusTabsProps {
  activeTab: TournamentStatus;
  onTabChange: (tab: TournamentStatus) => void;
  counts?: {
    próximo: number;
    activo: number;
    completado: number;
  };
}

const TournamentStatusTabs: React.FC<TournamentStatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts = { próximo: 0, activo: 0, completado: 0 }
}) => {
  const tabs = [
    {
      id: 'próximo' as TournamentStatus,
      label: 'Próximos torneos',
      count: counts.próximo
    },
    {
      id: 'activo' as TournamentStatus,
      label: 'Torneos en juego',
      count: counts.activo
    },
    {
      id: 'completado' as TournamentStatus,
      label: 'Torneos terminados',
      count: counts.completado
    }
  ];

  return (
    <div className="flex border-b border-white/10 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            )}
          </div>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TournamentStatusTabs;
