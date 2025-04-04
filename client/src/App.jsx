import { Routes, Route, useLocation } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import CategoryPage from "./pages/CatagoryPage"
import CartPage from "./pages/CartPage"
import WishlistPage from "./pages/WishlistPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ImgReplace from "./pages/ImgReplace"
import LandingPage from "./pages/LandingPage"
import LandingNavbar from "./pages/LandingNavbar"
import OrderConfirmation from "./pages/OrderConfirmation"
import { ToastContainer } from 'react-toastify';
import Profile from "./components/Profile"

function App() {

  // const location = useLocation();
  // const isLandingPage = location.pathname === "/"; // Adjust path if necessary

  return (
    <div className="App">
      <ToastContainer />
      
      <main>
        <Routes>
          <Route path="/" element={<><LandingNavbar /><LandingPage /></>} />  {/* Set LandingPage to the root path */}
          <Route path="/home-page/:userId" element={<><Navbar /><HomePage /></>} />
          <Route path="/product/:id/:userId" element={<><Navbar /><ProductPage /></>} />
          <Route path="/category/:slug/:userId" element={<><Navbar /><CategoryPage /></>} />
          <Route path="/cart/:userId" element={<><Navbar /><CartPage /></>} />
          <Route path="/wishlist/:userId" element={<><Navbar /><WishlistPage /></>} />
          <Route path="/replace/:userId" element={<><Navbar /><ImgReplace /></>} />
          <Route path="/order-confirmation/:orderId/:userId" element={<><Navbar /><OrderConfirmation /></>} /> {/* Adjust path if necessary */}
          <Route path="/profile/:userId" element={<><Navbar /><Profile /></>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

