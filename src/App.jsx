import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import Categories from './pages/Categories/Categories'
import Contact from './pages/Contact/Contact'
import SearchResults from './pages/SearchResults/SearchResults'
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation'
import SignUp from './pages/SignUp/SignUp'
import EmailVerification from './pages/EmailVerification/EmailVerification'

const App = () => {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/order-confirmation' element={<OrderConfirmation />} />
          <Route path='/myorder' element={<MyOrders />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/verify-email' element={<EmailVerification />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
