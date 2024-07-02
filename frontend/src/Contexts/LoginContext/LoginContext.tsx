import React, { createContext, useState, ReactNode } from 'react';

interface UserState {
  data: any; // Define the specific type if known
  token: string | null;
}

interface LoginContextType {
  isLoggedIn: boolean;    
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//   userState: UserState;
//   setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

export const LoginContext = createContext<LoginContextType | null>(null);