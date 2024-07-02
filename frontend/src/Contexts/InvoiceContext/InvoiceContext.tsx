import { createContext } from "react";
export interface InvoiceType{
    month: string;    
  setMonth: React.Dispatch<React.SetStateAction<string>>;
  year:string;
  setYear:React.Dispatch<React.SetStateAction<string>>
}
export const InvoiceContext=createContext<InvoiceType|null>(null)