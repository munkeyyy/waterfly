import React, { ReactNode, useEffect, useState } from 'react'
import { UserContext,User } from './UserContext'

interface UserProviderProps{
    children:ReactNode
}

const UserProvider:React.FC<UserProviderProps> = ({children}) => {
 
    const [user,setUser]=useState<User | null>(null)


    useEffect(() => {
      const signedInUser = localStorage.getItem("user");
      if (signedInUser) {
          const userData: User = JSON.parse(signedInUser);
          setUser(userData);
      }
  }, []);
  return (
    <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
  )
}

export default UserProvider