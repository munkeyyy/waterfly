import React, { ReactNode, useState } from 'react'
import { LoginContext } from './LoginContext'

interface LoginProviderProps {
    children: ReactNode;
  }

const LoginProvider :React.FC<LoginProviderProps>=({children}) => {
  const token =localStorage.getItem("token")
    const[isLoggedIn, setIsLoggedIn]=useState<boolean>(token?true:false)
  return (
    <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>{children}</LoginContext.Provider>
  )
}

export default LoginProvider