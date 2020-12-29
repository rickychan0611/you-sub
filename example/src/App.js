import React from 'react'
import ContextProvider from "./context/Context"

import { HashRouter } from "react-router-dom";
import AppRoutes from './routes'

const App = () => {
  return (
    <HashRouter>
      <ContextProvider>
        <AppRoutes />
      </ContextProvider>
    </HashRouter>
  )
}

export default App
