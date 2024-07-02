import { createContext } from "react";
export interface User{
    id: string,
    user_name: string,
    email: string,
    password: string,
    phone: number,
    avatar?: string,
}

interface UserContextType{
    user:User | null,
    setUser:React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext=createContext<UserContextType | null>(null)