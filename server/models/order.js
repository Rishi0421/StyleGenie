const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StyleGenie-User", // Reference to the User
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true, //Ensures unique order numbers
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StyleGenie-Product", // Reference to the Product
          required: true,
        },
        name: {
          type: String, //Storing product name, helps if product is later removed
          required: true,
        },
        image: {
          type: String, // Store the image URL for record keeping
        },
        price: {
          type: Number, // Price at the time of order
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        color: {
          type: String, // Store color selected
        },
        size: {
          type: String, // Store size selected
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, default: "India" }, //Setting default country
    },
    // billingAddress: {
    //   street: { type: String, required: true },
    //   city: { type: String, required: true },
    //   state: { type: String, required: true },
    //   zip: { type: String, required: true },
    //   country: { type: String, default: "India" }, //Setting default country
    // },
    shippingMethod: {
      type: String, //Example "Standard", "Express"
    },
    paymentMethod: {
      type: String, //Ex: "Credit Card", "UPI", "COD"
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date, //Estimated Delivery Date
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ], // Added 'returned'
      default: "pending",
    },
    cancellationReason: {
      type: String, //If order is cancelled, a reason why
    },
    customerNotes: {
      type: String, //Any notes customer added
    },
    shippingCost: {
      type: Number,
      default: 0, //Default to zero
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to generate a unique order number before saving
orderSchema.pre("validate", async function (next) {
  if (!this.orderNumber) {
    //Generate a unique order number (ex: using date and random number)
    this.orderNumber = `SG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

const Orders = mongoose.model("StyleGenie-Order", orderSchema);
module.exports = Orders;
