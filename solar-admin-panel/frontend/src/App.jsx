import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminPanel from './pages/AdminPanel'
import Calculator from './pages/Calculator'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  )
}

export default App