import React, { ReactNode, useState } from 'react';
import { InvoiceContext } from './InvoiceContext';

interface InvoiceProviderProps {
  children: ReactNode;
}
export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({
  children,
}) => {
  const [month, setMonth] = useState<string>('01');
  const [year, setYear] = useState<string>('2001');
  
  return (
    <InvoiceContext.Provider value={{ month, year, setMonth, setYear }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceProvider;

