import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import axios from 'axios';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = import.meta.env.VITE_BE_URL; // Use environment variable or default to localhost

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/api/products`); // Replace with your API endpoint
        //Transform the data
        const transformedInventory = response.data.map(product => ({
          id: product._id, // Use _id from MongoDB
          name: product.name,
          sku: product._id.substring(0, 8).toUpperCase(), // Generate a simple SKU from the ID
          inStock: product.stock,
          lowStock: product.stock <= product.reorderPoint, // You might need to add a reorderPoint field to your products
          reorderPoint: 10,
          category: product.category,
          lastUpdated: new Date(product.updatedAt).toLocaleDateString(), // Format the date
          image: product.image, //Include the image URL
        }));
        setInventory(transformedInventory);
        setLoading(false);

      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching inventory:", err);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <div className="p-6">Loading inventory data...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.lowStock).length;
  const outOfStockItems = inventory.filter(item => item.inStock === 0).length;

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Items</h3>
          <p className="text-3xl font-bold">{totalItems}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-yellow-600">{lowStockItems}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">{outOfStockItems}</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gray-900 rounded-xl shadow-lg">
        <div className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8ff00]"
              />
            </div>
            <select className="border border-gray-700 rounded-lg px-4 py-2 text-white bg-gray-800 focus:ring-2 focus:ring-[#c8ff00]">
              <option value="">All Categories</option>
              <option value="shirts">Shirts</option>
              <option value="Shoes">Shoes</option>
              <option value="clothes">Clothes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <table className="w-full bg-gray-900 rounded-lg shadow-md mt-6">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {inventory.map((item) => (
              <tr key={item.id} className=''>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                   <img
                      src={item.images}
                      alt={item.name}
                      className="h-10 w-10 rounded-lg object-cover mr-2"
                    />
                    <div className="text-sm font-medium text-gray-300">{item.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{item.inStock}</td>
                <td className="px-6 py-4">
                  {item.lowStock ? (
                    <span className="flex items-center text-yellow-600">
                      <AlertTriangle size={16} className="mr-1" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-600">Good Stock</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
