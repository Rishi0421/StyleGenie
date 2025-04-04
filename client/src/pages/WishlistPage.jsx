"use client";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react"; // Added Heart for empty state suggestion
import axios from "axios";
import { toast } from "react-toastify";
import SkeletonProductCard from "../components/SkeletonProductCard"; // <-- Import the skeleton component

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Existing loading state
  const [error, setError] = useState(null);

  const URL = import.meta.env.VITE_BE_URL;
  const { userId } = useParams();

  // --- Fetch Wishlist Items (Original Logic) ---
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (userId) {
        setIsLoading(true);  // Start loading
        setError(null);
        setWishlistItems([]); // Clear previous items on new fetch

        try {
          const response = await axios.get(`${URL}/api/wishlist/${userId}`);

          // Ensure response status is okay and data structure is as expected
          if (response.status === 200 && response.data && Array.isArray(response.data.wishlistItems)) {
            const productIds = response.data.wishlistItems;

            if (productIds.length === 0) {
                // If no IDs, no need to fetch details, stop loading
                setIsLoading(false);
                return;
            }

            // Fetch details for each product in parallel
            const productDetailsPromises = productIds.map(async (productId) => {
              if (!productId) return null; // Skip if productId is invalid
              try {
                const productResponse = await axios.get(`${URL}/api/products/${productId}`);
                return productResponse.data; // Return the product object
              } catch (productError) {
                console.error(`Error fetching product ${productId}:`, productError);
                return null; // Indicate failure for this product
              }
            });

            const productDetails = await Promise.all(productDetailsPromises);
            const validProducts = productDetails.filter(product => product !== null);
            setWishlistItems(validProducts);

          } else {
            // Handle cases where response is not 200 or data format is wrong
            console.error("Unexpected response fetching wishlist:", response);
            throw new Error("Failed to fetch wishlist items or invalid format received.");
          }
        } catch (fetchError) {
          console.error("Error fetching wishlist items:", fetchError);
          setError(fetchError.message || "An unknown error occurred."); // Set error message
        } finally {
          setIsLoading(false); // Stop loading in all execution paths
        }
      } else {
          // Handle case where userId is missing
          setError("User ID not found.");
          setIsLoading(false); // Ensure loading stops if no userId
      }
    };

    fetchWishlistItems();
  }, [userId, URL]); // Dependencies remain the same

  // --- Remove Item (Original Logic) ---
  const removeItem = async (productId) => {
    if (!userId || !productId) return; // Add check for productId

    // Keep original logic, maybe add toast feedback
    const originalItems = [...wishlistItems]; // For potential rollback
    setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== productId)); // Optimistic update
    toast.info("Removing item...");

    try {
      // Original endpoint kept as is
      await axios.post(`${URL}/api/wishlist`, { userId: userId, productId: productId });
      toast.success("Item removed."); // Success feedback
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Could not remove item."); // Error feedback
      setWishlistItems(originalItems); // Rollback optimistic update
    }
  };

  // --- Add to Cart (Original Logic - Placeholder Alert) ---
  const addToCart = (id) => {
    // Original alert kept as is
    alert(`Added item ${id} to cart`);
    // Consider replacing with actual API call and toast messages later
  };


  // --- RENDER LOGIC ---

  // 1. Loading State: Show Skeleton Grid
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {/* Grid structure matching the final display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Render skeleton cards */}
          {Array.from({ length: 8 }).map((_, index) => ( // Show 8 skeletons
            <SkeletonProductCard key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State (Original logic with slight improvement)
  if (error) {
    return (
        <div className="container mx-auto px-4 py-12 min-h-screen text-center">
             <h1 className="text-3xl font-bold mb-8 text-red-600">Error Loading Wishlist</h1>
             <p className="text-gray-600 mb-8">{error}</p>
             <Link
                 to={`/home-page/${userId || ''}`} // Link to home, handle missing userId
                 className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
             >
                 Go Back Home
             </Link>
        </div>
    );
  }

  // 3. Loaded State (Empty or With Items)
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen"> {/* Added min-h-screen */}
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlistItems.length > 0 ? (
        // Grid for Wishlist Items (Original JSX structure with minor improvements)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            // Card structure remains mostly the same
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
              <Link to={`/product/${item._id}/${userId}`} className="block relative h-64 group">
                <img
                  src={item.images && item.images[0] ? item.images[0] : "/placeholder.svg"}
                  alt={item.name || 'Product Image'} // Add default alt text
                  className="object-contain w-full h-full group-hover:opacity-90 transition-opacity duration-200" // Use contain
                  onError={(e) => e.target.src = '/placeholder.svg'} // Image fallback
                />
              </Link>

              <div className="p-4 flex flex-col flex-grow"> {/* Use flex-grow */}
                <Link to={`/product/${item._id}/${userId}`} className="hover:text-orange-600">
                  <h3 className="font-medium mb-1 text-base line-clamp-2">{item.name}</h3>
                </Link>
                <div className="flex items-center mb-3 mt-auto pt-2"> {/* Push price/buttons down */}
                  <span className="font-bold text-lg text-orange-500">₹{item.salePrice?.toLocaleString('en-IN')}</span>
                   {item.regularPrice && item.regularPrice > item.salePrice && (
                      <span className="ml-2 text-gray-400 line-through text-sm">₹{item.regularPrice?.toLocaleString('en-IN')}</span>
                   )}
                </div>

                 {/* Original commented out buttons are kept, but added functional ones below */}
                 <div className="flex space-x-2 mt-2">
                   {/* Add to Cart button (uses original placeholder function) */}
                   <button
                     className="flex-1 bg-black text-white text-sm py-2 px-3 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50"
                     onClick={() => addToCart(item._id)} // Uses original placeholder
                     // disabled // Enable when implemented fully
                   >
                     <ShoppingCart size={16} className="mr-1.5" />
                     Add to Cart
                   </button>
                   {/* Remove from Wishlist button */}
                   <button
                     title="Remove from Wishlist"
                     aria-label="Remove from Wishlist"
                     className="w-10 h-9 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition duration-150 ease-in-out"
                     onClick={() => removeItem(item._id)} // Uses original removeItem
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty Wishlist Message (Original structure with optional icon)
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" /> {/* Optional: Icon */}
          <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your wishlist yet.</p>
          <Link
            to={`/home-page/${userId || ''}`} // Link to home
            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;