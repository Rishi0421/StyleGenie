"use client";

import { useState, useEffect, useRef } from "react";
import HeroSlider from "../components/HeroSlider";
import BrandLogos from "../components/BrandLogos";
import ProductCard from "../components/ProductCard";
import SpecialOffer from "../components/SpecialOffer";
import SkeletonProductCard from "../components/SkeletonProductCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { motion } from "framer-motion"; // Import Framer Motion

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productGridRef = useRef(null); // Ref for the product grid
  const heroRef = useRef(null);
  const logosRef = useRef(null);
  const headingRef = useRef(null);

  const URL = import.meta.env.VITE_BE_URL;
  const { userId } = useParams() || {};

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${URL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [URL]);

  useEffect(() => {
    // GSAP Animations on initial load
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2 }
    );
    gsap.fromTo(
      logosRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4 }
    );
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      }
    );

    // GSAP animation for product grid on initial load
    if (productGridRef.current && !loading) {
      gsap.fromTo(
        productGridRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [loading]);

  // GSAP animation for product grid on tab change
  useEffect(() => {
    if (productGridRef.current && !loading) {
      gsap.fromTo(
        productGridRef.current.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [activeTab, products, loading]);

  let filteredProducts = [];
  if (activeTab === "all") {
    filteredProducts = [...products].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (activeTab === "newArrivals") {
    filteredProducts = products.filter(
      (product) => product.collection === "newArrivals"
    );
  } else if (activeTab === "popular") {
    filteredProducts = [...products].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  } else {
    filteredProducts = products;
  }

  const skeletonCount = 8;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-red-600">
        Error loading products: {error.message}. Please try again later.
      </div>
    );
  }

  const tabButtonVariants = {
    rest: { scale: 1, backgroundColor: "transparent", color: "black" },
    hover: {
      scale: 1.05,
      backgroundColor: "#99cc00",
      color: "black",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
    active: {
      scale: 1,
      backgroundColor: "#c8ff00",
      color: "black",
      transition: { duration: 0.2 },
    },
  };

  return (
    <div>
      <div ref={heroRef}>
        <HeroSlider />
      </div>
      <div ref={logosRef}>
        <BrandLogos />
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2
            className="text-4xl font-bold text-center mb-10"
            ref={headingRef}
          >
            OUR COLLECTIONS
          </h2>

          <div className="collection-tabs flex justify-center mb-10 space-x-4">
            <motion.button
              variants={tabButtonVariants}
              animate={activeTab === "all" ? "active" : "rest"}
              whileHover="hover"
              whileTap="tap"
              className="border-2 px-6 py-3 rounded-3xl font-semibold transition-all duration-300 ease-in-out hover:shadow-lg"
              onClick={() => setActiveTab("all")}
            >
              All Collections
            </motion.button>
            <motion.button
              variants={tabButtonVariants}
              animate={activeTab === "newArrivals" ? "active" : "rest"}
              whileHover="hover"
              whileTap="tap"
              className="border-2 px-6 py-3 rounded-3xl font-semibold transition-all duration-300 ease-in-out hover:shadow-lg"
              onClick={() => setActiveTab("newArrivals")}
            >
              NEW COLLECTIONS
            </motion.button>
            <motion.button
              variants={tabButtonVariants}
              animate={activeTab === "popular" ? "active" : "rest"}
              whileHover="hover"
              whileTap="tap"
              className="border-2 px-6 py-3 rounded-3xl font-semibold transition-all duration-300 ease-in-out hover:shadow-lg"
              onClick={() => setActiveTab("popular")}
            >
              POPULAR COLLECTIONS
            </motion.button>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            ref={productGridRef}
          >
            {loading ? (
              Array.from({ length: skeletonCount }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  userId={userId}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No products found for this collection.
              </p>
            )}
          </div>
        </div>
      </section>

      <SpecialOffer />
    </div>
  );
};

export default HomePage;