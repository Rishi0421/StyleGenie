"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingCart, Camera, Loader2 } from "lucide-react"; // Ensure all icons are imported
import ARview from "../components/ARview"; // Assuming this component renders the AR
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SkeletonProductDetail from "../components/SkeletonProductDetail";
import SkeletonProductCard from "../components/SkeletonProductCard";
import FeedbackPopup from "../components/FeedbackPopup"; // <-- Import the popup

// Array of random feedback messages
const appearanceFeedbackMessages = [
    "The T-shirt fits perfectly and enhances your look. The color is vibrant, and the design is bold, making it a stylish and comfortable choice for casual wear.",
    "This T-shirt fits just right. The fabric looks soft and comfortable, while the design adds a cool, modern touch that perfectly complements your casual style.",
    "The T-shirt looks great! The fit is spot on, and the design is eye-catching. It’s a comfortable yet stylish option that will fit right in with your wardrobe.",
    "That T-shirt fits really well. The material appears soft, and the design is bold but not overwhelming, making it a perfect casual piece for any occasion.",
    "The T-shirt fits well, and the design adds just the right amount of personality to your look. The color complements your style, making it a perfect match.",
    "The fit is great! The T-shirt looks comfortable and gives off a casual, trendy vibe. The design and color are perfect for adding a little flair to your wardrobe.",
    "This T-shirt looks fantastic on you. The fit is relaxed but still flattering, and the graphic design really pops, adding a fun touch to your everyday outfit.",
    "The fit is spot on, and the color really suits you. The design is simple yet stylish, making it an ideal addition to your casual wardrobe.",
    "The T-shirt looks great! It fits comfortably around the shoulders and chest, and the design is modern and eye-catching. It’s a great choice for a laid-back day.",
    "The T-shirt fits perfectly and feels comfortable. The graphic design adds a stylish touch without being too loud, making it a great option for casual wear.",
    "This T-shirt fits you well, and the design is stylish yet subtle. The color enhances your look, making it perfect for a laid-back, comfortable style.",
    "The fit is great! The T-shirt looks soft and comfy, and the design gives it a stylish edge. It’s the perfect casual option for everyday wear.",
    "That T-shirt fits you perfectly! The color and design look amazing, giving off a relaxed, cool vibe that’s perfect for casual outings or lounging at home.",
    "The T-shirt looks fantastic on you. The fit is ideal, and the color complements your overall style. The design adds a cool, trendy touch to your look.",
    "This T-shirt fits comfortably and looks stylish. The color is vibrant, and the design makes it stand out in the best way, giving your outfit a fresh, modern look.",
    "The T-shirt fits perfectly, with the color and design adding a unique touch to your style. It’s the perfect piece to add some personality to a casual outfit.",
    "It’s looking great! The T-shirt fits nicely, and the graphic adds a fun, trendy vibe. The color works well with your style, making it a versatile piece for any casual occasion.",
    "This T-shirt fits just right, and the design adds a nice touch of flair. The color complements your overall style, making it a great choice for everyday wear.",
    "The T-shirt fits you perfectly, and the color is bold yet flattering. The design is stylish and adds an extra layer of personality to your casual look.",
    "The T-shirt fits well, and the color and design are spot on. It’s a comfortable, stylish piece that adds a little extra character to your everyday outfit.",
    "The fit is ideal, and the color really pops. The T-shirt’s graphic design is modern and gives your outfit a stylish edge without being too loud.",
    "This T-shirt looks great! The fit is comfortable and casual, and the design adds a unique touch. It’s an effortless addition to any laid-back, stylish look.",
    "The T-shirt fits perfectly! The design is fresh, and the fabric looks soft and comfortable. It’s a great option to add a bit of personality to your casual outfits.",
    "It looks perfect! The fit is great, and the design adds a fun element to your look. The color is vibrant, and the fabric looks super comfortable.",
    "The T-shirt looks great on you. It fits perfectly, and the color suits your style well. The design is bold, adding a unique touch to your overall outfit.",
    "The fit is just right! The T-shirt is comfortable, and the graphic design adds a stylish edge. It’s a great casual piece that’s both trendy and timeless.",
    "That T-shirt looks fantastic! The fit is great, and the design adds a modern touch to your style. The color complements your look, making it perfect for casual wear.",
    "The T-shirt fits really well, and the design is both simple and stylish. The color enhances your look, making it a versatile, easy choice for casual occasions.",
    "This T-shirt fits comfortably, and the design is both modern and timeless. The color is perfect for your style, making it a great addition to your wardrobe.",
    "The fit is perfect! The T-shirt gives off a relaxed, laid-back vibe, while the design adds a cool touch. It’s a stylish, comfortable piece for everyday wear."
];


const ProductPage = () => {
  const { id, userId } = useParams(); // Assuming you have userId in the URL params

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const [arview, setArview] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCarted, setIsCarted] = useState(false);

  // --- State for Size Analysis & Popup ---
  const [isAnalyzingSize, setIsAnalyzingSize] = useState(false);
  const [suggestedSize, setSuggestedSize] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [appearanceFeedback, setAppearanceFeedback] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // State for popup visibility
  // ------------------------------------

  const URL = import.meta.env.VITE_BE_URL;

  // --- Fetch All Products ---
  const fetchAllProducts = async () => {
    setLoadingRelated(true);
    try {
      const response = await axios.get(`${URL}/api/products`);
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
       setLoadingRelated(false);
    }
  };

  // --- Fetch Product Details ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      setArview(false); // Reset AR view on product change
      // Reset analysis state on product change
      setIsAnalyzingSize(false);
      setSuggestedSize(null);
      setAnalysisError(null);
      setAppearanceFeedback(null); // Reset feedback
      setShowFeedbackPopup(false); // Reset popup state
      setIsCarted(false); // Reset local carted state
      try {
        const response = await axios.get(`${URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching product:", err);
      } finally {
         setLoading(false);
      }
    };

    fetchProduct();
    fetchAllProducts(); // Fetch related products as well
  }, [id, URL]);

  // --- Set Initial Selections ---
  useEffect(() => {
    if (product) {
      setMainImage(product.images?.[0] || null);
      setSelectedColor(product.colors?.[0] || "");
      setSelectedSize(product.sizes?.[0] || ""); // Set initial based on product data
    }
    window.scrollTo(0, 0);
  }, [product]);

  // --- Check Wishlist Status ---
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (product && userId) {
        try {
          const response = await axios.get(`${URL}/api/wishlist/check/${userId}/${product._id}`);
          setIsWishlisted(response.data.isInWishlist);
        } catch (error) {
          if (error.response?.status !== 404) {
             console.error("Error checking wishlist status:", error);
          } else {
             setIsWishlisted(false);
          }
        }
      }
    };
    if (!loading) {
        checkWishlistStatus();
    }
  }, [product, userId, loading, URL]);

  // --- handleAddToCart ---
  const handleAddToCart = async () => {
    if (!product || !userId) return;
     if (!selectedColor || !selectedSize) {
         alert("Please select a color and size.");
         return;
     }
    try {
      // Using the original endpoint '/add'. Ensure it's correct on your backend.
      const response = await axios.post(`${URL}/add`, {
        userId: userId,
        productId: product._id,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      });
      setIsCarted(true); // Update local state optimistically
      alert(
        `Added to cart: ${product.name} - Color: ${selectedColor}, Size: ${selectedSize}, Quantity: ${quantity}`
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
      setIsCarted(false); // Revert optimistic update on error
    }
  };

  // --- handleAddToWishlist ---
  const handleAddToWishlist = async () => {
    if (!product || !userId) return;
    const wasWishlisted = isWishlisted;
    setIsWishlisted(!isWishlisted); // Optimistic UI update

    try {
       if (wasWishlisted) {
          // Assumes a DELETE endpoint like this exists. Adjust if necessary.
          await axios.delete(`${URL}/api/wishlist/remove/${userId}/${product._id}`);
          console.log("Removed from wishlist");
       } else {
          await axios.post(`${URL}/api/wishlist`, {
            userId: userId,
            productId: product._id,
          });
          console.log("Added to wishlist");
       }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setIsWishlisted(wasWishlisted); // Rollback UI on error
      alert("Failed to update wishlist. Please try again.");
    }
  };

  // --- Calculate Related Products ---
  const relatedProducts = (!loading && product && allProducts.length > 0)
    ? allProducts
        .filter((p) => p.category === product.category && p._id !== product._id)
        .slice(0, 4)
    : [];

  // --- AR View Handlers ---
  function handleARviewTrue() {
    if (!product?.lens_id) return;
    setArview(true);
    // Reset analysis state when entering AR
    setIsAnalyzingSize(false);
    setSuggestedSize(null);
    setAnalysisError(null);
    setAppearanceFeedback(null);
    setShowFeedbackPopup(false); // Ensure popup closed on entering AR
  }

  function handleARviewFalse(imageUrl) {
    setArview(false);
    setMainImage(imageUrl);
    // Optionally keep or clear analysis state when leaving AR manually
  }

  // --- !! MODIFIED: Handle Capture and Size/Appearance Analysis (Opens Popup) !! ---
  const handleCaptureAndAnalyze = () => {
    if (!product || !product.sizes || product.sizes.length === 0) {
      // Set error state and show popup immediately with error
      setAnalysisError("Product has no sizes defined for analysis.");
      setAppearanceFeedback(null);
      setSuggestedSize(null);
      setIsAnalyzingSize(false); // Not analyzing if error upfront
      setShowFeedbackPopup(true); // Show popup with error message
      return;
    }

    setIsAnalyzingSize(true); // Show loading on button
    setSuggestedSize(null);
    setAnalysisError(null);
    setAppearanceFeedback(null);
    setShowFeedbackPopup(false); // Ensure popup is closed while analyzing

    console.log("Simulating AR image capture and size/appearance analysis...");

    // Simulate network/processing delay
    setTimeout(() => {
      let finalSuggestedSize = null;
      let randomFeedback = null;
      let currentError = null;

      try {
        // --- Part 1: Size Suggestion (Biased towards L/XL) ---
        const availableSizes = product.sizes;
        const preferredSizes = ['L', 'XL', 'XXL']; // Define preferred larger sizes
        const availablePreferredSizes = availableSizes.filter(size =>
          preferredSizes.includes(size.toUpperCase()) // Case-insensitive check
        );

        if (availablePreferredSizes.length > 0) {
          // If L, XL, or XXL are available, randomly pick one of them
          const randomIndex = Math.floor(Math.random() * availablePreferredSizes.length);
          finalSuggestedSize = availablePreferredSizes[randomIndex];
        } else if (availableSizes.length > 0) {
          // If no preferred sizes, pick a random size from ALL available sizes
          const randomIndex = Math.floor(Math.random() * availableSizes.length);
          finalSuggestedSize = availableSizes[randomIndex];
        }

        // Set error if no size could be determined
        if (!finalSuggestedSize) {
          currentError = "No sizes available to suggest for this product.";
        }

        // --- Part 2: Appearance Feedback (Random Selection) ---
        // Only provide feedback if size suggestion was successful
        if (finalSuggestedSize) {
          const feedbackIndex = Math.floor(Math.random() * appearanceFeedbackMessages.length);
          randomFeedback = appearanceFeedbackMessages[feedbackIndex];
        }

      } catch (err) {
        console.error("Error during simulated analysis:", err);
        currentError = "An error occurred during analysis simulation.";
        // Ensure feedback is cleared on catch
        randomFeedback = null;
        finalSuggestedSize = null;
      } finally {
        // --- Part 3: Update State & Show Popup ---
        setSuggestedSize(finalSuggestedSize);
        setAppearanceFeedback(randomFeedback);
        setAnalysisError(currentError);
        setIsAnalyzingSize(false); // Hide loading on button
        setShowFeedbackPopup(true); // <-- Show the popup with results/error
      }
    }, 1500); // 1.5 second delay
  };

  // --- Popup Handlers ---
  const handleClosePopup = () => {
    setShowFeedbackPopup(false);
  };

  const handleSelectSuggestedSize = (size) => {
    if (size) {
      setSelectedSize(size); // Update the main page's selected size
    }
    handleClosePopup(); // Close the popup after selection
  };


  // --- RENDER LOGIC ---

  // 1. Show Skeleton while the main product is loading
  if (loading) {
    return <SkeletonProductDetail />;
  }

  // 2. Show Error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error loading product</h1>
        <p>{error.message || "An unknown error occurred."}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to home page
        </Link>
      </div>
    );
  }

  // 3. Show Not Found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Return to home page
        </Link>
      </div>
    );
  }

  // 4. Render the actual product page
  return (
    <div className="container mx-auto px-4 py-12">
      {/* ============================ */}
      {/* == Main Product Section == */}
      {/* ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

        {/* --- Left Column: Image Gallery & AR View --- */}
        <div>
          {/* Main Image / AR View Area */}
          <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden mb-4 border">
            {arview ? (
              product.lens_id ? (
                <>
                  <ARview lens_id={product.lens_id} />
                  {/* --- AR Capture Button (NO results here anymore) --- */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
                    <button
                      onClick={handleCaptureAndAnalyze}
                      disabled={isAnalyzingSize}
                      className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzingSize ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        <Camera size={20} className="mr-2" />
                      )}
                      {isAnalyzingSize ? 'Analyzing...' : 'Capture & Analyze Fit'}
                    </button>
                  </div>
                  {/* --- End AR Capture Button --- */}
                </>
              ) : (
                 // Fallback if AR enabled but no lens_id
                 <div className="w-full h-full flex items-center justify-center text-gray-500">
                    AR View not available for this product.
                 </div>
              )
            ) : (
               // Regular Image View
              <img
                src={mainImage || product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                className="object-contain w-full h-full"
                onError={(e) => e.target.src = '/placeholder.svg'} // Fallback for broken images
              />
            )}
          </div>

          {/* Thumbnails & AR Toggle */}
          <div className="grid grid-cols-5 gap-2">
            {product.images && product.images.slice(0, 4).map((imgUrl, index) => (
              <div
                key={index}
                className={`relative h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === imgUrl && !arview ? 'border-black scale-105' : 'border-transparent hover:border-gray-400'}`}
                onClick={() => handleARviewFalse(imgUrl)} // Sets image AND turns off AR
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
                className={`relative h-24 bg-gray-200 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center text-sm font-medium border-2 transition-all ${arview ? 'border-black scale-105 ring-2 ring-offset-1 ring-black' : 'border-transparent hover:border-gray-400'}`}
                onClick={handleARviewTrue} // Turns on AR
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
        {/* --- End Left Column --- */}


        {/* --- Right Column: Details --- */}
        <div>
          {/* Product Name */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center flex-wrap mb-6">
            <span className="text-3xl font-bold text-orange-500 mr-3">
              ₹{product.salePrice?.toLocaleString('en-IN')}
            </span>
             {product.regularPrice && product.regularPrice > product.salePrice && (
                <>
                    <span className="text-gray-500 line-through text-xl mr-3">
                    ₹{product.regularPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {Math.round( (1 - product.salePrice / product.regularPrice) * 100 )} % OFF
                    </span>
                </>
             )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-8 whitespace-pre-line">{product.description}</p>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Color: <span className="font-normal text-gray-700">{selectedColor || 'Select a color'}</span></h3>
                <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                     className={`w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-all ${
                        selectedColor === color ? "border-black ring-2 ring-offset-1 ring-black scale-110" : "border-gray-300 hover:border-gray-500"
                    }`}
                     style={{ backgroundColor: color.includes("/") ? "#DDD" : color }} // Basic handling for image paths/complex colors
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                    title={color}
                  >
                    {color.includes("/") && selectedColor === color && <span className="text-xs text-black">✓</span>}
                  </button>
                ))}
                </div>
              </div>
           )}

          {/* Size Options */}
           {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Size: <span className="font-normal text-gray-700">{selectedSize || 'Select a size'}</span></h3>
                <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`min-w-[2.5rem] h-10 px-3 flex items-center justify-center rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white border-black font-semibold"
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

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Quantity</h3>
            <div className="flex items-center border border-gray-300 w-fit rounded-md">
              <button
                className="w-10 h-10 text-xl flex items-center justify-center rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 disabled={quantity <= 1}
                 aria-label="Decrease quantity"
              > - </button>
              <div className="w-12 h-10 flex items-center justify-center font-medium border-l border-r border-gray-300" aria-live="polite">
                {quantity}
              </div>
              <button
                className="w-10 h-10 text-xl flex items-center justify-center rounded-r-md hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
                 aria-label="Increase quantity"
              > + </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              className={`flex-1 bg-black text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                isCarted ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              onClick={handleAddToCart}
              // Disable if no color/size selected OR if already added (local state) OR if analyzing
              disabled={isCarted || !selectedColor || !selectedSize || loading || isAnalyzingSize}
            >
              <ShoppingCart size={20} className="mr-2" />
              {isCarted ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              className={`flex-1 border py-3 px-6 rounded-md flex items-center justify-center transition-colors duration-200 ${
                isWishlisted
                    ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100 hover:border-red-400"
                    : "text-black border-black hover:bg-gray-100"
              }`}
              onClick={handleAddToWishlist}
              // Disable while main product might be loading/changing OR if analyzing
              disabled={loading || isAnalyzingSize}
            >
              <Heart
                size={20}
                className={`mr-2 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-black fill-none'}`}
              />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Features */}
           {product.features && product.features.length > 0 && (
                <div className="pt-6 border-t border-gray-200"> {/* Added border */}
                    <h3 className="text-lg font-medium mb-3">Features</h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                    {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                    ))}
                    </ul>
                </div>
           )}
        </div>
        {/* --- End Right Column --- */}

      </div>
      {/* ============================ */}
      {/* == End Main Product Section == */}
      {/* ============================ */}


      {/* ================================= */}
      {/* == Additional Details Section == */}
      {/* ================================= */}
      {/* This is the section corresponding to the red highlighted area */}
      <div className="my-16 py-8 border-t border-b border-gray-200"> {/* Added styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

          {/* Column 1: Specifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
            {product?.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 ? (
                // If 'specifications' is an object with keys
                <ul className="list-none space-y-2 text-gray-700">
                    {Object.entries(product.specifications).map(([key, value]) => (
                       <li key={key}><strong className="font-medium text-gray-800">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}</li>
                    ))}
                </ul>
             ) : product?.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                 // If 'specifications' is an array of strings
                <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                    {product.specifications.map((spec, index) => <li key={index}>{spec}</li>)}
                </ul>
             ) : (
                // Fallback if no specifications data or unexpected format
                <p className="text-gray-600">Details such as material and fit will be available soon.</p>
                
             )}
          </div>

          {/* Column 2: Care Instructions */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Care Instructions</h3>
             {product?.care_instructions ? (
                 <p className="text-gray-700 whitespace-pre-line">{product.care_instructions}</p>
             ) : (
                 // Fallback care instructions
                 <p className="text-gray-700">
                     Machine wash cold, inside-out, gentle cycle with mild detergent and similar colors. Use non-chlorine bleach, only when necessary. No fabric softeners. Tumble dry low, or hang-dry for longest life. Cool iron inside-out if necessary. Do not iron decoration. Do not dry clean.
                 </p>
             )}
          </div>

        </div>
      </div>
      {/* ===================================== */}
      {/* == End Additional Details Section == */}
      {/* ===================================== */}


      {/* ============================ */}
      {/* == Related Products Section == */}
      {/* ============================ */}
      {(allProducts.length > 0 || loadingRelated) && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            {loadingRelated ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     <SkeletonProductCard />
                     <SkeletonProductCard />
                     <SkeletonProductCard />
                     <SkeletonProductCard />
                 </div>
            ) : (
                 relatedProducts.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard key={relatedProduct._id} product={relatedProduct} userId={userId} />
                        ))}
                     </div>
                 ) : (
                     <p className="text-center text-gray-500">No related products found in this category.</p>
                 )
            )}
        </div>
      )}
      {/* ================================ */}
      {/* == End Related Products Section == */}
      {/* ================================ */}

      {/* ====================== */}
      {/* == Feedback Popup == */}
      {/* ====================== */}
      <FeedbackPopup
        isOpen={showFeedbackPopup}
        onClose={handleClosePopup}
        suggestedSize={suggestedSize}
        feedback={appearanceFeedback}
        error={analysisError}
        onSelectSize={handleSelectSuggestedSize} // Pass the handler
      />

    </div> // End Container div
  );
};

export default ProductPage;