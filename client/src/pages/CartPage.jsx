"use client";

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react"; // Added ShoppingBag for empty state
import axios from "axios";
import { toast } from 'react-toastify'; // Import toast for potential feedback

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Existing loading state
  const [error, setError] = useState(null);

  //Address form states
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [checkout, setCheckout] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from params
  const URL = import.meta.env.VITE_BE_URL;

  // --- Fetch Cart Items (Original Logic) ---
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
          setError("User ID not found.");
          setLoading(false);
          return;
      }
      setLoading(true); // Start loading
      setError(null); // Clear previous error
      setCartItems([]); // Clear previous items

      try {
        const response = await axios.get(`${URL}/api/cart/${userId}`);
        // Assuming the API returns { items: [] } - adjust if needed
        setCartItems(response.data?.items || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError(error); // Store the error object
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCartItems();
  }, [userId, URL]); // Dependencies remain the same

  // --- Remove Item (Original Logic) ---
  const removeItem = async (productId) => {
     if (!userId || !productId) return; // Add productId check
     const originalItems = [...cartItems];
     setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId)); // Optimistic update
     toast.info("Removing item...");
    try {
      // Original endpoint kept
      await axios.delete(`${URL}/api/cart/remove/${userId}/${productId}`);
      toast.success("Item removed.");
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again."); // Original alert
      setCartItems(originalItems); // Rollback
      toast.error("Failed to remove item.");
    }
  };

  // --- Update Quantity (Original Logic) ---
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    if (!userId || !productId) return;

    // Store previous quantity for potential rollback
    let previousQuantity;
    const originalItems = cartItems.map(item => {
        if(item.productId === productId) {
            previousQuantity = item.quantity;
        }
        return {...item}; // Create copy
    });

    // Optimistic UI Update
     setCartItems((prevItems) =>
       prevItems.map((item) =>
         item.productId === productId ? { ...item, quantity: Number(newQuantity) } : item
       )
     );

    try {
      // Original endpoint kept
      await axios.put(`${URL}/api/cart/update/${userId}/${productId}`, { quantity: newQuantity });
       // Optional: toast.success("Quantity updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again."); // Original alert
      // Rollback optimistic update
       setCartItems((prevItems) =>
           prevItems.map((item) =>
               item.productId === productId ? { ...item, quantity: Number(previousQuantity) } : item
           )
       );
       toast.error("Failed to update quantity.");
    }
  };

  // --- Handle Address Change (Original Logic) ---
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // --- Handle Submit / Place Order (Original Logic) ---
  const handleSubmit = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) {
      alert("Please fill in all address fields."); // Original alert
      return;
    }
    if (!userId) {
        alert("User information is missing.");
        return;
    }
    if (cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    try {
      // Original endpoint kept
      const response = await axios.post(`${URL}/api/orders/create`, {
        userId: userId,
        items: cartItems,
        address: address,
        total: total, // Make sure total is calculated correctly
      });

      alert("Order placed successfully!"); // Original alert
      toast.success("Order placed successfully!");

      setCartItems([]); // Clear cart UI
      setCheckout(false); // Go back from checkout view

      // Navigate to order confirmation
      navigate(`/order-confirmation/${response.data.order._id}/${userId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again."); // Original alert
      toast.error("Failed to create order. Please try again.");
    }
  };

  // --- Calculations (Original Logic) ---
  // Ensure item.price is a number
  const subtotal = cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
  }, 0);
  const shipping = subtotal > 0 ? 99 : 0; // Only charge shipping if there's a subtotal
  const total = subtotal + shipping;


  // --- Skeleton Component for Cart Item Row ---
  const CartItemSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center animate-pulse">
      <div className="col-span-6 flex items-center">
        <div className="w-20 h-20 mr-4 bg-gray-300 rounded"></div>
        <div className="space-y-2 flex-1">
           <div className="h-4 bg-gray-300 rounded w-3/4"></div>
           <div className="h-3 bg-gray-300 rounded w-1/2"></div>
           <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
      <div className="col-span-2 h-4 bg-gray-300 rounded md:mx-auto"></div>
      <div className="col-span-2 h-8 bg-gray-300 rounded w-24 md:mx-auto"></div>
      <div className="col-span-2 h-5 bg-gray-300 rounded ml-auto w-16"></div>
    </div>
  );

   // --- Skeleton Component for Summary Box ---
   const SummarySkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/5"></div>
                </div>
                 <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                </div>
                 <div className="border-t pt-4 mt-4">
                     <div className="flex justify-between">
                         <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                         <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                     </div>
                 </div>
            </div>
            <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
   );


  // --- RENDER LOGIC ---

  // 1. Loading State: Show Skeletons
  if (loading) {
    return (
       <div className="container mx-auto px-4 py-12 min-h-screen">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skeleton for Cart Items List */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
                    <CartItemSkeleton />
                    <CartItemSkeleton />
                    <CartItemSkeleton />
                </div>
                {/* Skeleton for Summary */}
                <div className="lg:col-span-1">
                    <SummarySkeleton />
                </div>
           </div>
       </div>
    );
  }

  // 2. Error State (Original logic with slight improvement)
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading cart</h1>
        <p className="mb-4 text-gray-600">{error.message || "Could not fetch cart details."}</p>
         <Link to={`/home-page/${userId || ''}`} className="text-blue-600 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }

  // 3. Loaded State (Empty or With Items)
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen"> {/* Added min-h-screen */}
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        // Cart Has Items: Render Grid (Original JSX structure)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items (Original JSX) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"> {/* Added border */}
              {/* Header Row (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b">
                <div className="col-span-6"><span className="font-medium text-sm text-gray-600">Product</span></div>
                <div className="col-span-2 text-center"><span className="font-medium text-sm text-gray-600">Price</span></div>
                <div className="col-span-2 text-center"><span className="font-medium text-sm text-gray-600">Quantity</span></div>
                <div className="col-span-2 text-right"><span className="font-medium text-sm text-gray-600">Total</span></div>
              </div>

              {/* Cart Item Rows (Original Mapping Logic) */}
              {cartItems.map((item) => (
                <div
                  // Ensure key is unique, combining relevant fields
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b items-center"
                >
                   {/* Product Details */}
                  <div className="col-span-12 md:col-span-6 flex items-center">
                    <Link to={`/product/${item.productId}/${userId}`} className="block flex-shrink-0">
                        <div className="relative w-20 h-20 mr-4 bg-gray-100 rounded overflow-hidden">
                        <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name || 'Product image'}
                            className="object-contain w-full h-full" // Use contain
                            onError={(e) => e.target.src = '/placeholder.svg'} // Fallback
                        />
                        </div>
                    </Link>
                    <div className="flex-grow">
                      <Link to={`/product/${item.productId}/${userId}`} className="hover:text-orange-600">
                          <h3 className="font-medium text-base line-clamp-2">{item.name}</h3>
                      </Link>
                      {/* Display selected variant */}
                      {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      {/* Remove button for mobile */}
                      <button
                        className="text-red-500 text-sm flex items-center mt-2 md:hidden hover:text-red-700"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 size={14} className="mr-1" />Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-6 md:col-span-2 text-left md:text-center">
                    <span className="md:hidden font-medium mr-2 text-gray-600">Price:</span>
                    <span>₹{Number(item.price)?.toLocaleString('en-IN') || 'N/A'}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-6 md:col-span-2 flex justify-start md:justify-center">
                     <span className="md:hidden font-medium mr-2 text-gray-600">Qty:</span>
                    <div className="flex items-center border border-gray-300 rounded w-fit">
                       <button
                         className="w-8 h-8 text-lg flex items-center justify-center rounded-l hover:bg-gray-100 disabled:opacity-50"
                         onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                         disabled={item.quantity <= 1}
                         aria-label="Decrease quantity"
                       >-</button>
                       <div className="w-10 h-8 flex items-center justify-center font-medium text-sm border-l border-r border-gray-300">
                         {item.quantity}
                       </div>
                       <button
                         className="w-8 h-8 text-lg flex items-center justify-center rounded-r hover:bg-gray-100"
                         onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                         aria-label="Increase quantity"
                       >+</button>
                     </div>
                  </div>

                  {/* Total & Remove Button (Desktop) */}
                  <div className="col-span-12 md:col-span-2 text-right flex justify-between md:justify-end items-center mt-2 md:mt-0">
                    <span className="md:hidden font-medium mr-2 text-gray-600">Total:</span>
                    <span className="font-medium">₹{(Number(item.price || 0) * Number(item.quantity || 0))?.toLocaleString('en-IN')}</span>
                    <button title="Remove Item" aria-label="Remove Item" className="text-gray-500 ml-4 hidden md:block hover:text-red-600" onClick={() => removeItem(item.productId)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Link (Original JSX) */}
            <div className="mt-8 flex justify-between items-center">
              <Link to={`/home-page/${userId || ''}`} className="text-blue-600 hover:underline flex items-center">
                <ArrowRight size={16} className="mr-1 transform rotate-180" /> {/* Adjusted icon margin */}
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Summary or Checkout Form (Original Logic/JSX) */}
          <div className="lg:col-span-1">
            {checkout ? (
              // Checkout Address Form (Original JSX)
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Enter Your Address</h2> {/* Changed font weight */}
                <div className="space-y-4 mb-6"> {/* Increased spacing */}
                  {/* Street */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="street">Street Address</label>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" id="street" type="text" name="street" value={address.street} onChange={handleAddressChange} required/>
                  </div>
                   {/* City */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="city">City</label>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" id="city" type="text" name="city" value={address.city} onChange={handleAddressChange} required/>
                  </div>
                   {/* State */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="state">State / Province</label>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" id="state" type="text" name="state" value={address.state} onChange={handleAddressChange} required/>
                  </div>
                   {/* Zip */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="zip">ZIP / Postal Code</label>
                    <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" id="zip" type="text" name="zip" value={address.zip} onChange={handleAddressChange} required/>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out" onClick={handleSubmit}>
                  Confirm & Place Order
                </button>
                 <button className="w-full mt-3 text-center text-sm text-gray-600 hover:underline" onClick={() => setCheckout(false)}>
                   Back to Summary
                 </button>
              </div>
            ) : (
              // Order Summary (Original JSX)
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{subtotal > 0 ? `₹${shipping.toLocaleString('en-IN')}` : 'Calculated at checkout'}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg"> {/* Increased font size */}
                      <span>Total</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Including applicable taxes</p>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-150 ease-in-out" onClick={() => setCheckout(true)}>
                  Proceed to Checkout
                </button>
              </div>
            )}

             {/* Payment Methods (Placeholder - Original JSX) */}
             {!checkout && (
                <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-2">We accept:</p>
                    <div className="flex space-x-2">
                        {/* Replace with actual payment icons */}
                        <div className="w-10 h-6 bg-gray-200 rounded border"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded border"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded border"></div>
                        <div className="w-10 h-6 bg-gray-200 rounded border"></div>
                    </div>
                </div>
             )}
          </div>
        </div>
      ) : (
        // Cart is Empty Message (Original JSX structure)
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
           <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" /> {/* Optional Icon */}
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
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

export default CartPage;