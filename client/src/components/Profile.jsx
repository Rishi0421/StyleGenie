import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link
import { ShoppingBag, User, Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react'; // Cleaned up imports, added Chevrons
import axios from 'axios';
import ProfileSkeleton from './ProfileSkeleton'; // <-- Import the skeleton component

// Make sure ProfileSkeleton component exists in the specified path

const URL = import.meta.env.VITE_BE_URL; // Ensure this is set in your .env file

// --- Order Progress Component (Slightly refined styling) ---
const OrderProgress = ({ status }) => {
  const steps = [
      { id: "pending", name: "Pending" },
      { id: "processing", name: "Processing" },
      { id: "shipped", name: "Shipped" },
      { id: "delivered", name: "Delivered" },
  ];
  const isCancelled = status === 'cancelled';
  // Find the index of the current status, defaulting to -1 if not found or invalid
  const currentStatusIndex = steps.findIndex(step => step.id?.toLowerCase() === status?.toLowerCase());

  if (isCancelled) {
      return (
          <div className="w-full my-6 p-3 bg-red-50 border border-red-200 rounded-md text-center">
              <p className="font-medium text-sm text-red-700">Order Cancelled</p>
          </div>
      );
  }

  return (
    <div className="w-full my-6 px-2 sm:px-0"> {/* Removed horizontal padding for better line fit */}
      <div className="flex items-start justify-between relative"> {/* Use items-start for text alignment */}
        {/* Progress Lines */}
        <div className="absolute left-0 top-[10px] h-1 w-full z-0"> {/* Ensure line is behind dots */}
             <div className={`absolute left-0 top-0 h-1 bg-gray-200 w-full rounded`}></div>
             <div
                className={`absolute left-0 top-0 h-1 bg-lime-400 rounded transition-all duration-500 ease-in-out`}
                // Calculate width based on the *space between* steps, not number of steps
                style={{ width: currentStatusIndex > 0 ? `${(currentStatusIndex / (steps.length - 1)) * 100}%` : '0%' }}
             />
        </div>

        {/* Steps and Dots */}
        {steps.map((step, index) => (
          <div key={step.id}
               className="flex-1 flex flex-col items-center relative z-10 text-center"
               // Add margin to first/last for better alignment if needed, or rely on flex spacing
               style={{
                 marginLeft: index === 0 ? '0' : '-10px', // Adjust overlap slightly
                 marginRight: index === steps.length - 1 ? '0' : '-10px',
               }}
               >
              {/* Dot */}
              <div
                 className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-1
                    ${index < currentStatusIndex ? 'bg-lime-400 border-lime-500' : // Completed
                     index === currentStatusIndex ? 'bg-lime-500 border-lime-600 ring-4 ring-lime-100' : // Current
                     'bg-white border-gray-300'}`} // Pending
              >
                  {index < currentStatusIndex && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              {/* Label */}
              <span className={`text-xs font-medium capitalize whitespace-nowrap px-1 ${index <= currentStatusIndex ? 'text-lime-700' : 'text-gray-500'}`}>
                  {step.name}
              </span>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Order Card Component (UI Improvements) ---
const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper function to format currency (assuming INR)
  const formatCurrency = (amount) => {
      return Number(amount || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  }

  // Helper for status badge styling
  const getStatusClass = (status) => {
     switch (status?.toLowerCase()) {
       case 'delivered': return 'bg-green-100 text-green-800';
       case 'shipped': return 'bg-blue-100 text-blue-800';
       case 'processing': return 'bg-yellow-100 text-yellow-800';
       case 'pending': return 'bg-orange-100 text-orange-800';
       case 'cancelled': return 'bg-red-100 text-red-800';
       default: return 'bg-gray-100 text-gray-800';
     }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-5 mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Clickable Header */}
      <div
        className="flex justify-between items-center cursor-pointer gap-4"
        onClick={() => setExpanded(!expanded)}
        role="button" // Accessibility
        aria-expanded={expanded}
        aria-controls={`order-details-${order._id}`} // Accessibility
      >
        {/* Left side */}
        <div className='flex-1 min-w-0'> {/* Allow shrinking */}
          <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">Order #{order.orderNumber || order._id}</h3>
          <p className="text-xs md:text-sm text-gray-500">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date N/A'}</p>
        </div>
        {/* Right side */}
        <div className="text-right flex-shrink-0 ml-2">
          <p className="font-semibold text-gray-800 text-sm md:text-base">{formatCurrency(order.totalAmount)}</p>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${getStatusClass(order.status)}`}>
            {order.status || 'Unknown'}
          </span>
        </div>
         {/* Chevron Indicator */}
         <div className="text-gray-400 flex-shrink-0">
             {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
         </div>
      </div>

      {/* Expanded View - Conditional rendering and accessibility */}
      {expanded && (
        <div
          id={`order-details-${order._id}`} // Match aria-controls
          className="mt-4 pt-4 border-t border-gray-200"
        >
           {/* Only show progress if order is not cancelled */}
           {order.status !== 'cancelled' && <OrderProgress status={order.status} />}
          <div className="mt-4"> {/* Reduced top margin */}
            <h4 className="font-semibold mb-2 text-gray-700 text-sm">Order Items</h4>
            <ul className="space-y-2"> {/* Reduced spacing */}
              {order.products && order.products.length > 0 ? (
                  order.products.map((item, index) => (
                    <li key={`${item.productId}-${item.color}-${item.size}-${index}`} className="flex justify-between items-center text-xs md:text-sm">
                      <div className="flex items-center mr-4 space-x-3">
                           {/* Optional: Item Image */}
                           <div className="w-10 h-10 rounded border bg-gray-100 flex-shrink-0 overflow-hidden">
                               <img src={item.image || '/placeholder.svg'} alt={item.name || ''} className="object-contain w-full h-full" onError={(e) => e.target.src = '/placeholder.svg'} />
                           </div>
                           <div>
                              <span className="font-medium text-gray-700 block">{item.name || 'Product Name'}</span>
                              {/* Display variant info if available */}
                              {(item.color || item.size) && (
                                 <span className="text-gray-500 text-xs block">
                                    {item.color && `Color: ${item.color}`} {item.size && `${item.color ? ' / ' : ''}Size: ${item.size}`}
                                 </span>
                              )}
                              <span className="text-gray-500 text-xs block">Qty: {item.quantity || 1}</span>
                          </div>
                      </div>
                      <span className="font-medium text-gray-800 flex-shrink-0">{formatCurrency(item.price)}</span>
                    </li>
                  ))
              ) : (
                 <p className="text-sm text-gray-500 italic">No item details available for this order.</p>
              )}
            </ul>
          </div>
          {/* Optional: Add Shipping Address Display Here */}
          {order.shippingAddress && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="font-semibold mb-1 text-gray-700 text-sm">Shipping Address</h4>
                  <address className="text-xs md:text-sm text-gray-600 not-italic leading-snug">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </address>
              </div>
          )}
        </div>
      )}
    </div>
  );
};


// --- Main Profile Component ---
const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
          setError("User ID not found in URL.");
          setLoading(false);
          return;
      }
      try {
        setLoading(true);
        setError(null);
        setUser(null);
        setOrders([]);

        // Fetch user and orders in parallel for efficiency
        const [userResponse, ordersResponse] = await Promise.all([
            axios.get(`${URL}/api/users/${userId}`),
            // Gracefully handle if the orders endpoint might return 404
            axios.get(`${URL}/api/users/${userId}/orders`).catch(err => {
                 if (err.response?.status === 404) {
                     console.log("No orders found for this user (API 404).");
                     return { data: [] }; // Treat as empty orders
                 }
                 throw err; // Re-throw other errors to be caught below
            })
        ]);

        // Validate responses
        if (!userResponse.data?._id) { // Check for essential user data like _id
            throw new Error("User data not found or invalid.");
        }
        if (!Array.isArray(ordersResponse.data)) {
             console.warn("Orders data received is not an array:", ordersResponse.data);
             // Decide how to handle: throw error or treat as empty
             throw new Error("Invalid format received for orders.");
        }

        setUser(userResponse.data);
        setOrders(ordersResponse.data);

      } catch (err) {
        console.error("Error fetching user profile data:", err.response?.data || err.message || err);
        setError(err.message || "Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, URL]); // Re-run only if userId or base URL changes


  // --- RENDER LOGIC ---

  // 1. Loading State
  if (loading) {
    return <ProfileSkeleton />; // Use the dedicated skeleton component
  }

  // 2. Error State
  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-100">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
                to="/" // Link to homepage
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 text-sm transition-colors"
            >
                Go to Homepage
            </Link>
        </div>
    );
  }

  // 3. User Not Found State
  if (!user) {
    // This case handles if loading finishes but user is still null (e.g., API returned null/empty)
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-100">
             <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Not Found</h2>
             <p className="text-gray-600 mb-6">We couldn't find profile information associated with this user ID.</p>
             <Link
                 to="/"
                 className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 text-sm transition-colors"
             >
                 Go to Homepage
             </Link>
        </div>
    );
  }

  // 4. Loaded State: Render Profile and Orders
  return (
    <div className="min-h-screen bg-gray-100 py-8 md:py-12"> {/* Added padding */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-8"> {/* Made profile card sticky */}
              <div className="flex flex-col items-center mb-6 text-center">
                {/* User Initial Circle */}
                <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-lime-400 to-green-500 text-white text-4xl flex items-center justify-center font-bold shadow-md uppercase">
                  {user.fullName?.slice(0, 1) || <User size={40} />}
                </div>
                <h1 className="text-xl font-bold text-gray-800">{user.fullName || 'User Name'}</h1>
                {/* Optional: Add role or join date */}
              </div>

              {/* Contact Details */}
              <div className="space-y-3 border-t border-gray-100 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Information</h3>
                <div className="flex items-center text-sm text-gray-700">
                  <Mail className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{user.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Phone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                  <span>{user.mobileNumber || 'No phone provided'}</span>
                </div>
                 {/* Display Address if available in user object */}
                 {/* Example:
                 {user.address && (
                    <div className="flex items-start text-sm text-gray-700">
                         <MapPin className="w-4 h-4 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                         <span className="leading-snug">{user.address.street}, {user.address.city}, {user.address.state} {user.address.zip}</span>
                     </div>
                 )}
                 */}
              </div>
               {/* Optional: Edit Profile Button */}
               {/* <div className="mt-6 border-t border-gray-100 pt-5">
                    <button className="w-full bg-lime-500 text-white py-2 rounded-md text-sm font-medium hover:bg-lime-600 transition-colors">
                        Edit Profile
                    </button>
               </div> */}
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <div className="flex items-center mb-5 border-b border-gray-100 pb-4">
                <ShoppingBag className="w-5 h-5 text-lime-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-800">My Orders</h2>
              </div>
              {/* Order List or Empty State */}
              <div className="space-y-4">
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))
                ) : (
                   // Improved Empty State
                   <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                       <Package size={40} className="mx-auto text-gray-400 mb-3"/>
                       <p className="text-lg font-medium text-gray-700">You haven't placed any orders yet.</p>
                       <p className="text-sm text-gray-500 mt-1 mb-4">Start shopping to see your orders here.</p>
                       <Link to={`/home-page/${userId || ''}`} className="text-sm text-lime-600 font-medium hover:underline">
                           Browse Products
                       </Link>
                   </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;