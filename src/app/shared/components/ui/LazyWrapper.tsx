import React, { Suspense, ComponentType, ReactNode } from 'react';
import LoadingScreen from './LoadingScreen';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  delay?: number;
}

/**
 * Wrapper para componentes lazy con loading personalizado
 */
const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <LoadingScreen />,
  delay = 200 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

/**
 * HOC para crear componentes lazy con loading
 */
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) => {
  return React.memo((props: P) => (
    <LazyWrapper fallback={fallback}>
      <Component {...props} />
    </LazyWrapper>
  ));
};

/**
 * Hook para lazy loading de componentes
 */
export const useLazyComponent = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  fallback?: ReactNode
) => {
  const LazyComponent = React.lazy(importFunction);
  
  return React.useMemo(() => {
    return withLazyLoading(LazyComponent, fallback);
  }, [importFunction, fallback]);
};

export default LazyWrapper;
