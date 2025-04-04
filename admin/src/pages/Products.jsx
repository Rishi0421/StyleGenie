import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload } from 'lucide-react';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import axios from 'axios'; // Import axios

function ProductModal({ isOpen, onClose, product, mode }) {
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);

  const URL = import.meta.env.VITE_BE_URL;
  // const URL = 'http://localhost:3000'; // Replace with your backend URL
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    regularPrice: '',
    salePrice: '',
    stock: '',
    status: 'In Stock',
    images: [],  // Changed image to images (array)
    colors: [],
    sizes: [],
    features: [],
    collection: '',
    lens_id: '',
  });
  const fileInputRef = useRef(null);
    const [previewImages, setPreviewImages] = useState([]); // For multiple previews
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (product) {
      setFormData({...product, images: product.images || []}); // Ensure images is always an array
      setPreviewImages(product.images || []);
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        regularPrice: '',
        salePrice: '',
        stock: '',
        status: 'In Stock',
        images: [],
        colors: [],
        sizes: [],
        features: [],
        collection: '',
        lens_id: '',
      });
      setPreviewImages([]);
    }
  }, [product]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array

        const newImages = [];
        const newPreviews = [];

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result);
                newPreviews.push(reader.result);

                if (newImages.length === files.length) {
                    setFormData({ ...formData, images: [...formData.images, ...newImages] }); // Append new images
                    setPreviewImages([...previewImages, ...newPreviews]); // Append new previews
                }

            };
            reader.readAsDataURL(file);
        });
    };


  const handleSubmit = async (e) => {
    // Make handleSubmit async
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      console.log(mode)
      if (mode === 'add') {
        // API call for adding a product
        const response = await axios.post(`${URL}/api/products`, formData); // Replace '/api/products' with your actual API endpoint
        if (response.status === 201) {
          // Assuming 201 Created is the success status
          addProduct(response.data); // Assuming the API returns the new product
          toast.success('Product added successfully!');
        } else {
          toast.error('Failed to add product.');
        }
      } else {
        // API call for updating a product
        const response = await axios.put(
          `${URL}/api/products/${product._id}`,
          formData
        ); // Replace with your API endpoint
        if (response.status === 200) {
          // Assuming 200 OK is the success status
          updateProduct(product._id, response.data); // Assuming the API returns the updated product
          toast.success('Product updated successfully!');
        } else {
          toast.error('Failed to update product.');
        }
      }
      onClose();
    } catch (error) {
      console.error('API Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-black p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <button onClick={onClose} className="hover:opacity-75">
            <X size={20} color="white" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
              required
            >
              <option value="">Select category</option>
              <option value="shirts">Shirts</option>
              <option value="Shoes">Shoes</option>
              <option value="Clothes">Clothes</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Regular Price
            </label>
            <input
              type="number"
              value={formData.regularPrice}
              onChange={(e) =>
                setFormData({ ...formData, regularPrice: parseFloat(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Sale Price (Optional)
            </label>
            <input
              type="number"
              value={formData.salePrice}
              onChange={(e) =>
                setFormData({ ...formData, salePrice: parseFloat(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Product Images
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                  multiple // Allow multiple file selection
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700"
              >
                <Upload className="h-5 w-5 mr-2" color="white" />
                Upload Images
              </button>
            </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {previewImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
          </div>

          {/* Collection */}
          <div>
            <label className="block text-sm font-medium text-white">
              Collection
            </label>
            <select
              value={formData.collection}
              onChange={(e) =>
                setFormData({ ...formData, collection: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
            >
              <option value="">Select Collection</option>
              <option value="popular">Popular</option>
              <option value="newArrivals">New Arrivals</option>
              <option value="featured">Featured</option>
              <option value="specialOffers">Special Offers</option>
            </select>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-white">Colors</label>
            <input
              type="text"
              value={formData.colors}
              onChange={(e) =>
                setFormData({ ...formData, colors: e.target.value.split(',') })
              }
              placeholder="Enter colors separated by commas"
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-white">Sizes</label>
            <input
              type="text"
              value={formData.sizes}
              onChange={(e) =>
                setFormData({ ...formData, sizes: e.target.value.split(',') })
              }
              placeholder="Enter sizes separated by commas"
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-white">Features</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value.split(',') })
              }
              placeholder="Enter features separated by commas"
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
            />
          </div>

          {/* Lens ID */}
          <div>
            <label className="block text-sm font-medium text-white">
              Lens ID (Optional)
            </label>
            <input
              type="text"
              value={formData.lens_id}
              onChange={(e) =>
                setFormData({ ...formData, lens_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-700 shadow-sm focus:border-[#c8ff00] focus:ring-[#c8ff00] bg-gray-800 text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#c8ff00] text-black rounded-lg hover:bg-[#8ec700]"
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? 'Loading...' : mode === 'add' ? 'Add Product' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [products, setProducts] = useState([]); // Use local state for products
  const deleteProduct = useStore((state) => state.deleteProduct);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const URL = import.meta.env.VITE_BE_URL;

  useEffect(() => {
    // Fetch products from the API when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products.');
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`${URL}/api/products/${id}`); // Replace with your API endpoint
        if (response.status === 200) {
          setProducts(products.filter((product) => product._id !== id)); // Update local state
          toast.success('Product deleted successfully!');
        } else {
          toast.error('Failed to delete product.');
        }
      } catch (error) {
        console.error('API Error:', error);
        toast.error('An error occurred while deleting. Please try again.');
      }
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 rounded-lg hover:bg-[#8ec700]"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 ">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8ff00] text-white bg-gray-800"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-700 rounded-lg px-4 py-2 text-white bg-gray-800 focus:ring-2 focus:ring-[#c8ff00]"
            >
              <option value="">All Categories</option>
              <option value="Shoes">Shoes</option>
              <option value="Clothes">Clothes</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regular Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ${product.regularPrice}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ${product.salePrice}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        mode={modalMode}
      />
    </div>
  );
}

export default Products;