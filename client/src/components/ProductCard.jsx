import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState(product.images || ["/placeholder.svg"]); //Handle missing images
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [intervalId, setIntervalId] = useState(null); // Store interval id

  const {userId} = useParams(); // Get userId from URL params
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setImages(product.images);
    } else {
      setImages(["/placeholder.svg"]); // Fallback to placeholder image
    }
  }, [product]);

  const startSlider = () => {
    const newIntervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Change image every 3 seconds
    setIntervalId(newIntervalId); // Store the interval ID
  };

  const stopSlider = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null); // Clear the stored interval ID
    }
  };

  useEffect(() => {
    if (isHovered) {
      startSlider();
    } else {
      stopSlider();
    }

    return () => stopSlider(); // Cleanup on unmount
  }, [isHovered, images]);

  return (
    <Link
      to={`/product/${product._id}/${userId}`}
      className="product-card block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative h-80">
          <img
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            className="object-cover w-full h-full transition-opacity duration-500 ease-in-out" //Added smooth transition
          />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium uppercase">{product.name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-orange-500 font-bold">₹{product.salePrice}</span>
          <span className="ml-2 text-gray-500 line-through text-sm">₹{product.regularPrice}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard