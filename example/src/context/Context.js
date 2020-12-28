import React, { createContext, useState, useEffect } from 'react'
import {db, auth} from "../../../firebaseApp" 

export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({})

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("logged in", user.email);
      }
      else {
        console.log("Not logged in")
      }
    })
  }, [])


  return (
    <Context.Provider
      value={
        {
          user
        }
      }
    >
      {children}
    </Context.Provider>
  )
}

export default ContextProvider