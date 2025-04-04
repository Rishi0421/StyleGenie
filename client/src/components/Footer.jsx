import { Link } from "react-router-dom"
import Logo from "../assets/logo_SG.png"

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <div className="w-64 relative">
            <img
              src={Logo}
              alt="Style Logo"
              width={500}
              height={300}
              className="object-contain"
            />
            <div className="absolute -top-10 right-0 w-16 h-16">
              <div className="relative w-full h-full">
                <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-white rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-sm uppercase mb-4">CONTACT</h3>
            <p className="text-gray-400 text-sm mb-2">Asansol</p>
            <p className="text-gray-400 text-sm mb-2">West Bengal</p>
            <p className="text-gray-400 text-sm mb-2">India</p>
          </div>

          <div>
            <h3 className="text-sm uppercase mb-4">CATEGORIES</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/men" className="text-gray-400 text-sm hover:text-white">
                  Clothes
                </Link>
              </li>
              <li>
                <Link to="/category/women" className="text-gray-400 text-sm hover:text-white">
                  Shoes
                </Link>
              </li>
              <li>
                <Link to="/category/kids" className="text-gray-400 text-sm hover:text-white">
                ACCESSORIES
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase mb-4">FOLLOW US</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 text-sm hover:text-white">
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase mb-4">HELP</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="text-gray-400 text-sm hover:text-white">
                  Support
                </Link>
              </li>
              <li>
                <a href="mailto:support@style.com" className="text-gray-400 text-sm hover:text-white">
                  support@style.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">Copyright ©2025 StyleGenie</p>
          <p className="text-gray-400 text-sm">Design by: @StyleGenie_Dev</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

