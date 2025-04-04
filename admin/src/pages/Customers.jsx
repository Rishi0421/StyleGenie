import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/api/users`); // Assuming your endpoint to get all users is /api/users
        setCustomers(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        console.error("Error fetching customers:", error);
        toast.error("Failed to load customers.");
      }
    };

    fetchCustomers();
  }, [URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">Loading customers...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        Error loading customers: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>

      <div className="bg-gray-900  rounded-xl shadow-lg">
        <div className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8ff00]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {customers.map((customer) => (
            <div
              key={customer._id}  // Use _id from MongoDB
              className="bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-[#c8ff00] text-black rounded-full flex items-center justify-center">
                  <span className="font-semibold text-xl">
                    {customer.fullName.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{customer.fullName}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Mail size={14} className="mr-2" />
                    <a href={`mailto:${customer.email}`} className="hover:text-[#c8ff00]">
                      {customer.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mt-1">
                    <Phone size={14} className="mr-2" />
                    <span>{customer.mobileNumber}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <div>
                  <p className="text-gray-500">Orders</p>
                  <p className="font-semibold">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Spent</p>
                  <p className="font-semibold">${customer.totalSpent}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Order</p>
                  <p className="font-semibold">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customers;