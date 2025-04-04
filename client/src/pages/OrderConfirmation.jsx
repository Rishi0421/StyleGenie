// OrderConfirmation.jsx
import { useParams, Link } from "react-router-dom"; // Import Link
import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react"; // Optional: Icon for confirmation

const OrderConfirmation = () => {
  const { orderId, userId } = useParams(); // Get userId too if needed for links
  const [order, setOrder] = useState(null); // Initialize with null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = import.meta.env.VITE_BE_URL;

  // --- Fetch Order Details (Original Logic) ---
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
          setError(new Error("Order ID is missing."));
          setLoading(false);
          return;
      }
      setLoading(true); // Start loading
      setError(null); // Clear previous error
      setOrder(null); // Clear previous order

      try {
        const response = await axios.get(`${URL}/api/orders/${orderId}`);
        // Assuming response.data directly contains the order object or { order: {...} }
        const orderData = response.data.order || response.data;
        if (!orderData || !orderData._id) { // Check if order data seems valid
            throw new Error("Order data not found in response.");
        }
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error); // Store error object
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchOrder();
  }, [orderId, URL]); // Dependency array remains the same


  // --- Skeleton Component for Order Confirmation ---
  const OrderConfirmationSkeleton = () => (
      <div className="container mx-auto px-4 py-12 animate-pulse">
          {/* Skeleton Title */}
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              {/* Skeleton Section Header */}
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>

              {/* Skeleton Order Details */}
              <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>

              {/* Skeleton Address Header */}
              <div className="h-5 bg-gray-300 rounded w-1/3 mb-4 mt-6"></div>
              {/* Skeleton Address Details */}
              <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>

               {/* Skeleton Items Header */}
              <div className="h-5 bg-gray-300 rounded w-1/4 mb-4 mt-6"></div>
               {/* Skeleton Order Item Row */}
               <div className="flex items-center space-x-4 py-3 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                    <div className="flex-grow space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                         <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
               </div>
                <div className="flex items-center space-x-4 py-3 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                    <div className="flex-grow space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                         <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
               </div>
               {/* Add more item skeletons if needed */}
          </div>
      </div>
  );


  // --- RENDER LOGIC ---

  // 1. Loading State: Show Skeleton
  if (loading) {
    return <OrderConfirmationSkeleton />; // <-- RENDER SKELETON
  }

  // 2. Error State (Original logic with slight improvement)
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error Loading Order</h1>
        <p className="text-gray-600 mb-6">{error.message || "Could not fetch order details."}</p>
         <Link
             to={`/home-page/${userId || ''}`} // Link to home, handle missing userId
             className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
         >
             Go Back Home
         </Link>
      </div>
    );
  }

  // 3. Not Found State (Original logic)
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
         <p className="text-gray-600 mb-6">We couldn't find an order with the ID: {orderId}</p>
         <Link
             to={`/home-page/${userId || ''}`} // Link to home, handle missing userId
             className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
         >
             Go Back Home
         </Link>
      </div>
    );
  }

  // 4. Loaded State: Render Order Details (Original JSX structure with minor improvements)
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Confirmation Header */}
       <div className="text-center mb-10">
           <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
           <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
           <p className="text-lg text-gray-600 mt-2">Thank you for your purchase.</p>
       </div>


      {/* Order Details Box */}
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200 max-w-3xl mx-auto"> {/* Centered content */}
        <h2 className="text-xl font-semibold mb-6 border-b pb-3">Order Summary</h2>

        {/* Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-6 text-sm">
            <div><span className="font-medium text-gray-600">Order ID:</span> {order.orderNumber || order._id}</div>
            <div><span className="font-medium text-gray-600">Order Date:</span> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</div>
            <div className="sm:col-span-2"><span className="font-medium text-gray-600">Total Amount:</span> <span className="font-bold text-lg">₹{Number(order.totalAmount)?.toLocaleString('en-IN') || 'N/A'}</span></div>
        </div>


        {/* Shipping Address */}
        {order.shippingAddress && (
            <>
                <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Shipping Address</h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    {/* Add country if available */}
                </div>
            </>
        )}

        {/* Order Items */}
        {order.products && order.products.length > 0 && (
            <>
                <h3 className="text-lg font-semibold mt-6 mb-3 border-t pt-4">Items Ordered</h3>
                <ul className="space-y-4">
                {order.products.map((item) => (
                    // Use a unique key combining identifiers if possible
                    <li key={`${item.productId}-${item.color}-${item.size}`} className="flex items-center space-x-4 text-sm">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden border">
                            <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name || 'Product Image'}
                                className="object-contain w-full h-full" // Use contain
                                onError={(e) => e.target.src='/placeholder.svg'}
                            />
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-gray-800">{item.name || 'Product Name'}</p>
                             {/* Display variant if available */}
                             {(item.color || item.size) && (
                                <p className="text-xs text-gray-500">
                                    {item.color && `Color: ${item.color}`} {item.size && `Size: ${item.size}`}
                                </p>
                             )}
                            <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                        <div className="text-right font-medium">
                            ₹{(Number(item.price || 0) * Number(item.quantity || 1))?.toLocaleString('en-IN')}
                        </div>
                    </li>
                ))}
                </ul>
            </>
        )}
         {/* Link back to shopping */}
         <div className="mt-8 text-center border-t pt-6">
             <Link
                to={`/home-page/${userId || ''}`} // Link to home, handle missing userId
                className="inline-block bg-black text-white px-6 py-2.5 rounded-md hover:bg-gray-800 text-sm"
             >
                 Continue Shopping
             </Link>
         </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;