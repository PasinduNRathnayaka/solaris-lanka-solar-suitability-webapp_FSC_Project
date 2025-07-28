import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Calculator from './pages/Calculator'
import AdminLayout from './components/AdminLayout'
import ModelCoefficients from './pages/admin/ModelCoefficients'
import Variables from './pages/admin/Variables'
import SolarPanels from './pages/admin/SolarPanels'
import LocationData from './pages/admin/LocationData'
import Analytics from './pages/admin/Analytics'
import Calculations from './pages/admin/Calculations'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ModelCoefficients />} />
          <Route path="model" element={<ModelCoefficients />} />
          <Route path="variables" element={<Variables />} />
          <Route path="solar-panels" element={<SolarPanels />} />
          <Route path="locations" element={<LocationData />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="calculations" element={<Calculations />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App