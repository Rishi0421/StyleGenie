"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import SkeletonProductCard from "../components/SkeletonCategory" // <-- Import Skeleton Card
import { ChevronDown, Filter } from "lucide-react"
import axios from "axios"
import { toast } from 'react-toastify'; // Optional: for error notifications

const CategoryPage = () => {
  const { slug, userId } = useParams() // <-- Get userId as well if needed by ProductCard or links
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true) // Still start in loading state
  const [error, setError] = useState(null)

  const URL = import.meta.env.VITE_BE_URL

  useEffect(() => {
    const fetchProducts = async () => {
      // Reset states for clean loading
      setLoading(true)
      setError(null)
      setProducts([]) // Clear previous products

      try {
        console.log("Fetching all products...");
        // Fetching all products - consider optimizing this in the future
        // by fetching only the required category from the backend.
        const response = await axios.get(`${URL}/api/products`)
        setProducts(response.data)
        console.log(`Fetched ${response.data.length} total products.`);
      } catch (err) {
        setError(err)
        console.error("Error fetching products:", err)
        toast.error("Failed to load products. Please try again."); // User feedback
      } finally {
         setLoading(false) // Set loading false regardless of success/error
      }
    }

    fetchProducts()
  }, [URL]) // Fetch all products only once when the component mounts or URL changes

  useEffect(() => {
    // Scroll to top when the category slug changes
    window.scrollTo(0, 0)
  }, [slug])

  // Client-side filtering based on slug
  let categoryProducts = products; // Start with all fetched products

  if (!loading && slug && slug !== "all") { // Perform filtering only after loading is done
    // Make comparison case-insensitive for robustness
    const lowerCaseSlug = slug.toLowerCase();
    categoryProducts = products.filter((p) => p.category?.toLowerCase() === lowerCaseSlug);
  }

  // Client-side sorting
  const sortProducts = (productsToSort) => {
    // Defensive copy to avoid mutating the original array
    const productsCopy = [...productsToSort];
    switch (sortBy) {
      case "price-low":
        return productsCopy.sort((a, b) => a.salePrice - b.salePrice);
      case "price-high":
        return productsCopy.sort((a, b) => b.salePrice - a.salePrice);
      case "newest":
         // Assuming 'createdAt' field exists for sorting by newest
         // Adjust field name if different (e.g., 'dateAdded')
        return productsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default: // featured or unknown
        return productsCopy; // Return the filtered list as is for 'featured'
    }
  };

  // Apply sorting to the filtered products
  const sortedProducts = sortProducts(categoryProducts);

  // Helper to generate the page title
   const pageTitle = slug
     ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) // Format slug
     : 'Category';


  // --- Render Logic ---

  // 1. Loading State
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
         {/* Show title even during loading */}
        <h1 className="text-3xl font-bold mb-8 capitalize">
            {pageTitle}
        </h1>
         {/* Optionally show skeleton versions of filters/sort, or just hide them */}
         {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => ( // Render 8 skeleton cards
            <SkeletonProductCard key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
     return (
        <div className="container mx-auto px-4 py-12 min-h-screen text-center">
            <h1 className="text-3xl font-bold mb-8 capitalize text-red-600">
                Error Loading Products
            </h1>
            <p className="text-gray-600 mb-4">Could not fetch products for "{pageTitle}".</p>
            <p className="text-sm mb-8">{error.message}</p>
            <Link
                to={`/home-page/${userId || ''}`} // Link to home, handle missing userId
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
            >
                Go Back Home
            </Link>
        </div>
     )
  }

  // 3. Data Loaded Successfully (Products or No Products)
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {pageTitle}
      </h1>

      {/* Filter and Sort Controls - Render only when data is loaded */}
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <button
          className="flex items-center mb-4 md:mb-0 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-2" />
          Filters {/* Add filter count later if implemented */}
        </button>

        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-100 px-4 py-2 pr-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Panel (Non-functional in original code) */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-4 bg-gray-50 rounded-md border">
          {/* Placeholder Filter Sections - These need actual state and logic */}
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
             {/* Needs dynamic generation based on available sub-categories */}
             <div className="space-y-1 text-sm">
                 <label className="flex items-center"><input type="checkbox" className="mr-2 rounded" />Shirts</label>
                 <label className="flex items-center"><input type="checkbox" className="mr-2 rounded" />T-Shirts</label>
                 {/* ... more */}
             </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Price Range</h3>
             {/* Needs dynamic ranges or input fields */}
             <div className="space-y-1 text-sm">
                 <label className="flex items-center"><input type="checkbox" className="mr-2 rounded" />Under ₹1000</label>
                 <label className="flex items-center"><input type="checkbox" className="mr-2 rounded" />₹1000 - ₹3000</label>
                 {/* ... more */}
             </div>
          </div>
           <div>
             <h3 className="font-medium mb-2">Colors</h3>
             {/* Needs dynamic generation based on available product colors */}
             <div className="flex flex-wrap gap-2">
                 <button className="w-6 h-6 bg-black rounded-full border focus:ring-2 focus:ring-offset-1 focus:ring-black" title="Black"></button>
                 <button className="w-6 h-6 bg-white rounded-full border focus:ring-2 focus:ring-offset-1 focus:ring-black" title="White"></button>
                 <button className="w-6 h-6 bg-blue-600 rounded-full border focus:ring-2 focus:ring-offset-1 focus:ring-blue-600" title="Blue"></button>
                 {/* ... more */}
             </div>
           </div>
           <div>
             <h3 className="font-medium mb-2">Size</h3>
              {/* Needs dynamic generation based on available product sizes */}
             <div className="flex flex-wrap gap-2">
                 <button className="w-9 h-9 flex items-center justify-center border rounded text-xs hover:bg-gray-100 focus:bg-gray-200">S</button>
                 <button className="w-9 h-9 flex items-center justify-center border rounded text-xs hover:bg-gray-100 focus:bg-gray-200">M</button>
                 {/* ... more */}
             </div>
           </div>
          {/* --- End Placeholder Filters --- */}
        </div>
      )}

      {/* Product Grid or No Products Message */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            // Make sure ProductCard receives userId if it needs it for wishlist/cart actions
            <ProductCard key={product._id} product={product} userId={userId} />
          ))}
        </div>
      ) : (
         // No products found message
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium mb-4">No products found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find any products matching "{pageTitle}" category or your filters.
          </p>
          <Link
            to={`/home-page/${userId || ''}`} // Link to home, handle missing userId
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            Explore Other Products
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryPage