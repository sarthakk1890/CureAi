import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/layout/Navbar';
import Footer from './Components/layout/Footer';
import Home from './Components/pages/Home';
import Store from './Components/pages/Store';
import About from './Components/pages/About';
import Services from './Components/pages/Services';
import ProductDetails from './Components/pages/ProductDetails';
import Cart from './Components/pages/Cart';
import DoctorDetails from './Components/pages/DoctorDetails';
import BookAppointment from './Components/pages/BookAppointment';
import LoginSignUp from './Components/pages/LoginSignUp';
import './Components/styles/fontStyle.css';

const App: React.FC = () => {
  const location = useLocation();

  // List of paths where Navbar and Footer should not be displayed
  const excludeNavFooterPaths = ['/auth'];

  const shouldHideNavFooter = excludeNavFooterPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/store" element={<Store />} />
        <Route path="/store/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/doctor/:id/appointment" element={<BookAppointment />} />
        <Route path="/auth" element={<LoginSignUp />} />
      </Routes>
      {!shouldHideNavFooter && <Footer />}
    </>
  );
};

export default App;
