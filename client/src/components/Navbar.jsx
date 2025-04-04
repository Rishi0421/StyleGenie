import { Link, useParams } from "react-router-dom"
import { Search, Heart, ShoppingCart, User } from "lucide-react"
import logo from "../assets/logo_SG.png"

const Navbar = () => {

  const { userId } = useParams() // Get userId from URL parameters
  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-32">
              <img
                src={logo}
                alt="Style Logo"
                className="object-contain"
                width={120}
                height={50}
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to={`/home-page/${userId}`} className="font-medium hover:text-[#c8ff00]">
              HOME
            </Link>
            <Link to={`/category/clothes/${userId}`} className="font-medium hover:text-[#c8ff00]">
              CLOTHS
            </Link>
            <Link to={`/category/shoes/${userId}`} className="font-medium hover:text-[#c8ff00]">
              SHOES
            </Link>
            <Link to={`/category/accessories/${userId}`} className="font-medium hover:text-[#c8ff00]">
              ACCESSORIES
            </Link>
            <Link to={`/replace/${userId}`} className="font-medium bg-[#c8ff00] text-black rounded-full px-4 py-2 hover:bg-[#c8ff5a] transition duration-300">
              REPLACE
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH"
                className="bg-gray-800 text-white rounded-full py-1 px-4 pr-10 text-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search size={18} />
              </button>
            </div>

            <Link to={`/wishlist/${userId}`} className="hover:text-gray-300">
              <Heart size={20} />
            </Link>

            <Link to={`/cart/${userId}`} className="hover:text-gray-300">
              <ShoppingCart size={20} />
            </Link>

            <Link to={`/profile/${userId}`} className="hover:text-gray-300">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-800 w-full"></div>
    </header>
  )
}

export default Navbar

