import React from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

function StatCard({ icon, title, value, trend }) {
  return (
    <div className="bg-black p-6 rounded-lg shadow-sm border border-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{value}</h3>
          <p className="text-sm text-green-400 mt-1">{trend}</p>
        </div>
        <div className="p-3 bg-[#c8ff00] rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const recentOrders = [
    { id: 'ORD123', customer: 'John Doe', date: '2025-03-28', status: 'Completed', total: '$123.45' },
    { id: 'ORD124', customer: 'Jane Smith', date: '2025-03-27', status: 'Pending', total: '$456.78' },
    { id: 'ORD125', customer: 'Alice Brown', date: '2025-03-26', status: 'Completed', total: '$78.99' },
    { id: 'ORD126', customer: 'Bob White', date: '2025-03-25', status: 'Shipped', total: '$332.50' },
  ];

  const topProducts = [
    { name: 'Product A', category: 'Shoes', sales: '$10,200' },
    { name: 'Product B', category: 'Clothes', sales: '$5,850' },
    { name: 'Product C', category: 'Accessories', sales: '$7,130' },
    { name: 'Product D', category: 'Shoes', sales: '$4,500' },
  ];

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign size={24} className="text-black" />}
          title="Total Revenue"
          value="$54,239"
          trend="+12.5% from last month"
        />
        <StatCard
          icon={<ShoppingBag size={24} className="text-black" />}
          title="Total Orders"
          value="1,243"
          trend="+8.3% from last month"
        />
        <StatCard
          icon={<Users size={24} className="text-black" />}
          title="Total Customers"
          value="3,157"
          trend="+15.2% from last month"
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-black" />}
          title="Conversion Rate"
          value="2.4%"
          trend="+4.1% from last month"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-black p-6 rounded-lg shadow-sm border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-white">Recent Orders</h2>
          <table className="w-full table-auto">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Order ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Customer</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 text-sm">{order.id}</td>
                  <td className="px-4 py-2 text-sm">{order.customer}</td>
                  <td className="px-4 py-2 text-sm">{order.date}</td>
                  <td className="px-4 py-2 text-sm">{order.status}</td>
                  <td className="px-4 py-2 text-sm">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="bg-black p-6 rounded-lg shadow-sm border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-white">Top Products</h2>
          <ul className="space-y-4">
            {topProducts.map((product) => (
              <li key={product.name} className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-white">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <span className="text-sm font-semibold text-white">{product.sales}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
