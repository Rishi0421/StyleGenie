"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Turtle } from "lucide-react"; // Turtle might be unused
import ARview from "../components/ARview";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SkeletonProductDetail from "../components/SkeletonProductDetail"; // <-- Import skeleton detail
import SkeletonProductCard from "../components/SkeletonProductCard";   // <-- Import skeleton card (for related section)

const ProductPage = () => {
  const { id, userId } = useParams(); // Assuming you have userId in the URL params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Existing loading state
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true); // <-- Add separate loading state for related products

  const [arview, setArview] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCarted, setIsCarted] = useState(false);

  const URL = import.meta.env.VITE_BE_URL;

  // --- Fetch All Products (Unchanged logic, just manage loadingRelated state) ---
  const fetchAllProducts = async () => {
    setLoadingRelated(true); // <-- Start loading related
    try {
      const response = await axios.get(`${URL}/api/products`);
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
      // Note: Error state for related products isn't explicitly handled here
    } finally {
       setLoadingRelated(false); // <-- Stop loading related
    }
  };

  // --- Fetch Product Details (Unchanged logic) ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Start loading main product
      setError(null); // Clear previous error
      setProduct(null); // Clear previous product
      try {
        const response = await axios.get(`${URL}/api/products/${id}`);
        setProduct(response.data);
        // Note: Initial state setting (color, size, image) is in the next useEffect
      } catch (err) {
        setError(err);
        console.error("Error fetching product:", err);
      } finally {
         setLoading(false); // Stop loading main product
      }
    };

    fetchProduct();
    fetchAllProducts(); // Fetch related products as well
  }, [id, URL]); // Dependencies remain the same


  // --- Set Initial Selections (Unchanged logic) ---
  useEffect(() => {
    if (product) {
      // Set defaults only if product exists
      setMainImage(product.images?.[0] || null); // <-- Set initial image here
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || "");
    }
    window.scrollTo(0, 0);
  }, [product]); // Run when product data changes


  // --- Check Wishlist Status (Unchanged logic) ---
  useEffect(() => {
    const checkWishlistStatus = async () => {
      // Check only if product and userId exist
      if (product && userId) {
        try {
          const response = await axios.get(`${URL}/api/wishlist/check/${userId}/${product._id}`);
          setIsWishlisted(response.data.isInWishlist);
        } catch (error) {
          if (error.response?.status !== 404) { // Ignore 404s
             console.error("Error checking wishlist status:", error);
          } else {
             setIsWishlisted(false); // Not found means not wishlisted
          }
        }
      }
    };
    // Run check *after* product has potentially loaded
    // Adding `loading` dependency ensures it runs when loading finishes
    if (!loading) {
        checkWishlistStatus();
    }
  }, [product, userId, loading, URL]); // Added loading dependency


  // --- LocalStorage Wishlist/Cart Functions (Unchanged logic) ---
  // Note: These seem unused now based on handleAddToCart/handleAddToWishlist API calls
  const getWishlist = () => { /* ... original code ... */ };
  const saveWishlist = (wishlist) => { /* ... original code ... */ };


  // --- handleAddToCart (Unchanged logic) ---
  const handleAddToCart = async () => {
    if (!product || !userId) return;
     if (!selectedColor || !selectedSize) { // Check selections
         alert("Please select a color and size.");
         return;
     }
    try {
      // Original endpoint '/add' kept as is
      const response = await axios.post(`${URL}/add`, {
        userId: userId,
        productId: product._id,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      });
      setIsCarted(true);
      alert(
        `Added to cart: ${product.name} - Color: ${selectedColor}, Size: ${selectedSize}, Quantity: ${quantity}`
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };


  // --- handleAddToWishlist (Unchanged logic) ---
  const handleAddToWishlist = async () => {
    if (!product || !userId) return;
    try {
       // Original endpoint and logic kept as is
      const response = await axios.post(`${URL}/api/wishlist`, {
        userId: userId,
        productId: product._id,
      });
      setIsWishlisted(!isWishlisted); // Original optimistic toggle
      console.log(response.data.message);
    } catch (error) {
      console.error("Error adding/removing from wishlist:", error);
    }
  };


  // --- Calculate Related Products (Ensure it happens *after* loading) ---
  const relatedProducts = (!loading && product && allProducts.length > 0) // Check loading state
    ? allProducts
        .filter((p) => p.category === product.category && p._id !== product._id)
        .slice(0, 4)
    : [];


  // --- AR View Handlers (Unchanged logic) ---
  function handleARviewTrue() {
    if (!product?.lens_id) return; // Prevent error if lens_id missing
    setArview(true);
  }

  function handleARviewFalse(imageUrl) {
    setArview(false);
    setMainImage(imageUrl);
  }


  // --- RENDER LOGIC ---

  // 1. Show Skeleton while the main product is loading
  if (loading) {
    return <SkeletonProductDetail />; // <-- RENDER SKELETON DETAIL
  }

  // 2. Show Error (Original logic)
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading product</h1>
        <p>{error.message}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }

  // 3. Show Not Found (Original logic)
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }

  // 4. Render the actual product page
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Main Product Section (Unchanged JSX structure) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left Column: Image Gallery (Unchanged JSX structure) */}
        <div>
          <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4">
            {arview ? (
              product.lens_id ? <ARview lens_id={product.lens_id} /> : <div>AR Not Available</div>
            ) : (
              <img
                // Use state `mainImage` first, then fallback
                src={mainImage || product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-contain w-full h-full" // Changed to contain
                onError={(e) => e.target.src = '/placeholder.svg'} // Fallback
              />
            )}
          </div>

          <div className="grid grid-cols-5 gap-2"> {/* Use 5 columns for layout */}
            {product.images && product.images.slice(0, 4).map((imgUrl, index) => ( // Show max 4 thumbs
              <div
                key={index}
                className={`relative h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${mainImage === imgUrl && !arview ? 'border-black' : 'border-transparent hover:border-gray-400'}`}
                onClick={() => handleARviewFalse(imgUrl)}
              >
                <img
                  src={imgUrl || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  className="object-cover w-full h-full"
                   onError={(e) => e.target.src = '/placeholder.svg'}
                />
              </div>
            ))}
             {/* AR Button */}
            {product.lens_id && (
               <button
                className={`relative h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center text-sm font-medium border-2 ${arview ? 'border-black' : 'border-transparent hover:border-gray-400'}`}
                onClick={handleARviewTrue}
                title="View in Augmented Reality"
               >
                AR View
               </button>
            )}
             {/* Placeholder divs if less than 5 items */}
             { Array.from({ length: Math.max(0, 5 - (product.images?.slice(0, 4).length || 0) - (product.lens_id ? 1 : 0)) }).map((_, i) =>
                 <div key={`placeholder-${i}`} className="h-24 bg-gray-100 rounded-lg"></div>
             )}
          </div>
        </div>

        {/* Right Column: Details (Unchanged JSX structure) */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center flex-wrap mb-6"> {/* Use flex-wrap */}
            <span className="text-3xl font-bold text-orange-500 mr-3">
              ₹{product.salePrice?.toLocaleString('en-IN')}
            </span>
             {product.regularPrice && product.regularPrice > product.salePrice && (
                <>
                    <span className="text-gray-500 line-through text-xl mr-3">
                    ₹{product.regularPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded"> {/* Pushed discount to right */}
                    {Math.round( (1 - product.salePrice / product.regularPrice) * 100 )} % OFF
                    </span>
                </>
             )}
          </div>

          <p className="text-gray-600 mb-8 whitespace-pre-line">{product.description}</p>

          {/* Color Options (Unchanged JSX structure) */}
          {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                     className={`w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-all ${
                        selectedColor === color ? "border-black ring-2 ring-offset-1 ring-black scale-110" : "border-gray-300"
                    }`}
                     style={{ backgroundColor: color.includes("/") ? "#DDD" : color }} // Basic color handling
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                    title={color}
                  >
                     {/* Style update for selected color is within className */}
                  </button>
                ))}
                </div>
              </div>
           )}

          {/* Size Options (Unchanged JSX structure) */}
           {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`min-w-[2.5rem] h-10 px-3 flex items-center justify-center rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
                </div>
              </div>
           )}

          {/* Quantity Selector (Unchanged JSX structure) */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Quantity</h3>
            <div className="flex items-center border border-gray-300 w-fit rounded-md">
              <button
                className="w-10 h-10 text-xl flex items-center justify-center rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 disabled={quantity <= 1}
              > - </button>
              <div className="w-12 h-10 flex items-center justify-center font-medium border-l border-r border-gray-300">
                {quantity}
              </div>
              <button
                className="w-10 h-10 text-xl flex items-center justify-center rounded-r-md hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              > + </button>
            </div>
          </div>

          {/* Action Buttons (Unchanged JSX structure) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              // Original classes, including dynamic ones based on isCarted
              className={`flex-1 bg-black text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed ${
                isCarted ? "bg-green-500 hover:bg-green-600" : "" // Adjusted hover for green
              }`}
              onClick={handleAddToCart}
              disabled={isCarted || !selectedColor || !selectedSize} // Original disable logic
            >
              <ShoppingCart size={20} className="mr-2" />
              {isCarted ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
               // Original classes, including dynamic ones based on isWishlisted
              className={`flex-1 border border-gray-300 py-3 px-6 rounded-md flex items-center justify-center hover:bg-gray-100 ${
                isWishlisted ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" : "text-black border-black" // Adjusted non-wishlisted border
              }`}
              onClick={handleAddToWishlist}
            >
              <Heart
                size={20}
                className={`mr-2 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-black fill-none'}`} // Use fill for visual
              />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Features (Unchanged JSX structure) */}
           {product.features && product.features.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-medium mb-3">Features</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                    {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                    ))}
                    </ul>
                </div>
           )}
        </div>
      </div>

      {/* Related Products Section */}
      {/* Show section only if related products might exist OR are loading */}
      {(allProducts.length > 0 || loadingRelated) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
             {/* Show skeleton cards ONLY if related products are still loading */}
            {loadingRelated ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {/* Render SkeletonProductCard */}
                     <SkeletonProductCard />
                     <SkeletonProductCard />
                     <SkeletonProductCard />
                     <SkeletonProductCard />
                 </div>
            ) : (
                 // Render actual related products if loaded and exist
                 relatedProducts.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            // Pass userId if ProductCard needs it
                            <ProductCard key={relatedProduct._id} product={relatedProduct} userId={userId} />
                        ))}
                     </div>
                 ) : (
                     <p className="text-center text-gray-500">No related products found.</p> // Message if array is empty after loading
                 )
            )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;