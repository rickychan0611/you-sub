import React from 'react'
import ContextProvider from "./context/Context"

import { BrowserRouter } from "react-router-dom";
import AppRoutes from './routes'

const App = () => {
  return (
    <BrowserRouter>
      <ContextProvider>
        <AppRoutes />
      </ContextProvider>
    </BrowserRouter>
  )
}

export default App
