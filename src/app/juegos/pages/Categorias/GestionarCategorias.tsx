import React from 'react';
import {
  Edit,
  Trash2
} from 'lucide-react';
import { DynamicCardList, ManagementPageLayout } from '../../../shared/components/ui';
import { useCategories } from '../../hooks/useCategories';
import { Categoria } from '../../service/categoriasService';

/**
 * Página para gestionar categorías de juegos
 * Permite listar, buscar, crear, editar y eliminar categorías
 */
const GestionarCategorias: React.FC = () => {
  const {
    categories,
    loading,
    paginationInfo,
    handleFilterChange,
    handleRefresh,
    handlePaginationChange,
    handleEditCategory,
    handleDeleteCategory
  } = useCategories();

  const renderCategoryCard = (category: Categoria) => {
    // Convertir el color hex a RGB para el difuminado
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 139, g: 69, b: 19 }; // Fallback color
    };

    const rgb = hexToRgb(category.color);

    return (
      <div
        className="backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-lg hover:border-white/40 transition-all duration-300 group"
        style={{
          background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15), rgba(0, 0, 0, 0.2))`
        }}
      >
        {/* Header de la categoría */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">📁</div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-slate-300 transition-colors">
                {category.nombre}
              </h3>
              <p className="text-white/80 text-sm">Categoría</p>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-white/85 text-sm mb-4 line-clamp-2">
          {category.descripcion}
        </p>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 my-4"></div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => handleEditCategory(category.id)}
            className="flex-1 bg-blue-500/20 text-blue-400 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">Editar</span>
          </button>
          <button
            onClick={() => handleDeleteCategory(category.id)}
            className="bg-red-500/20 text-red-400 py-2 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-red-500/30 transition-all duration-200 flex items-center justify-center"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <ManagementPageLayout>
      <DynamicCardList
        title="Gestionar Categorías"
        subtitle="Administra las categorías de juegos disponibles en la plataforma"
        cardFields={[
          { label: 'Nombre', key: 'nombre' }
        ]}
        data={categories}
        renderCard={renderCategoryCard}
        isLoading={loading}
        onRefresh={handleRefresh}
        onPaginationChange={handlePaginationChange}
        serverPagination={paginationInfo}
        newButtonText="Crear Categoría"
        newButtonLink="/worldGaming/juegos/crearCategoria"
        filters={[
          {
            type: 'search',
            key: 'search',
            placeholder: 'Buscar por nombre...',
            onChange: (value: string) => handleFilterChange('search', value)
          }
        ]}
      />
    </ManagementPageLayout>
  );
};

export default GestionarCategorias;
