import React from 'react';

interface ManagementPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Layout global para páginas de gestión
 */
const ManagementPageLayout: React.FC<ManagementPageLayoutProps> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`min-w-screen ${className}`}>
    <div className="max-w-none mx-auto">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  </div>
);

export default ManagementPageLayout;
