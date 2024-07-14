import React, { ReactNode, useState } from 'react'
import { ReportContext } from './ReportContext';
interface ReportProviderProps {
    children: ReactNode;
  }
const ReportProvider: React.FC<ReportProviderProps> = ({children}) => {
    const [month, setMonth] = useState<string>('01');
    const [year, setYear] = useState<string>('2001');
    
  return (
    <ReportContext.Provider value={{month, setMonth, year, setYear}}>
        {children}
    </ReportContext.Provider>
  )
}

export default ReportProvider