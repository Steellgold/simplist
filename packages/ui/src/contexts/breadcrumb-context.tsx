import { createContext, useState, PropsWithChildren } from 'react';
import { BreadcrumbContextType, BreadcrumbItem } from '../types/breadcrumb.types.js';

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}