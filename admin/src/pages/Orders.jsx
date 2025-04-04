import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import axios from 'axios';

function Orders() {
  // Existing state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  // New state for orders from the database
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({}); // Store user names by ID

  const URL = import.meta.env.VITE_BE_URL; //URL in .env

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/api/orders`);
        setOrders(response.data);

        // Fetch user names for each order
        const userPromises = response.data.map(order =>
          axios.get(`${URL}/api/users/${order.user._id}`)
        );
        const userResponses = await Promise.all(userPromises);
        const names = {};
        userResponses.forEach(userRes => {
          names[userRes.data._id] = userRes.data.name; // Adjust 'name' if your user object uses a different field
        });
        setUserNames(names);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders.");
      }
    };

    fetchOrders();
  }, [URL]);

  const filteredOrders = orders.filter((order) => {
    const userName = userNames[order.user] || ''; // Default to empty string if user name not loaded
    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${URL}/api/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(`Failed to update order ${orderId} status.`);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-6">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Error loading orders: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-sm">
        <div className="p-4 ">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8ff00]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-700 rounded-lg px-4 py-2 text-white bg-gray-800 focus:ring-2 focus:ring-[#c8ff00]"
            >
              <option value="">All Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead className=" bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filteredOrders.map((order) => (
              <tr key={order._id} className=" ">
                <td className="px-6 py-4 text-sm font-medium text-[#c8ff00]">{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{userNames[order.user._id]}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.orderDate ? new Date(order.orderDate).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.products.length}</td>
                <td className="px-6 py-4 text-sm text-gray-300">${order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800':
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border border-gray-700 rounded px-2 py-1 text-sm text-white bg-gray-800 focus:ring-2 focus:ring-[#c8ff00]"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;