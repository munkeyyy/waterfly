import { createContext } from "react";
export interface ReportType{
    month: string;    
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  year:string;
  setYear:React.Dispatch<React.SetStateAction<string>>
}
export const ReportContext=createContext<ReportType|null>(null)