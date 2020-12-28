import React, { createContext, useState } from 'react'
 
export const Context = createContext()

const ContextProvider = ({ children }) => {
  const [content, setContent] = useState('')
  const [rating, setRating] = useState('')

  return (
    <Context.Provider
      value={
        {
          content,
          setContent,
          rating,
          setRating
        }
      }
    >
      {children}
    </Context.Provider>
  )
}

export default ContextProvider