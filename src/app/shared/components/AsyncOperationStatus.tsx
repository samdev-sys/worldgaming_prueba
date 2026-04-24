import React from 'react';
import { CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';

export interface AsyncOperation {
  id: string;
  type: 'success' | 'error' | 'loading' | 'pending';
  message: string;
  timestamp: Date;
}

interface AsyncOperationStatusProps {
  operations: AsyncOperation[];
  maxVisible?: number;
}

const AsyncOperationStatus: React.FC<AsyncOperationStatusProps> = ({ 
  operations, 
  maxVisible = 3 
}) => {
  const visibleOperations = operations.slice(-maxVisible);

  const getStatusIcon = (type: AsyncOperation['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (type: AsyncOperation['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'loading':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'pending':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 1) return 'Ahora mismo';
    if (diffInSeconds < 60) return `Hace ${diffInSeconds}s`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    return date.toLocaleDateString('es-ES');
  };

  if (operations.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2" role="status" aria-live="polite">
      {visibleOperations.map((operation) => (
        <div
          key={operation.id}
          className={`p-3 rounded-lg border backdrop-blur-lg shadow-lg transition-all duration-300 ${getStatusColor(operation.type)}`}
          role="alert"
          aria-label={`Operación ${operation.type}: ${operation.message}`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(operation.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">
                {operation.message}
              </p>
              <p className="text-xs text-white/60">
                {formatTimeAgo(operation.timestamp)}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {operations.length > maxVisible && (
        <div className="text-center">
          <span className="text-xs text-white/60">
            +{operations.length - maxVisible} operaciones más
          </span>
        </div>
      )}
    </div>
  );
};

export default AsyncOperationStatus;
