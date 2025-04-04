import React from "react";
import {
  ShoppingBag,
  Menu,
  ArrowRight,
  Star,
  Sparkles,
  Shirt,
  Plus,
} from "lucide-react";
import heroImg from "../assets/hero_img.png";
import { Link } from "react-router-dom";
import logo from "../assets/logo_SG.png";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Navigation */}
        {/* <nav className="border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
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
              
              <div className="flex items-center space-x-6">
                <button className="text-white flex items-center">
                  Sign Up
                </button>
                <button className="text-white">Login</button>
                <button className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </nav> */}

        {/* Hero Section */}
        <div className="relative pt-10 pb-5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  TRANSFORM YOUR <span className="text-[#e6fb04]">LOOK</span>
                  WITH FASHION <span className="block">THAT SPEAKS</span>
                  <span className="text-[#e6fb04]">TO YOU</span>
                </h1>

                <p className="text-gray-400 text-lg mb-8 max-w-xl">
                  Elevate your style by embracing the latest trends and paying
                  attention to every detail to reflect your unique personality.
                </p>
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center group hover:bg-[#e6fb04] transition duration-300">
                  New Arrival
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="flex-1 relative">
                <div className="relative">
                  <img
                    src={heroImg}
                    alt="Fashion Model"
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Brands Section */}
        <div className="bg-[#e6fb04] py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg"
                alt="Zara"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/24/Adidas_logo.png"
                alt="Adidas"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1280px-H%26M-Logo.svg.png"
                alt="H&M"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Nike_Logo.svg/1280px-Nike_Logo.svg.png"
                alt="Nike"
                className="h-8"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/75/Levi%27s_logo.svg"
                alt="Levis"
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* New Fashion Banner Section */}
        <div className="relative py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Cashback Offer */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                UP TO 50% CASHBACK
              </h2>
            </div>

            {/* Fashion Text Background */}
            <div className="relative">
              <marquee className="absolute inset-0 text-[1000px] md:text-[400px] font-bold text-gray-500 opacity-100 text-center leading-none tracking-[0.12em]">
                FASHION   
                FASHION
              </marquee>


              {/* Models Grid */}
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0">
                {/* Model 1 */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Model in Trench Coat"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition">
                    <Plus className="h-6 w-6 text-black" />
                  </button>
                </div>

                {/* Model 2 */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Model in Casual Tee"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition">
                    <Plus className="h-6 w-6 text-black" />
                  </button>
                </div>

                {/* Model 3 */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Model in Sweater"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition">
                    <Plus className="h-6 w-6 text-black" />
                  </button>
                </div>

                {/* Model 4 */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Model in Dress"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition">
                    <Plus className="h-6 w-6 text-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Section */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              OUR COLLECTION
            </h2>

            {/* Categories */}
            <div className="flex justify-center gap-8 mb-12">
              <button className="px-6 py-2 bg-[#e6fb04] rounded-full font-semibold">
                SHIRTS
              </button>
              <button className="px-6 py-2 hover:bg-gray-100 rounded-full font-semibold">
                T-SHIRTS
              </button>
              <button className="px-6 py-2 hover:bg-gray-100 rounded-full font-semibold">
                PAINTS
              </button>
              <button className="px-6 py-2 hover:bg-gray-100 rounded-full font-semibold">
                BLAZERS
              </button>
              <button className="px-6 py-2 hover:bg-gray-100 rounded-full font-semibold">
                JACKETS
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Card 1 */}
              <div className="bg-gray-50 rounded-3xl p-6 hover:shadow-lg transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1602810320073-1230c46d89d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Relaxed Green Men's Shirt"
                  className="w-full h-96 object-cover rounded-2xl mb-4"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">
                      RELAXED GREEN MEN'S SHIRT
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold text-orange-500">
                        $500
                      </span>
                      <span className="text-gray-400 line-through">$800</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="bg-gray-50 rounded-3xl p-6 hover:shadow-lg transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1604695573706-53170668f6a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Cotton Mesh Shirt"
                  className="w-full h-96 object-cover rounded-2xl mb-4"
                />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">COTTON MESH SHIRT</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold text-orange-500">
                        $400
                      </span>
                      <span className="text-gray-400 line-through">$600</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL"].map((size) => (
                      <button
                        key={size}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-gray-900 p-8 rounded-2xl hover:transform hover:scale-105 transition duration-300">
                <Star className="text-[#e6fb04] h-12 w-12 mb-6" />
                <h3 className="text-white text-2xl font-bold mb-4">
                  Premium Quality
                </h3>
                <p className="text-gray-400">
                  Curated selection of high-quality fashion pieces from renowned
                  brands.
                </p>
              </div>
              <div className="bg-gray-900 p-8 rounded-2xl hover:transform hover:scale-105 transition duration-300">
                <Sparkles className="text-[#e6fb04] h-12 w-12 mb-6" />
                <h3 className="text-white text-2xl font-bold mb-4">
                  Latest Trends
                </h3>
                <p className="text-gray-400">
                  Stay ahead with our constantly updated collection of trending
                  styles.
                </p>
              </div>
              <div className="bg-gray-900 p-8 rounded-2xl hover:transform hover:scale-105 transition duration-300">
                <Shirt className="text-[#e6fb04] h-12 w-12 mb-6" />
                <h3 className="text-white text-2xl font-bold mb-4">
                  Perfect Fit
                </h3>
                <p className="text-gray-400">
                  Find your perfect size with our detailed sizing guides and
                  easy returns.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Home;
