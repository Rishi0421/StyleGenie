import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

function Analytics() {
  const metrics = [
    {
      title: 'Revenue',
      value: '$54,239',
      trend: '+12.5%',
      isPositive: true,
      icon: <DollarSign size={20} className="text-black" />
    },
    {
      title: 'Orders',
      value: '1,243',
      trend: '+8.3%',
      isPositive: true,
      icon: <ShoppingBag size={20} className="text-black" />
    },
    {
      title: 'Customers',
      value: '3,157',
      trend: '+15.2%',
      isPositive: true,
      icon: <Users size={20} className="text-black" />
    },
    {
      title: 'Inventory Value',
      value: '$123,456',
      trend: '-2.4%',
      isPositive: false,
      icon: <Package size={20} className="text-black" />
    }
  ];

  const topProducts = [
    { name: 'Nike Air Max', sales: 234, revenue: 30420 },
    { name: 'Denim Jacket', sales: 187, revenue: 24310 },
    { name: 'Running Shoes', sales: 156, revenue: 18720 },
    { name: 'Leather Bag', sales: 134, revenue: 16080 },
    { name: 'Summer Dress', sales: 98, revenue: 11760 }
  ];

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#c8ff00]">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-black shadow-sm border border-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#c8ff00] rounded-lg">
                {metric.icon}
              </div>
              <span className={`flex items-center text-sm ${
                metric.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.isPositive ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                {metric.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">{metric.title}</h3>
            <p className="text-2xl font-bold mt-1">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#c8ff00]">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 text-gray-500">{index + 1}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{product.sales} sales</span>
                  <span className="font-medium">${product.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black border border-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#c8ff00]">Sales by Category</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Shoes</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#c8ff00] h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Clothes</span>
                <span className="font-medium">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#c8ff00] h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Accessories</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#c8ff00] h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
