import React from 'react';

interface TournamentPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  itemsPerPageOptions: number[];
}

const TournamentPagination: React.FC<TournamentPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Información de registros */}
        <div className="text-white/60 text-sm">
          Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} torneos
        </div>

        {/* Selector de items por página */}
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Mostrar:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-white/60 text-sm">por página</span>
        </div>

        {/* Navegación de páginas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          
          {/* Números de página */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  page === currentPage
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default TournamentPagination;
