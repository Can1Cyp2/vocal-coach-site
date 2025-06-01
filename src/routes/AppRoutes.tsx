// src/routes/AppRoutes.tsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import Login from '../components/Login'
import Signup from '../pages/Signup'
import Booking from '../pages/Booking'
import Layout from '../components/Layout'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking" element={<Booking />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

