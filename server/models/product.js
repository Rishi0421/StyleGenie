const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends of a string
  },
  description: {
    type: String,
    default: "", // Optional, but good to have a default
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["shirts", "Shoes", "Clothes", "Accessories"], // Optional: Restrict to specific categories
  },
  regularPrice: {
    type: Number,
    required: true,
    min: 0, // Ensure price is not negative
  },
  salePrice: {
    type: Number,
    min: 0, // Ensure price is not negative
    default: null, // Optional: Use null to indicate no sale price
    validate: {
      // Optional: Validate salePrice is less than regularPrice
      validator: function (v) {
        return v === null || v <= this.regularPrice;
      },
      message: "Sale price must be less than or equal to regular price",
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0, // Ensure stock is not negative
    default: 0,
  },
  status: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Coming Soon"], // Optional: Restrict to specific statuses
    default: "In Stock",
  },
  images: {
    // Changed image (String) to images (Array of Strings)
    type: [String], // Array of image URLs
    default: [], // Default to an empty array
    trim: true,
  },
  colors: {
    type: [String], // Array of strings
    default: [],
  },
  sizes: {
    type: [String], // Array of strings
    default: [],
  },
  features: {
    type: [String], // Array of strings
    default: [],
  },
  collection: {
    type: String,
    default: "",
    trim: true,
    enum: ["popular", "newArrivals", "featured", "specialOffers", ""], // Optional: restrict to specific collections
  },
  lens_id: {
    type: String,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the update timestamp
  },
});

// Add a pre-save middleware to update the `updatedAt` field
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
