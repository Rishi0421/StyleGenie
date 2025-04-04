const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const Product = require("./models/product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Wishlist = require("./models/Wishlist"); // Import the Wishlist model
const Cart = require("./models/Cart"); // Import the Cart model
const { GoogleGenAI } = require("@google/genai");
const Orders = require("./models/order");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); //Store the file in the memory
const upload = multer({ storage: storage });

// Google GenAI Setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB || "mongodb://localhost:27017/your-database-name",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Function to generate image (modified to accept image buffers)
async function generateImage(shirtBuffer, personBuffer) {
  try {
    const shirtBase64 = shirtBuffer.toString("base64");
    const personBase64 = personBuffer.toString("base64");

    const contents = [
      {
        text: "Take the provided human image and digitally dress them in the given clothing image. Ensure that the clothing fits naturally on the person, with realistic folds, shadows, and alignment according to their posture. Maintain accurate proportions and blend the textures seamlessly for a photorealistic effect. Preserve the person's facial features and skin tone while ensuring the clothing looks as if it's actually worn. Adjust lighting and perspective to match the original photo for a natural look.",
      },
      {
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for both images (adjust if needed)
          data: personBase64,
        },
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: shirtBase64,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: contents,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    if (
      response &&
      response.candidates &&
      response.candidates.length > 0 &&
      response.candidates[0].content
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
          return { text: part.text }; // Return text response
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          //  fs.writeFileSync("gemini-native-image.png", buffer); // Don't write to disk directly
          console.log("Image generated (base64)");
          return { imageBase64: imageData }; // Return the base64 image data
        }
      }
    } else {
      console.error("Error: Invalid response format from the API.");
      console.error("Response:", response);
      throw new Error("Invalid response from Gemini API"); // Throw error for handling in API endpoint
    }
  } catch (error) {
    console.error("Error generating content:", error);
    throw error; // Re-throw the error for handling in the API endpoint
  }
}

app.get("/", (req, res) => {
  res.send("Hello from the server!"); // Basic endpoint to check if the server is running
});

// GET all users (for admin panel)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    // Calculate and add order information to each user
    const usersWithOrderInfo = await Promise.all(
      users.map(async (user) => {
        const orders = await Orders.find({ user: user._id }); // Find orders for the current user
        const totalOrders = orders.length;

        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        const lastOrderDate =
          orders.length > 0
            ? orders.reduce(
                (latest, order) =>
                  latest > order.orderDate ? latest : order.orderDate,
                orders[0].orderDate
              )
            : null;

        return {
          ...user.toObject(), // Convert mongoose document to plain object
          orders: totalOrders,
          totalSpent: totalSpent,
          lastOrderDate: lastOrderDate,
        };
      })
    );

    res.json(usersWithOrderInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // Send only _id and name
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/api/users/:userId/orders", async (req, res) => {
  try {
    // Assuming you have a model called "Orders" and a field called "userId"
    const orders = await Orders.find({ user: req.params.userId });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: "No orders found for this user" });
    }
    console.log(orders);
    res.status(200).json(orders); // Send the found orders
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Secret key for JWT (store this securely in a real app)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ***  Authentication API Endpoints  ***

// 1.  Sign-Up Endpoint
app.post("/api/signup", async (req, res) => {
  try {
    const { fullName, mobileNumber, email, password, confirmPassword } =
      req.body;

    // Validate input (add more validation as needed)
    if (!fullName || !mobileNumber || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      userId: newUser._id.toString(),
    });
  } catch (error) {
    console.error("Error signing up:", error);
    res
      .status(500)
      .json({ error: "Failed to create user.", details: error.message });
  }
});

// 2.  Sign-In Endpoint
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." }); // 401 Unauthorized
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    }); // Expires in 1 hour

    res.status(200).json({
      message: "Sign in successful.",
      token,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res
      .status(500)
      .json({ error: "Failed to sign in.", details: error.message });
  }
});

// API endpoint to retrieve all products (GET)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}); // Retrieve all products from the database
    res.status(200).json(products); // Send the products as a JSON response
  } catch (error) {
    console.error("Error retrieving products:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve products.", details: error.message });
  }
});

// API endpoint to retrieve a single product by ID (GET)
app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Send the product as a JSON response
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve product.", details: error.message });
  }
});

// API endpoint for product creation (POST)
app.post("/api/products", async (req, res) => {
  try {
    const productData = req.body;

    // Basic validation (add more as needed)
    if (
      !productData.name ||
      !productData.category ||
      !productData.regularPrice ||
      !productData.stock
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Ensure colors, sizes, and features are arrays
    if (productData.colors && typeof productData.colors === "string") {
      productData.colors = productData.colors.split(",").map((s) => s.trim());
    }
    if (productData.sizes && typeof productData.sizes === "string") {
      productData.sizes = productData.sizes.split(",").map((s) => s.trim());
    }
    if (productData.features && typeof productData.features === "string") {
      productData.features = productData.features
        .split(",")
        .map((s) => s.trim());
    }

    // Validate that images are an array
    if (!Array.isArray(productData.images)) {
      return res
        .status(400)
        .json({ error: "Images must be an array of image URLs." });
    }

    // Create a new product document using the Product model
    const newProduct = new Product(productData);

    // Save the new product to the database
    await newProduct.save();

    // Send a success response with the newly created product
    res.status(201).json(newProduct); // 201 Created
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ error: "Failed to create product.", details: error.message });
  }
});

// API endpoint for product update (PUT)
app.put("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;

    // Basic validation (add more as needed)
    if (
      !updatedProductData.name ||
      !updatedProductData.category ||
      !updatedProductData.regularPrice ||
      !updatedProductData.stock
    ) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Ensure colors, sizes, and features are arrays
    if (
      updatedProductData.colors &&
      typeof updatedProductData.colors === "string"
    ) {
      updatedProductData.colors = updatedProductData.colors
        .split(",")
        .map((s) => s.trim());
    }
    if (
      updatedProductData.sizes &&
      typeof updatedProductData.sizes === "string"
    ) {
      updatedProductData.sizes = updatedProductData.sizes
        .split(",")
        .map((s) => s.trim());
    }
    if (
      updatedProductData.features &&
      typeof updatedProductData.features === "string"
    ) {
      updatedProductData.features = updatedProductData.features
        .split(",")
        .map((s) => s.trim());
    }

    // Validate that images are an array
    if (!Array.isArray(updatedProductData.images)) {
      return res
        .status(400)
        .json({ error: "Images must be an array of image URLs." });
    }

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true }
    ); // { new: true } returns the updated document

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Send a success response with the updated product
    res.status(200).json(updatedProduct); // 200 OK
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ error: "Failed to update product.", details: error.message });
  }
});

// API endpoint for product deletion (DELETE)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Send a success response
    res.status(200).json({ message: "Product deleted successfully." }); // 200 OK
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Failed to delete product.", details: error.message });
  }
});
// API endpoint for handling image uploads
app.post(
  "/api/generate-image",
  upload.fields([
    { name: "shirt", maxCount: 1 },
    { name: "person", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["shirt"] || !req.files["person"]) {
        return res
          .status(400)
          .json({ error: "Please upload both shirt and person images." });
      }

      const shirtBuffer = req.files["shirt"][0].buffer;
      const personBuffer = req.files["person"][0].buffer;

      // Call the generateImage function
      const result = await generateImage(shirtBuffer, personBuffer);

      res.json(result); // Send the result back to the frontend (either text or base64 image)
    } catch (error) {
      console.error("Error in API endpoint:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to generate image." });
    }
  }
);

// API endpoint to add/remove product to/from wishlist
app.post("/api/wishlist", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Check if the user has a wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      // If the wishlist doesn't exist, create a new one
      wishlist = new Wishlist({
        user: userId,
        products: [productId],
      });
      await wishlist.save();
      return res
        .status(201)
        .json({ message: "Product added to new wishlist", wishlist });
    }

    // Check if the product is already in the wishlist
    const productIndex = wishlist.products.indexOf(productId);

    if (productIndex > -1) {
      // If the product is already in the wishlist, remove it
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Product removed from wishlist", wishlist });
    } else {
      // If the product is not in the wishlist, add it
      wishlist.products.push(productId);
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Product added to wishlist", wishlist });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API endpoint to check if a product is in the user's wishlist
app.get("/api/wishlist/check/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    // Check if the user has a wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({ isInWishlist: false }); // Wishlist doesn't exist, so product is not in it
    }

    // Check if the product is in the wishlist
    const isInWishlist = wishlist.products.includes(productId);

    res.status(200).json({ isInWishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Backend (Express with Mongoose example)
app.get("/api/wishlist/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }); // Populate to get product details if needed

    if (!wishlist) {
      // If the wishlist doesn't exist for the user, return an empty array.  This is important.
      return res.status(200).json({ wishlistItems: [] });
    }
    // If the wishlist exists, send the products array.
    res.status(200).json({ wishlistItems: wishlist.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API endpoint to add a product to the cart
app.post("/add", async (req, res) => {
  try {
    const { userId, productId, color, size, quantity } = req.body;

    // 1. Validate Input (Very Important)
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Validate Product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3. Find or Create Cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // 4. Check if Item Exists in Cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.equals(productId) &&
        item.color === color &&
        item.size === size
    );

    if (existingItemIndex > -1) {
      // Update Quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add New Item
      cart.items.push({
        productId: productId,
        name: product.name,
        image: product.images[0],
        price: product.salePrice,
        color: color,
        size: size,
        quantity: quantity,
      });
    }

    // 5. Save Cart
    await cart.save();

    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart }); // Send back the updated cart (optional)
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }); // Populate for product details

    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty array if no cart
    }

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/api/cart/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => !item.productId.equals(productId)); // Remove the item

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/cart/update/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart quantity updated", cart });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Orders.find().populate("user").sort({ orderDate: -1 }); // Fetch all orders and populate the user
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/orders/create", async (req, res) => {
  try {
    const { userId, items, address, total } = req.body;

    // 1. Validate Input
    if (!userId || !items || !address || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Create the Order
    const order = new Orders({
      user: userId,
      products: items.map((item) => ({
        // Map cart items to the products array
        product: item._id, // Product ID from cart item
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      })),
      shippingAddress: address, // Rename if you have different field names
      totalAmount: total,
      paymentMethod: "COD", //Example - set payment method here as required.
      orderDate: new Date(),
      status: "pending", // Default order status
    });

    await order.save();

    // 3. Clear the Cart (Important)  - (See previous example for how to do this)
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = []; // Clear the cart items
      await cart.save();
    }

    res
      .status(201)
      .json({ message: "Order created successfully", order: order }); // Send back the order
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order created successfully", order: order }); // Send back the order details
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await Orders.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.status(500).send("Server Error");
  }
});

// module.exports = router;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
