import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3, 
  ClipboardList 
} from 'lucide-react';

function Sidebar() {
  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/products', icon: <ShoppingBag size={20} />, label: 'Products' },
    { path: '/orders', icon: <ClipboardList size={20} />, label: 'Orders' },
    { path: '/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
  ];

  return (
    <div className="w-64 bg-black text-white shadow-lg">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-[#c8ff00]">Fashion Admin</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#c8ff00] text-black' // Active state with green background
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white' // Inactive state with gray text and hover effect
              }`
            }
          >
            <span className="text-[#c8ff00]">{item.icon}</span> {/* Icon color */}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
