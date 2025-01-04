import React from 'react'
import Home from './Components/pages/Home'
import { Route, Routes } from 'react-router-dom'
import Navbar from './Components/layout/Navbar'
import Store from './Components/pages/Store'
import About from './Components/pages/About'
import Services from './Components/pages/Services'
import Footer from './Components/layout/Footer'
import ProductDetails from './Components/pages/ProductDetails'
import './Components/styles/fontStyle.css'
import Cart from './Components/pages/Cart'
import DoctorDetails from './Components/pages/DoctorDetails'
import BookAppointment from './Components/pages/BookAppointment'

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/doctor/:id/appointment" element={<BookAppointment />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App